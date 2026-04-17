import express from "express";
import conexion from "../../conexion.js";
import {
  revertirStockPintura,
  aplicarStockPintura,
} from "../../utils/HelperUpdateAlbaran.js";
import { calcularConsumoPintura } from "../../utils/calcularConsumo.js";

const router = express.Router();

const ACABADO_TOKENS = new Map([
  ["m", "M"],
  ["mate", "M"],
  ["gof", "GOF"],
  ["gofrado", "GOF"],
  ["txt", "TXT"],
  ["texturado", "TXT"],
]);

const normalizarRalInfo = (ralInput) => {
  const raw = String(ralInput ?? "").trim();
  const normalizedRaw = raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\-_/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (/\bIMP(?:RIMACION)?\b/i.test(normalizedRaw)) {
    const marcaImp = normalizedRaw
      .replace(/\bIMP(?:RIMACION)?\b/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
    return {
      ralCodigo: "IMPRIMACION",
      esImprimacion: true,
      marca: marcaImp || "-",
    };
  }

  const upperRaw = raw.toUpperCase();
  const tokens = normalizedRaw.length > 0 ? normalizedRaw.split(" ") : [];

  const firstToken = (tokens[0] || "").toLowerCase();
  if (firstToken === "noir") {
    const resto = tokens.slice(1);
    const nombreTokens = ["NOIR"];
    const marcaTokens = [];
    let marcaDetectada = false;

    for (const tk of resto) {
      const hasLetters = /[a-z]/i.test(tk);
      if (!marcaDetectada && !hasLetters) {
        nombreTokens.push(tk);
        continue;
      }
      marcaDetectada = true;
      marcaTokens.push(tk);
    }

    return {
      ralCodigo: nombreTokens.join(" ").trim(),
      esImprimacion: false,
      marca: marcaTokens.join(" ").trim() || "Sin marca",
    };
  }

  const ralMatch = upperRaw.match(/(\d{4})/);
  const ralBase = ralMatch ? ralMatch[1] : "";

  const acabadosAdjuntos = [];
  const marcaTokens = [];

  for (const tk of tokens) {
    const lower = tk.toLowerCase();
    
    // Si el token contiene el número RAL (ej: 8015M), extraemos acabado pegado
    if (ralBase && lower.includes(ralBase)) {
      const remainder = lower.replace(ralBase, "").trim();
      if (remainder && ACABADO_TOKENS.has(remainder)) {
        acabadosAdjuntos.push(ACABADO_TOKENS.get(remainder));
      }
      continue;
    }

    if (ACABADO_TOKENS.has(lower)) {
      acabadosAdjuntos.push(ACABADO_TOKENS.get(lower));
      continue;
    }
    marcaTokens.push(tk);
  }

  // Combinar base con acabados (ej: "8015 M GOF")
  const ralCodigo = ralBase
    ? `${ralBase}${acabadosAdjuntos.length > 0 ? " " + [...new Set(acabadosAdjuntos)].join(" ") : ""}`
    : "";

  return {
    ralCodigo,
    esImprimacion: false,
    marca: marcaTokens.join(" ").trim() || "Genérica",
  };
};

const updateAlbaran = (io) => {
  router.put("/:pedido_id", async (req, res) => {
    const { pedido_id } = req.params;
    const { albaran, estado } = req.body; // refObra ya no viene suelta aquí si viene en cada línea

    const connection = await conexion.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Actualizar cabecera del pedido (solo estado y quizá fecha/observaciones generales)
      await connection.query("UPDATE pedidos SET estado = ? WHERE id = ?", [
        estado,
        pedido_id,
      ]);

      // 2. Detectar líneas borradas
      const [lineasDB] = await connection.query(
        "SELECT id FROM pedido_lineas WHERE pedido_id = ?",
        [pedido_id],
      );

      const idsEnPayload = albaran
        .map((l) => l.lineId)
        .filter((id) => id != null);

      const idsABorrar = lineasDB
        .filter((row) => !idsEnPayload.includes(row.id))
        .map((row) => row.id);

      for (const idBorrar of idsABorrar) {
        await revertirStockPintura(idBorrar, connection);
        await connection.query("DELETE FROM pedido_lineas WHERE id = ?", [
          idBorrar,
        ]);
      }

      // 3. Procesar líneas del payload
      for (const linea of albaran) {
        const refObraLinea = linea.refObra || "-";
        const ralRawValue = linea.Ral || linea.ral || "Sin especificar";
        const ralInfo = normalizarRalInfo(ralRawValue);
        const ralFinal = ralInfo.ralCodigo || "Sin especificar";
        const tieneImprimacion =
          linea.tiene_imprimacion === true ||
          linea.tiene_imprimacion === 1 ||
          String(linea.tiene_imprimacion).toLowerCase() === "true" ||
          String(linea.tiene_imprimacion) === "1";

        // Calcular consumo automático si no viene del frontend
        const consumoCalculado = calcularConsumoPintura({
          unidad_medida: linea.unidad_medida,
          largo: linea.largo,
          ancho: linea.ancho,
          espesor: linea.espesor,
          consumoManual: linea.consumo,
        });

        // Lógica de productoIdSeguro para evitar 9999 o vacíos
        const productoIdSeguro =
          linea.idMaterial && String(linea.idMaterial).trim() !== "" && String(linea.idMaterial) !== "9999"
            ? linea.idMaterial
            : linea.ref && String(linea.ref).trim() !== "" && String(linea.ref) !== "9999"
              ? linea.ref
              : `${linea.mat || "Producto"} ${linea.largo ?? ""}x${linea.ancho ?? ""}x${linea.espesor ?? ""}`.trim();

        // Sincronizar tabla maestra de 'productos'
        const [rowsProd] = await connection.query("SELECT id FROM productos WHERE id = ?", [productoIdSeguro]);
        if (rowsProd.length === 0) {
          await connection.query(
            "INSERT INTO productos (id, nombre, uni, unidad_medida, consumo) VALUES (?, ?, ?, ?, ?)",
            [
              productoIdSeguro, 
              linea.mat || productoIdSeguro, 
              linea.cantidad || linea.unid || 1, 
              linea.unidad_medida || "ud", 
              consumoCalculado
            ],
          );
        } else {
          // Si ya existe, actualizamos nombre y consumo para que el maestro esté al día (Punto 5 solicitado)
          await connection.query(
            "UPDATE productos SET nombre = ?, unidad_medida = ?, consumo = ? WHERE id = ?",
            [
              linea.mat || rowsProd[0].nombre, 
              linea.unidad_medida || "ud", 
              consumoCalculado, 
              productoIdSeguro
            ]
          );
        }

        if (!linea.lineId) {
          // INSERTAR NUEVA
          const [ins] = await connection.query(
            `INSERT INTO pedido_lineas (
              pedido_id, 
              producto_id, 
              cantidad, 
              ral, 
              consumo_pintura_kg, 
              precio_unitario, 
              largo, 
              ancho, 
              espesor, 
              nombre_snapshot, 
              refObra,
              tiene_imprimacion
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              pedido_id,
              productoIdSeguro,
              linea.cantidad || linea.unid || 1,
              ralFinal,
              consumoCalculado,
              linea.precio_unitario,
              linea.largo || null,
              linea.ancho || null,
              linea.espesor || 1,
              linea.mat,
              refObraLinea,
              tieneImprimacion ? 1 : 0,
            ],
          );
          // Usamos la línea normalizada para aplicar stock
          const lineaNormalizada = {
            ...linea,
            ral: ralFinal,
            tiene_imprimacion: tieneImprimacion,
            cantidad: linea.cantidad || linea.unid || 1,
            consumo: consumoCalculado,
          };
          await aplicarStockPintura(pedido_id, ins.insertId, lineaNormalizada, connection);
        } else {
          // ACTUALIZAR SI HAY DIFERENCIAS
          const [rows] = await connection.query(
            `SELECT producto_id, cantidad, ral, consumo_pintura_kg, precio_unitario, largo, ancho, espesor, nombre_snapshot, refObra, tiene_imprimacion 
             FROM pedido_lineas 
             WHERE id = ?`,
            [linea.lineId],
          );
          
          if (rows.length > 0) {
            const dbLinea = rows[0];
            const hayDiferenciasStock =
              dbLinea.ral !== ralFinal ||
              parseFloat(dbLinea.cantidad) !== parseFloat(linea.cantidad || linea.unid || 1) ||
              parseFloat(dbLinea.consumo_pintura_kg) !== parseFloat(linea.consumo || 0) ||
              Boolean(dbLinea.tiene_imprimacion) !== tieneImprimacion;

            const hayOtrasDiferencias =
              dbLinea.producto_id !== productoIdSeguro ||
              dbLinea.precio_unitario !== linea.precio_unitario ||
              dbLinea.largo !== linea.largo ||
              dbLinea.ancho !== linea.ancho ||
              dbLinea.espesor !== linea.espesor ||
              dbLinea.nombre_snapshot !== linea.mat ||
              dbLinea.refObra !== refObraLinea;

            if (hayDiferenciasStock || hayOtrasDiferencias) {
              if (hayDiferenciasStock) {
                await revertirStockPintura(linea.lineId, connection);
              }

              await connection.query(
                `UPDATE pedido_lineas SET 
                  producto_id=?, cantidad=?, ral=?, consumo_pintura_kg=?, 
                  precio_unitario=?, largo=?, ancho=?, espesor=?, 
                  nombre_snapshot=?, refObra=?, tiene_imprimacion=? 
                 WHERE id=?`,
                [
                  productoIdSeguro,
                  linea.cantidad || linea.unid || 1,
                  ralFinal,
                  consumoCalculado,
                  linea.precio_unitario,
                  linea.largo || null,
                  linea.ancho || null,
                  linea.espesor || 1,
                  linea.mat,
                  refObraLinea,
                  tieneImprimacion ? 1 : 0,
                  linea.lineId,
                ],
              );

              if (hayDiferenciasStock) {
                const lineaNormalizada = {
                  ...linea,
                  ral: ralFinal,
                  tiene_imprimacion: tieneImprimacion,
                  cantidad: linea.cantidad || linea.unid || 1,
                  consumo: consumoCalculado,
                };
                await aplicarStockPintura(pedido_id, linea.lineId, lineaNormalizada, connection);
              }
            }
          }
        }
      }

      await connection.commit();

      // Socket emits...
      const [pinturas] = await connection.query("SELECT * FROM pintura");
      io.emit("Actualizar_pintura", pinturas);
      io.emit("PedidoActualizado", { pedido_id });

      res
        .status(200)
        .json({ exito: "Pedido y stock actualizados correctamente" });
    } catch (err) {
      if (connection) await connection.rollback();
      console.error("Error en updateAlbaran:", err);
      res.status(500).json({ error: "Error al actualizar albarán" });
    } finally {
      connection.release();
    }
  });

  return router;
};

export default updateAlbaran;
