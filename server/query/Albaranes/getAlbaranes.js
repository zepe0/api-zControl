import express from "express";
import conexion from "../../conexion.js";

const router = express.Router();

// Endpoint para obtener los albaranes con datos del cliente
router.get("", async (req, res) => {
  const query = `
    SELECT
      p.id,
      p.cliente_id,
      p.id AS pedido_id,
      p.estado AS proceso,
      p.fecha,
      p.observaciones,
      c.nombre AS cliente_nombre,
      c.Nif AS cliente_nif,
      c.tel AS cliente_tel,
      c.dir AS cliente_dir
    FROM pedidos p
    LEFT JOIN cliente c ON c.id = p.cliente_id
    ORDER BY p.fecha DESC, p.id DESC
  `;

  try {
    const [resultados] = await conexion.query(query);
    res.status(200).json(resultados);
  } catch (err) {
    console.error("Error al ejecutar la consulta:", err);
    res.status(500).json({ error: "Error al obtener los albaranes" });
  }
});

export default router;
