import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Tesseract from "tesseract.js";
import { createRequire } from "module";
import conexion from "../../conexion.js";

const require = createRequire(import.meta.url);
const pdfParseModule = require("pdf-parse");
const pdfParse =
  pdfParseModule && typeof pdfParseModule === "object" && pdfParseModule.default
    ? pdfParseModule.default
    : pdfParseModule;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar almacenamiento de multer
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de archivo no permitido. Usa PDF, JPG o PNG"));
    }
  },
});

export default function uploadPedidos(io) {
  const router = express.Router();

  /**
   * Extrae texto de una imagen usando OCR
   */
  async function extractTextFromImage(filePath) {
    try {
      const result = await Tesseract.recognize(filePath, "spa");
      return result.data.text;
    } catch (error) {
      console.error("Error en OCR:", error);
      throw new Error("Error al procesar la imagen");
    }
  }

  /**
   * Extrae texto de un PDF
   */
  async function extractTextFromPDF(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (error) {
      console.error("Error en PDF parse:", error);
      throw new Error("Error al procesar el PDF");
    }
  }

  /**
   * Extrae información del texto usando patrones regex
   */
  function extractDataFromText(text) {
    const data = {
      numAlbaran: null,
      cliente: null,
      Nif: null,
      tel: null,
      dir: null,
      materiales: [],
      colores: [], // Array para colores RAL
      observaciones: "",
    };

    // Buscar número de albarán/pedido
    const numMatch = text.match(
      /(?:albarán|albaran|pedido|número|num)[\s:]*(\d+)/i,
    );
    if (numMatch) {
      data.numAlbaran = numMatch[1];
    }

    // Buscar cliente (línea con mayúsculas seguida de más texto)
    const clienteMatch = text.match(
      /(?:cliente|empresa|de:|a:)\s+([A-Za-z\s&áéíóúÁÉÍÓÚ]+?)(?:\n|nif|dni|cif|tel|\d{8,})/i,
    );
    if (clienteMatch) {
      data.cliente = clienteMatch[1].trim();
    }

    // Buscar NIF/DNI/CIF
    const nifMatch = text.match(
      /(?:nif|dni|cif|cif-nif)[\s:]*([A-Za-z0-9-]+)/i,
    );
    if (nifMatch) {
      data.Nif = nifMatch[1].trim();
    }

    // Buscar teléfono
    const telMatch = text.match(
      /(?:tel|teléfono|phone)[\s:]*(\+?\d[\d\s\-()]{7,})/i,
    );
    if (telMatch) {
      data.tel = telMatch[1].replace(/\s/g, "").trim();
    }

    // Buscar dirección
    const dirMatch = text.match(
      /(?:dirección|direccion|address|calle|avenida|avda)[\s:]*([^\n]+)/i,
    );
    if (dirMatch) {
      data.dir = dirMatch[1].trim();
    }

    // Buscar materiales (referencias, cantidades, descripciones)
    // Patrón: código/referencia - descripción - cantidad - unidad
    const materialMatches = text.matchAll(
      /([A-Z0-9]+)\s*[-–]\s*([^-\n]+?)\s*[-–]\s*(\d+(?:[.,]\d+)?)\s*(kg|l|ud|unidades?|litro|kilo|m3|m2|ral)/gi,
    );
    for (const match of materialMatches) {
      data.materiales.push({
        ref: match[1].trim(),
        mat: match[2].trim(),
        unid: parseFloat(match[3].replace(",", ".")),
        unit: match[4].trim(),
      });
    }

    // BUSCAR RAL/COLORES ESPECÍFICAMENTE
    // Patrón RAL: "RAL" seguido de espacios y 4 dígitos (ej: RAL 9005, RAL3000, RAL 3000)
    const ralMatches = text.matchAll(
      /(?:ral|color|ref\.?\s*color)\s*[\:=]?\s*([0-9]{4,}|\d{2,}\s?\d{2,})/gi,
    );
    for (const match of ralMatches) {
      const ralCode = match[1].trim().replace(/\s/g, ""); // Elimina espacios
      if (!data.colores.includes(ralCode)) {
        data.colores.push(ralCode);
      }
    }

    // Si no encuentra colores con patrón RAL explícito, busca por palabras clave
    if (data.colores.length === 0) {
      const colorLines = text
        .split("\n")
        .filter(
          (line) => /ral|color|pintura/i.test(line) && /\d{4}/.test(line),
        );

      for (const line of colorLines) {
        const numMatch = line.match(/\d{4,}/);
        if (numMatch) {
          const code = numMatch[0];
          if (!data.colores.includes(code)) {
            data.colores.push(code);
          }
        }
      }
    }

    // Si no encuentra materiales con patrón, intenta extrae líneas que parezcan materiales
    if (data.materiales.length === 0) {
      const lines = text.split("\n");
      for (const line of lines) {
        if (line.match(/\d+\s*(kg|l|ud|litro|kilo)/i) && line.length > 10) {
          const cantMatch = line.match(
            /(\d+(?:[.,]\d+)?)\s*(kg|l|ud|litro|kilo)/i,
          );
          if (cantMatch) {
            data.materiales.push({
              ref: `REF-${Date.now()}`,
              mat: line.replace(cantMatch[0], "").trim(),
              unid: parseFloat(cantMatch[1].replace(",", ".")),
              unit: cantMatch[2],
            });
          }
        }
      }
    }

    return data;
  }

  /**
   * Endpoint POST para subir y procesar archivos
   */
  router.post("/upload", upload.single("file"), async (req, res) => {
    let filePath = null;
    let connection;

    try {
      if (!req.file) {
        return res.status(400).json({ error: "No se proporcionó archivo" });
      }

      filePath = req.file.path;
      let extractedText = "";

      // Determinar tipo de archivo y extraer texto
      const fileExt = path.extname(req.file.originalname).toLowerCase();

      if (fileExt === ".pdf") {
        extractedText = await extractTextFromPDF(filePath);
      } else {
        extractedText = await extractTextFromImage(filePath);
      }

      // Extraer datos estructurados del texto
      const extractedData = extractDataFromText(extractedText);

      // Validar datos mínimos
      if (!extractedData.numAlbaran) {
        extractedData.numAlbaran = `ALB-${Date.now()}`;
      }
      if (!extractedData.cliente) {
        return res.status(400).json({
          error: "No se pudo extraer el nombre del cliente del documento",
          data: extractedData,
          text: extractedText.substring(0, 500), // Primeros 500 caracteres para debugging
        });
      }

      // Guardar en base de datos
      connection = await conexion.getConnection();
      await connection.beginTransaction();

      // Verificar si el cliente existe, si no, crearlo
      const queryCheckUser =
        "SELECT id FROM cliente WHERE nombre = ? AND Nif = ?";
      const [clientRows] = await connection.query(queryCheckUser, [
        extractedData.cliente,
        extractedData.Nif || "",
      ]);

      let clienteId;
      if (clientRows.length > 0) {
        clienteId = clientRows[0].id;
      } else {
        clienteId =
          Date.now().toString(36) + Math.random().toString(36).substring(2);
        const queryAddCliente =
          "INSERT INTO cliente (id, nombre, Nif, tel, dir) VALUES (?, ?, ?, ?, ?)";
        await connection.query(queryAddCliente, [
          clienteId,
          extractedData.cliente,
          extractedData.Nif || "",
          extractedData.tel || "",
          extractedData.dir || "",
        ]);
      }

      // Crear albarán
      const queryAlbaranes =
        "INSERT INTO Albaranes (id, nCliente, proceso, idPedido) VALUES (?, ?, ?, ?)";
      await connection.query(queryAlbaranes, [
        extractedData.numAlbaran,
        extractedData.cliente,
        "pendiente",
        extractedData.numAlbaran,
      ]);

      // Procesar materiales
      const queryCheckMateriales =
        "SELECT nombre FROM productos WHERE nombre = ?";
      const queryInsertMateriales =
        "INSERT INTO productos (id, nombre, uni, refObra) VALUES (?, ?, ?, ?)";
      const queryAlbaranMateriales =
        "INSERT INTO AlbaranMateriales (idAlbaran, idMaterial, cantidad, observaciones) VALUES (?, ?, ?, ?)";

      for (const material of extractedData.materiales) {
        // Verificar si el material existe
        const [matRows] = await connection.query(queryCheckMateriales, [
          material.mat,
        ]);

        if (matRows.length === 0) {
          // Crear material si no existe
          await connection.query(queryInsertMateriales, [
            material.ref,
            material.mat,
            material.unit,
            material.ref,
          ]);
        }

        // Asociar material al albarán
        await connection.query(queryAlbaranMateriales, [
          extractedData.numAlbaran,
          material.ref,
          material.unid,
          extractedData.observaciones,
        ]);
      }

      await connection.commit();

      // Emitir evento a través de Socket.IO
      io.emit("nuevoAlbaran", {
        numAlbaran: extractedData.numAlbaran,
        cliente: extractedData.cliente,
        estado: "pendiente",
      });

      // Respuesta exitosa
      res.status(200).json({
        message: "Albarán creado correctamente desde documento",
        data: {
          numAlbaran: extractedData.numAlbaran,
          cliente: extractedData.cliente,
          Nif: extractedData.Nif,
          tel: extractedData.tel,
          dir: extractedData.dir,
          materiales: extractedData.materiales,
          colores: extractedData.colores, // Incluir colores RAL en respuesta
          extractedText: extractedText.substring(0, 1000), // Primeros 1000 caracteres
        },
      });
    } catch (error) {
      console.error("Error en upload:", error);

      if (connection) {
        try {
          await connection.rollback();
        } catch (rollbackError) {
          console.error("Error al revertir transacción:", rollbackError);
        }
      }

      res.status(500).json({
        error: error.message || "Error al procesar el documento",
      });
    } finally {
      if (connection) connection.release();

      // Limpiar archivo temporal
      if (filePath && fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error al eliminar archivo temporal:", err);
        });
      }
    }
  });

  return router;
}
