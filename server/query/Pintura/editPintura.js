import express from "express";
import conexion from "../../conexion.js";

const router = express.Router();

// Endpoint para obtener los pinturas
router.put("", async (req, res) => {
  const { formData } = req.body;
  const { id, ral, stock, marca, RefPintura } = formData;
  console.log("Datos recibidos en el servidor:", formData);
  const query = `UPDATE pintura SET ral = ?, stock = ?, marca = ?, 
  RefPintura = ? WHERE id = ?`;
  const values = [ral, stock, marca, RefPintura, id];
  try {
    const [resultado] = await conexion.query(query, values);
    if (resultado.affectedRows > 0 && resultado.changedRows > 0) {
           return res
        .status(200)
        .json({ exito: "Pintura actualizada correctamente" });
    } else if (resultado.changedRows === 0) {
      return res
        .status(200)
        .json({ exito: "No se realizaron cambios en la pintura" });
    } else {
      return res.status(404).json({ error: "No se encontró la pintura" });
    }
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    return res.status(500).json({ error: "Error al actualizar la pintura" });
  }
});

export default router;
