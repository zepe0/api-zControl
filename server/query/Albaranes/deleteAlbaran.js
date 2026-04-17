import express from "express";
import conexion from "../../conexion.js";

const router = express.Router();

// Elimina un albarán y todo lo asociado
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const conn = await conexion.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Obtener líneas del pedido
    const [lineas] = await conn.query(
      "SELECT id, producto_id, cantidad, ral, tiene_imprimacion FROM pedido_lineas WHERE pedido_id = ?",
      [id],
    );

    // 2. Actualizar stock de pintura por cada línea (si corresponde)
    for (const linea of lineas) {
      if (linea.ral && linea.cantidad && linea.ral !== "") {
        // Buscar pintura por RAL
        const [pinturas] = await conn.query(
          "SELECT id, stock FROM pintura WHERE ral = ? LIMIT 1",
          [linea.ral],
        );
        if (pinturas.length > 0) {
          // Devolver stock (asume 1:1, ajustar si hay lógica de consumo)
          await conn.query(
            "UPDATE pintura SET stock = stock + ? WHERE id = ?",
            [linea.cantidad, pinturas[0].id],
          );
        }
      }
    }

    // 3. Eliminar líneas del pedido
    await conn.query("DELETE FROM pedido_lineas WHERE pedido_id = ?", [id]);

    // 4. Eliminar el pedido/albarán
    const [result] = await conn.query("DELETE FROM pedidos WHERE id = ?", [id]);

    await conn.commit();
    res.status(200).json({ exito: true, deleted: result.affectedRows });
  } catch (err) {
    await conn.rollback();
    console.error("Error al eliminar albarán:", err);
    res.status(500).json({ error: "Error al eliminar albarán" });
  } finally {
    conn.release();
  }
});

export default router;
