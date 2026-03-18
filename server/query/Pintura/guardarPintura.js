import express from "express";
import conexion from "../../conexion.js";

const router = express.Router();

const toNumber = (value, defaultValue = 0) => {
  const parsed = Number.parseFloat(String(value ?? "").replace(",", "."));
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

// POST /api/pintura/guardar
router.post("/guardar", async (req, res) => {
  const {
    id,
    operacion,
    kg_entrada,
    precio_albaran,
    proveedor,
    ral,
    marca,
    refpintura,
    RefPintura,
    stock,
    precio,
  } = req.body || {};

  const refPinturaValue = refpintura ?? RefPintura ?? null;

  let connection;
  try {
    if (operacion === "stock") {
      const kg = toNumber(kg_entrada, 0);
      const totalAlbaran = toNumber(precio_albaran, 0);

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Para operacion stock debes enviar id de pintura",
        });
      }

      if (kg <= 0) {
        return res.status(400).json({
          success: false,
          message: "kg_entrada debe ser mayor que 0",
        });
      }

      const precioKgCalculado = Number.parseFloat(
        (totalAlbaran / kg).toFixed(2),
      );

      connection = await conexion.getConnection();
      await connection.beginTransaction();

      // 1) Histórico de compra
      const sqlHistorial = `
        INSERT INTO pintura_compras
        (pintura_id, fecha_compra, cantidad_cajas, precio_total_caja, precio_kg_calculado, proveedor)
        VALUES (?, NOW(), 1, ?, ?, ?)
      `;
      await connection.query(sqlHistorial, [
        id,
        totalAlbaran,
        precioKgCalculado,
        proveedor ?? null,
      ]);

      // 2) Suma de stock en tabla maestra
      const sqlUpdateStock =
        "UPDATE pintura SET stock = stock + ? WHERE id = ?";
      const [resultUpdate] = await connection.query(sqlUpdateStock, [kg, id]);

      if (resultUpdate.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: "No se encontró la pintura para sumar stock",
        });
      }

      await connection.commit();
      return res.json({
        success: true,
        message: "Entrada de stock registrada correctamente",
      });
    }

    // ESCENARIO INFO: editar datos fijos o crear pintura
    if (id) {
      const campos = [];
      const valores = [];

      if (ral !== undefined) {
        campos.push("ral = ?");
        valores.push(ral);
      }
      if (marca !== undefined) {
        campos.push("marca = ?");
        valores.push(marca);
      }
      if (refPinturaValue !== undefined) {
        campos.push("refPintura = ?");
        valores.push(refPinturaValue);
      }
      if (stock !== undefined) {
        campos.push("stock = ?");
        valores.push(toNumber(stock, 0));
      }
      if (precio !== undefined) {
        campos.push("precio = ?");
        valores.push(toNumber(precio, 0));
      }

      if (!campos.length) {
        return res.status(400).json({
          success: false,
          message: "No hay campos para actualizar",
        });
      }

      const sqlEdit = `UPDATE pintura SET ${campos.join(", ")} WHERE id = ?`;
      valores.push(id);
      const [resultEdit] = await conexion.query(sqlEdit, valores);

      if (resultEdit.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Pintura no encontrada",
        });
      }

      return res.json({ success: true, message: "Información actualizada" });
    }

    const newId =
      Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    const sqlNew =
      "INSERT INTO pintura (id, ral, marca, refPintura, stock) VALUES (?, ?, ?, ?, ?)";

    await conexion.query(sqlNew, [
      newId,
      ral ?? "",
      marca ?? "",
      refPinturaValue ?? null,
      toNumber(stock, 0),
    ]);

    return res.json({
      success: true,
      message: "Nueva pintura creada",
      id: newId,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor",
      detail: error.message,
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// GET /api/pintura/historial/:id
router.get("/historial/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const sql =
      "SELECT * FROM pintura_compras WHERE pintura_id = ? ORDER BY fecha_compra DESC LIMIT 5";
    const [rows] = await conexion.query(sql, [id]);
    return res.json(rows);
  } catch (error) {
    console.error("Error al obtener historial de pintura:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener historial de pintura",
    });
  }
});

// GET /api/pintura/lista-completa
// Específico para la pantalla de Gestión con historial incluido
router.get("/lista-completa", async (req, res) => {
  try {
    const sql = `
      SELECT p.*,
      (
        SELECT JSON_ARRAYAGG(h_data)
        FROM (
          SELECT JSON_OBJECT(
            'fecha_compra', h.fecha_compra,
            'precio_kg_calculado', h.precio_kg_calculado,
            'proveedor', h.proveedor
          ) AS h_data
          FROM pintura_compras h
          WHERE h.pintura_id = p.id
          ORDER BY h.fecha_compra DESC          
        ) AS sub
      ) AS historial
      FROM pintura p
    `;

    const [rows] = await conexion.query(sql);

    const data = rows.map((row) => ({
      ...row,
      historial:
        row.historial != null
          ? typeof row.historial === "string"
            ? JSON.parse(row.historial)
            : row.historial
          : [],
    }));

    return res.json(data);
  } catch (error) {
    console.error("Error en lista-completa:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error al obtener lista completa" });
  }
});

export default router;
