import express from "express";
import conexion from "../../conexion.js";

const router = express.Router();

router.put("/edit", async (req, res) => {
  const payload = req.body || {};

  const ids = Array.isArray(payload.ids)
    ? payload.ids
    : Array.isArray(payload.lineIds)
      ? payload.lineIds
      : [];

  const fabricacionManual =
    payload.fabricacion_manual ??
    payload.fabricacionmanual ??
    payload.fabricacionManual;

  if (ids.length === 0) {
    return res.status(400).json({
      error: "Debes enviar un array de ids en ids o lineIds",
    });
  }

  if (fabricacionManual === undefined || fabricacionManual === null) {
    return res.status(400).json({
      error: "Debes enviar el campo fabricacion_manual",
    });
  }

  try {
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
