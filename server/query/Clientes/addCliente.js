import express from "express";
import conexion from "../../conexion.js";
import { randomUUID } from "crypto";

const router = express.Router();

const addCliente = (io) => {
  router.post("/add", async (req, res) => {
    const id = randomUUID();
    const { nombre, tel, dir, Nif } = req.body;

    try {
      // Verificar si el NIF ya existe
      const queryCheckNif =
        "SELECT COUNT(*) AS count FROM cliente WHERE Nif = ?";
      const [checkResult] = await conexion.query(queryCheckNif, [Nif]);

      if (checkResult[0].count > 0) {
        return res.status(400).json({ error: "El NIF ya está registrado" });
      }

      // Insertar el nuevo cliente
      const queryInsert =
        "INSERT INTO cliente (id, nombre, tel, dir, Nif) VALUES (?, ?, ?, ?, ?)";
      const [resultados] = await conexion.query(queryInsert, [
        id,
        nombre,
        tel,
        dir,
        Nif,
      ]);

      if (resultados.affectedRows === 1) {
        // Emitir evento de cliente añadido
        io.emit("ClienteAñadido", { id, nombre, tel, dir, Nif });
        return res.status(200).json({
          exito: "Cliente añadido",
          cliente: { id, nombre, tel, dir, Nif },
        });
      }

      // Caso inesperado
      res.status(500).json({ error: "No se pudo añadir el cliente" });
    } catch (err) {
      console.error("Error al ejecutar la consulta:", err);
      res.status(500).json({ error: "Error al añadir el cliente" });
    }
  });

  return router;
};

export default addCliente;
