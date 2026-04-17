import express from "express";
import conexion from "../../conexion.js";

const router = express.Router();

const toNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const normalizeToken = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const isWildcardRal = (value) => {
  const token = normalizeToken(value);
  return (
    token === "pendiente" ||
    token === "sin color" ||
    token === "sincolor" ||
    token === "sistema" ||
    token === "sin especificar" ||
    token === "sinespecificar"
  );
};

const findPaintByRal = async (ralValue) => {
  const ralKey = String(ralValue || "")
    .trim()
    .toUpperCase();
  if (!ralKey) return null;

  const [rows] = await conexion.query(
    `
      SELECT id, ral, stock
      FROM pintura
      WHERE UPPER(TRIM(ral)) = ?
         OR UPPER(TRIM(ral)) LIKE CONCAT(?, ' %')
      ORDER BY CASE WHEN UPPER(TRIM(ral)) = ? THEN 0 ELSE 1 END, id ASC
      LIMIT 1
    `,
    [ralKey, ralKey, ralKey],
  );

  return rows[0] || null;
};

router.put("/edit", async (req, res) => {
  const payload = req.body || {};

  const ids = Array.isArray(payload.ids)
    ? payload.ids
    : Array.isArray(payload.lineIds)
      ? payload.lineIds
      : [];

  const fabricacionManualRaw =
    payload.fabricacion_manual ??
    payload.fabricacionmanual ??
    payload.fabricacionManual;

  if (ids.length === 0) {
    return res.status(400).json({
      error: "Debes enviar un array de ids en ids o lineIds",
    });
  }

  if (fabricacionManualRaw === undefined || fabricacionManualRaw === null) {
    return res.status(400).json({
      error: "Debes enviar el campo fabricacion_manual",
    });
  }

  const fabricacionManual =
    fabricacionManualRaw === true ||
    fabricacionManualRaw === 1 ||
    fabricacionManualRaw === "1"
      ? 1
      : 0;

  try {
    if (fabricacionManual === 1) {
      const [columnRows] = await conexion.query(
        `
          SELECT column_name
          FROM information_schema.columns
          WHERE table_schema = DATABASE()
            AND table_name = 'pedido_lineas'
        `,
      );

      const availableColumns = new Set(
        (columnRows || []).map((row) => String(row.column_name || "").trim()),
      );

      const optionalColumns = [];
      if (availableColumns.has("consumo_pintura_kg")) {
        optionalColumns.push("consumo_pintura_kg");
      }
      if (availableColumns.has("consumo_imprimacion")) {
        optionalColumns.push("consumo_imprimacion");
      }
      if (availableColumns.has("tiene_imprimacion")) {
        optionalColumns.push("tiene_imprimacion");
      }

      const lineFields = ["id", "ral", "cantidad", ...optionalColumns].join(
        ", ",
      );
      const [lineas] = await conexion.query(
        `SELECT ${lineFields} FROM pedido_lineas WHERE id IN (?)`,
        [ids],
      );

      const insufficient = [];

      for (const linea of lineas) {
        const ral = String(linea?.ral || "").trim();
        if (!ral || ral === "-" || isWildcardRal(ral)) {
          continue;
        }

        const consumoPintura = toNumber(linea?.consumo_pintura_kg, NaN);
        const requiredRal =
          Number.isFinite(consumoPintura) && consumoPintura > 0
            ? consumoPintura
            : Math.max(toNumber(linea?.cantidad, 0), 0);

        if (requiredRal > 0) {
          const pinturaRal = await findPaintByRal(ral);
          const stockRal = toNumber(pinturaRal?.stock, 0);

          if (stockRal < requiredRal) {
            insufficient.push({
              lineId: linea.id,
              ral: pinturaRal?.ral || ral,
              required: requiredRal,
              stock: stockRal,
              missing: Math.max(requiredRal - stockRal, 0),
            });
          }
        }

        const hasImp =
          linea?.tiene_imprimacion === 1 ||
          linea?.tiene_imprimacion === true ||
          linea?.tiene_imprimacion === "1";

        if (hasImp) {
          const consumoImp = toNumber(linea?.consumo_imprimacion, NaN);
          const requiredImp =
            Number.isFinite(consumoImp) && consumoImp > 0
              ? consumoImp
              : requiredRal;

          if (requiredImp > 0) {
            const pinturaImp = await findPaintByRal("IMPRIMACION");
            const stockImp = toNumber(pinturaImp?.stock, 0);

            if (stockImp < requiredImp) {
              insufficient.push({
                lineId: linea.id,
                ral: "IMPRIMACION",
                required: requiredImp,
                stock: stockImp,
                missing: Math.max(requiredImp - stockImp, 0),
              });
            }
          }
        }
      }

      if (insufficient.length > 0) {
        const topRals = [...new Set(insufficient.map((item) => item.ral))]
          .slice(0, 4)
          .join(", ");

        return res.status(409).json({
          error: topRals
            ? `No se puede marcar como Hecho manual por falta de stock: ${topRals}.`
            : "No se puede marcar como Hecho manual por falta de stock.",
          reason: "stock",
          code: "STOCK_INSUFICIENTE",
          insufficient,
        });
      }
    }

    const query =
      "UPDATE pedido_lineas SET fabricacion_manual = ? WHERE id IN (?)";
    const [resultado] = await conexion.query(query, [fabricacionManual, ids]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        error: "No se encontraron lineas para actualizar",
      });
    }

    return res.status(200).json({
      exito: "Lineas actualizadas correctamente",
      updatedRows: resultado.affectedRows,
    });
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    return res.status(500).json({
      error: "Error al actualizar las lineas",
    });
  }
});

export default router;
