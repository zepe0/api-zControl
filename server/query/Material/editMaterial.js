import express from "express";
import conexion from "../../conexion.js";

const router = express.Router();

// Endpoint para obtener los pinturas
router.put("", async (req, res) => {
  const payload = req.body?.formData || req.body || {}; 
  debugger
// deveria llegar el iddppedido,idMaterial,nombreMaterial,Cantidad,ral,refObra

  const idMaterial = payload.idMaterial || payload.id;
  const nombre = payload.nombre || payload.nombreMaterial;
  const precio = payload.precio;
  const uni = payload.cantidad;
  const refObra = payload.refObra;
  const consumo = payload.consumo ?? payload.cantidad;

  if (!idMaterial) {
    return res
      .status(400)
      .json({ error: "Falta idMaterial en el body de la petición" });
  }

  const query = `UPDATE productos SET nombre = ?, precio = ?, uni = ?, refObra = ?, consumo = ? WHERE id = ?`;
  const values = [
    nombre,
    !precio || precio === "-" ? "0" : precio,
    uni,
    refObra,
    !consumo || consumo === "-" ? "0" : consumo,
    idMaterial,
  ];
  try {
    const [resultado] = await conexion.query(query, values);
    if (resultado.affectedRows > 0) {
      res.status(200).json({ exito: "Material actualizada correctamente" });
    } else {
      res.status(404).json({ error: "No al Actualizar" });
    }
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).json({ error: "Error al actualizar el material" });
  }
});

export default router;
