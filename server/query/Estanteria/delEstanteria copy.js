import express from "express";
import conexion from "../../conexion.js";


const router = express.Router();

const delEStanteria = (io) => {
  router.delete("/", async (req, res) => {
    const query = "DELETE FROM estanteria WHERE id = ?";
    const { id } = req.body;

    try {
      const [resultado] = await conexion.query(query, [id]);

      if (resultado.affectedRows > 0) {
        io.emit("Estante Borrado", { id });
        res.status(200).json({ message: "Estanteria borrada correctamente" });
      }
      res.status(400).json({ error: "No se pudo borrar la lista" });
    } catch (err) {
      
      console.error("Error al ejecutar la consulta:", err);
      res.status(500).json({ error: "Error al añadir el material" });
    }
  });
  return router;
};

export default delEStanteria;
