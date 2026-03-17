import express from "express";
import conexion from "../../conexion.js";
import { console } from "inspector";

const router = express.Router();

const actualizarEstadoPedido = async (req, res) => {
  const pedidoId = req.params.pedidoId || req.params.id;
  const { estado } = req.body;

  // Validar que el estado sea uno permitido
  const estadosPermitidos = [
    "Borrador",
    "Confirmado",
    "EnProceso",
    "Completado",
    "Cancelado",
    "En Almacén",
  ];
  console.log("Estado recibido:", estado);

  if (!estadosPermitidos.includes(estado)) {
    return res.status(400).json({ error: "Estado no permitido" });
  }

  try {
    const query = "UPDATE pedidos SET estado = ? WHERE id = ?";
    const [resultados] = await conexion.query(query, [estado, pedidoId]);

    if (resultados.affectedRows === 0) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    res.status(200).json({ exito: "Estado del pedido actualizado" });
  } catch (err) {
    console.error("Error al ejecutar la consulta:", err);
    res.status(500).json({ error: "Error al actualizar el estado del pedido" });
  }
};

router.put("/:id/estado", actualizarEstadoPedido);
router.patch("/:pedidoId/estado", actualizarEstadoPedido);

export default router;
