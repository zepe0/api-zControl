import express from "express";
import conexion from "../conexion.js";

const router = express.Router();

// GET /api/tarifas_estandar
router.get("/tarifas_estandar", async (req, res) => {
  try {
    const [rows] = await conexion.query("SELECT * FROM tarifas_estandar");
    // Normaliza decimales a Number
    const tarifas = rows.map((row) => {
      const normalizado = { ...row };
      for (const key in normalizado) {
        if (
          typeof normalizado[key] === "string" &&
          /^\d+(\.\d+)?$/.test(normalizado[key])
        ) {
          normalizado[key] = Number.parseFloat(normalizado[key]);
        }
      }
      return normalizado;
    });
    res.json({ tarifas });
  } catch (error) {
    console.error("Error al consultar tarifas_estandar:", error);
    res.status(500).json({ error: "Error al consultar tarifas_estandar" });
  }
});

// PUT /api/tarifas_estandar
// Actualiza una o varias tarifas por id (acepta { tarifas: [...] } o un objeto simple)
router.put("/tarifas_estandar", async (req, res) => {
  const tarifasPayload = Array.isArray(req.body?.tarifas)
    ? req.body.tarifas
    : [req.body];

  if (!tarifasPayload.length) {
    return res
      .status(400)
      .json({ error: "Debes enviar tarifas para actualizar" });
  }

  let connection;
  try {
    connection = await conexion.getConnection();
    await connection.beginTransaction();

    let updatedRows = 0;

    for (const tarifa of tarifasPayload) {
      const id = tarifa?.id;
      if (!id) {
        continue;
      }

      const campos = [];
      const valores = [];

      const addCampoDecimal = (nombreCampo, valor) => {
        if (valor === undefined) {
          return;
        }
        const numero = Number.parseFloat(String(valor).replace(",", "."));
        campos.push(`${nombreCampo} = ?`);
        valores.push(Number.isNaN(numero) ? 0 : numero);
      };

      addCampoDecimal("precio_color", tarifa.precio_color);
      addCampoDecimal("precio_color_mas_imp", tarifa.precio_color_mas_imp);
      addCampoDecimal("precio_imprimacion", tarifa.precio_imprimacion);
      addCampoDecimal("precio_base", tarifa.precio_base);
      addCampoDecimal("precio_unitario", tarifa.precio_unitario);

      if (!campos.length) {
        continue;
      }

      const query = `UPDATE tarifas_estandar SET ${campos.join(", ")} WHERE id = ?`;
      const [resultado] = await connection.query(query, [...valores, id]);
      updatedRows += resultado.affectedRows || 0;
    }

    await connection.commit();

    if (updatedRows === 0) {
      return res.status(404).json({
        error:
          "No se actualizó ninguna tarifa. Revisa que envíes id y campos válidos",
      });
    }

    return res.status(200).json({
      exito: "Tarifas actualizadas correctamente",
      updatedRows,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error al actualizar tarifas_estandar:", error);
    return res.status(500).json({
      error: "Error al actualizar tarifas_estandar",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

export default router;
