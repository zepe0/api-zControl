import express from "express";
import conexion from "../../conexion.js";

const router = express.Router();

router.post("/loginHoras", async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Falta el nombre de usuario" });
  }

  const query = "SELECT * FROM GP_Horas ";

  try {
    const [resultados] = await conexion.query(query, [username]);

    if (resultados.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const user = resultados[0];

    // Si tienes campo Password en la tabla, puedes comprobarlo:
    if (password && user.password && user.password !== password) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Devuelve solo lo necesario
    res.status(200).json({
      id: user.id,
     
    });
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).json({ error: "Error en el servidor al validar el usuario" });
  }
});

export default router;
