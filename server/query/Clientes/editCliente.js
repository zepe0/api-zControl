import express from "express";
import conexion from "../../conexion.js";

const router = express.Router();

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, tel, dir, Nif } = req.body || {};

  if (!id) {
    return res.status(400).json({ error: "Falta el id del cliente" });
  }

  if (!String(nombre || "").trim()) {
    return res
      .status(400)
      .json({ error: "El nombre del cliente es obligatorio" });
  }

  if (!String(Nif || "").trim()) {
    return res.status(400).json({ error: "El NIF del cliente es obligatorio" });
  }

  try {
    const [nifRows] = await conexion.query(
      "SELECT id FROM cliente WHERE Nif = ? AND id <> ? LIMIT 1",
      [Nif, id],
    );

    if (nifRows.length > 0) {
      return res
        .status(400)
        .json({ error: "El NIF ya está registrado en otro cliente" });
    }

    const [result] = await conexion.query(
      "UPDATE cliente SET nombre = ?, tel = ?, dir = ?, Nif = ? WHERE id = ?",
      [nombre, tel ?? null, dir ?? null, Nif, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    return res.status(200).json({
      success: true,
      cliente: {
        id,
        nombre,
        tel: tel ?? "",
        dir: dir ?? "",
        Nif,
      },
    });
  } catch (error) {
    console.error("Error al actualizar el cliente:", error);
    return res.status(500).json({ error: "Error al actualizar el cliente" });
  }
});

export default router;
