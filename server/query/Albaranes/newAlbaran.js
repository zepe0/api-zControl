import express from "express";
import conexion from "../../conexion.js";

export default function newAlbaran(io) {
  const router = express.Router();

  const normalizarRalInfo = (ralInput) => {
    const raw = String(ralInput ?? "").trim();

    // Extrae el bloque RAL: 4 dígitos + marcador opcional de mate (m o mate)
    // Ejemplos válidos: "9001", "9001 M", "9001m", "9001 mate"
    const ralMatch = raw.match(/(\d{4})(?:\s*(mate|m)\b)?/i);
    const ralBase = ralMatch ? ralMatch[1] : "";
    const esMate = Boolean(ralMatch?.[2]);
    const ralCodigo = ralBase ? (esMate ? `${ralBase} M` : ralBase) : "";

    // Limpia marca quitando solo el bloque detectado al inicio, sin borrar letras sueltas globalmente
    let marcaLimpia = raw;
    if (ralMatch?.[0]) {
      marcaLimpia = marcaLimpia.replace(ralMatch[0], " ");
    }
    marcaLimpia = marcaLimpia
      .replace(/[\-_/]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return {
      ralCodigo,
      esMate,
      marca: marcaLimpia || "Genérica",
    };
  };

  router.post("/add", async (req, res) => {
    const {
      numAlbaran,
      cliente,
      Nif,
      nif,
      tel,
      dir,
      albaran,
      firma,
      observaciones,
      ral,
      estado,
    } = req.body;
    let error;
    let clienteId;
    const nifValue = Nif ?? nif ?? null;
    let connection; // Variable para la conexión específica

    try {
      // Obtener una conexión del pool
      connection = await conexion.getConnection();

      // Iniciar la transacción
      await connection.beginTransaction();

      const queryCliente =
        "INSERT INTO cliente (id,nombre, Nif, tel, dir) VALUES (?, ?, ?, ?,?)";

      const queryCheckUser =
        "SELECT id FROM cliente WHERE nombre = ? AND Nif = ?";
      const [rows] = await connection.query(queryCheckUser, [
        cliente,
        nifValue,
      ]);

      if (rows.length <= 0) {
        clienteId =
          Date.now().toString(36) + Math.random().toString(36).substring(2);
        await connection.query(queryCliente, [
          clienteId,
          cliente,
          nifValue,
          tel,
          dir,
        ]);
      } else {
        clienteId = rows[0].id;
      }

      const queryAlbaranes =
        "INSERT INTO pedidos (id, cliente_id, estado, observaciones) VALUES (?, ?, ?, ?)";
      await connection.query(queryAlbaranes, [
        numAlbaran,
        clienteId,
        estado,
        numAlbaran,
      ]);
      // Comprobar e insertar materiales en la tabla Materiales (buscar por ID/ref)
      // Si ya existe el producto, no se modifica; las medidas específicas van en pedido_lineas
      const queryCheckMateriales = "SELECT id FROM productos WHERE id = ?";
      const queryInsertMateriales =
        "INSERT INTO productos (id, nombre, uni) VALUES (?, ?, ?)";

      for (const material of albaran) {
        const { ref, mat, unid } = material;
        const [rows] = await connection.query(queryCheckMateriales, [ref]);

        if (rows.length === 0) {
          await connection.query(queryInsertMateriales, [ref, mat, unid ?? 1]);
        }
        // Si ya existe, no se toca: las medidas propias de este pedido van en pedido_lineas
      }

      // Insertar materiales en la tabla pedido_lineas
      const queryAlbaranMateriales =
        "INSERT INTO pedido_lineas (pedido_id, producto_id, cantidad, ral, observaciones, refObra, unidad_medida, precio_unitario, largo, ancho, espesor, tiene_imprimacion, fabricacion_manual, fecha_fabricacion_manual, nombre_snapshot) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

      for (const material of albaran) {
        // Snapshot por línea: usar valores calculados/confirmados por el front
        const {
          ref,
          unid,
          cantidad,
          Ral,
          ral,
          consumo,
          refObra,
          unidad_medida,
          precio_unitario,
          precio_sugerido,
          precioUnitario,
          precio,
          largo,
          ancho,
          espesor,
          tiene_imprimacion,
          fabricacion_manual,
          fecha_fabricacion_manual,
          mat,
        } = material;
        const ralRawValue = Ral || ral || "Sin especificar";
        const ralInfo = normalizarRalInfo(ralRawValue);
        const ralValue = ralInfo.ralCodigo || "Sin especificar";
        const cantidadParse = Number.parseFloat(
          String(cantidad ?? unid ?? 1).replace(",", "."),
        );
        const cantidadValue = Number.isNaN(cantidadParse) ? 1 : cantidadParse;
        const precioRaw =
          precio_unitario ?? precioUnitario ?? precio_sugerido ?? precio ?? 0;
        const precioUnitarioValue = Number.parseFloat(
          String(precioRaw).replace(",", "."),
        );
        const parseDecimalOrNull = (value) => {
          if (
            value === undefined ||
            value === null ||
            String(value).trim() === ""
          ) {
            return null;
          }
          const parsed = Number.parseFloat(String(value).replace(",", "."));
          return Number.isNaN(parsed) ? null : parsed;
        };
        const largoValue = parseDecimalOrNull(largo);
        const anchoValue = parseDecimalOrNull(ancho);
        const espesorValue = parseDecimalOrNull(espesor) ?? 1;
        const consumoValue =
          Number.parseFloat(String(consumo ?? 0).replace(",", ".")) || 0;
        const tieneImprimacionValue =
          tiene_imprimacion === true ||
          tiene_imprimacion === 1 ||
          String(tiene_imprimacion).toLowerCase() === "true" ||
          String(tiene_imprimacion) === "1";

        await connection.query(queryAlbaranMateriales, [
          numAlbaran,
          ref,
          cantidadValue,
          ralValue,
          observaciones,
          refObra ?? null,
          unidad_medida ?? null,
          Number.isNaN(precioUnitarioValue) ? 0 : precioUnitarioValue,
          largoValue,
          anchoValue,
          espesorValue,
          tieneImprimacionValue ? 1 : 0,
          fabricacion_manual ?? 0,
          fecha_fabricacion_manual ?? null,
          mat ?? null,
        ]);

        // Solo actualizamos stock cuando se proporcionó un RAL real
        if (ralValue && ralValue !== "Sin especificar") {
          // Consulta el stock y el consumo
          const [rows] = await connection.query(
            "SELECT stock FROM pintura WHERE ral = ?",
            [ralValue],
          );
          if (rows.length > 0) {
            const stockActual = parseFloat(rows[0].stock) || 0;

            const cantidadARestar = consumoValue * Number(cantidadValue);
            const stockRestante = stockActual - cantidadARestar;

            // Actualiza el stock aunque quede negativo
            await connection.query(
              "UPDATE pintura SET stock = ? WHERE ral = ?",
              [stockRestante, ralValue],
            );

            // Si el stock es negativo, notifica al usuario
            if (stockRestante < 0) {
              error = `¡Atención! El stock para RAL ${ralValue} es negativo: ${stockRestante} Kg`;
            }
          } else {
            const id =
              Date.now().toString(36) + Math.random().toString(36).substring(2);
            await connection.query(
              "INSERT INTO pintura (id,ral, stock,marca) VALUES (?,?,?, ?)",
              [
                id,
                ralValue,
                -consumoValue * Number(cantidadValue),
                ralInfo.marca,
              ],
            );
            const acabadoLabel = ralInfo.esMate ? "Mate" : "Normal/Brillo";
            error = `RAL ${ralValue} (${acabadoLabel}) no encontrado, se ha creado con marca ${ralInfo.marca} y stock negativo de ${
              -consumoValue * Number(cantidadValue)
            } Kg`;
          }
        }

        // Segunda resta de stock para imprimación cuando aplique
        if (tieneImprimacionValue) {
          const [rowsImp] = await connection.query(
            "SELECT stock FROM pintura WHERE ral = ?",
            ["IMPRIMACION"],
          );

          const cantidadARestarImp = consumoValue * Number(cantidadValue);

          if (rowsImp.length > 0) {
            const stockImpActual = parseFloat(rowsImp[0].stock) || 0;
            const stockImpRestante = stockImpActual - cantidadARestarImp;

            await connection.query(
              "UPDATE pintura SET stock = ? WHERE ral = ?",
              [stockImpRestante, "IMPRIMACION"],
            );

            if (stockImpRestante < 0) {
              error = `¡Atención! El stock de IMPRIMACION es negativo: ${stockImpRestante} Kg`;
            }
          } else {
            const idImp =
              Date.now().toString(36) + Math.random().toString(36).substring(2);
            await connection.query(
              "INSERT INTO pintura (id,ral, stock,marca) VALUES (?,?,?, ?)",
              [idImp, "IMPRIMACION", -cantidadARestarImp, "-"],
            );
            error = `IMPRIMACION no encontrada, se ha creado con un stock negativo de ${-cantidadARestarImp} Kg`;
          }
        }
      }
      if (firma) {
        const queryFirmas =
          "INSERT INTO Firmas (idAlbaran, firma) VALUES (?, ?)";
        await connection.query(queryFirmas, [numAlbaran, firma]);
      }

      await connection.commit();
      res.status(200).json({ message: "Albarán creado correctamente", error });
      const [pinturas] = await connection.query(
        "SELECT * FROM pintura order by stock ASC",
      );
      io.emit("Actualizar_pintura", pinturas);
    } catch (err) {
      console.error("Error durante la transacción:", err);

      // Revertir la transacción si ocurre un error
      if (connection) await connection.rollback();

      res.status(500).json({ error: "Error al crear el albarán" });
    } finally {
      if (connection) connection.release();
    }
  });
  return router;
}
