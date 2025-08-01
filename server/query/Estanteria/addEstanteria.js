import express from "express";
import conexion from "../../conexion.js";
import { randomUUID } from "crypto";

const router = express.Router();

const addEStanteria = (io) => {
  router.post("/", async (req, res) => {
    const query =
      "INSERT INTO estanteria (id,numAlturas, numEstantes,matriz) VALUES (?,?, ?, ?)";
    const { id, numAlturas, numEstantes, matriz } = req.body;
    const matrizJSON = JSON.stringify(matriz);
    try {
      const [resultado] = await conexion.query(query, [
     
        id,
        numAlturas,
        numEstantes,
        matrizJSON,
      ]);

      if (resultado.affectedRows > 0) {
        io.emit("materialAñadido", { id, numAlturas, numEstantes, obra });
        res.status(200).json({ message: "Material añadido correctamente" });
      }
      res.status(400).json({ error: "No se pudo añadir el material" });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        res.status(200).json({ error: "Material ya existe" });
        return;
      }
      console.error("Error al ejecutar la consulta:", err);
      res.status(500).json({ error: "Error al añadir el material" });
    }
  });
  return router;
};

export default addEStanteria;
