import express from "express";
import conexion from "../../conexion.js";

const router = express.Router();

/**
 * 📌 GET /api/horas
 * Devuelve todas las horas registradas o las de un usuario específico si se pasa ?user_id=...
 */
router.get("/", async (req, res) => {
  const { user_id } = req.query; // opcional, si quieres filtrar por usuario

  let query = `
    SELECT h.id, h.user_id, u.username, h.cliente, h.referencia, h.tipo, h.horas, h.fecha
    FROM GP_Horas h
    JOIN GP_UsuariosHoras u ON u.id = h.user_id
  `;
  const params = [];

  if (user_id) {
    query += " WHERE h.user_id = ?";
    params.push(user_id);
  }

  query += " ORDER BY h.fecha DESC";

  try {
    const [rows] = await conexion.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Error al obtener las horas:", error);
    res.status(500).json({ error: "Error al obtener las horas" });
  }
});

/**
 * 📌 POST /api/horas
 * Añade una nueva entrada de horas
 */
router.post("/", async (req, res) => {
  const { user_id, cliente, referencia, tipo, horas } = req.body;

  // Validaciones básicas
  if (!user_id || !horas) {
    return res.status(400).json({ error: "Faltan datos obligatorios (user_id, horas)" });
  }

  const query = `
    INSERT INTO GP_Horas (user_id, cliente, referencia, tipo, horas)
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await conexion.query(query, [user_id, cliente, referencia, tipo, horas]);
    res.status(201).json({
      message: "Horas registradas correctamente",
      id: result.insertId,
    });
  } catch (error) {
    console.error("❌ Error al insertar horas:", error);
    res.status(500).json({ error: "Error al registrar las horas" });
  }
});

export default router;
