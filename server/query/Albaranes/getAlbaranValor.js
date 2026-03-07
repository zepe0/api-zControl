import express from "express";
import conexion from "../../conexion.js";

const router = express.Router();

router.post("", async (req, res) => {
  const { id } = req.body;

  try {
    const queryPedido = `
      SELECT
        p.id AS pedido_id,
        p.cliente_id,
        p.fecha,
        p.estado,
        p.observaciones AS pedido_observaciones,
        c.id AS cliente_id_ref,
        c.nombre AS cliente_nombre,
        c.Nif AS cliente_nif,
        c.tel AS cliente_tel,
        c.dir AS cliente_dir
      FROM pedidos p
      LEFT JOIN cliente c ON p.cliente_id = c.id
      WHERE p.id = ?
    `;
    const [pedidoRows] = await conexion.query(queryPedido, [id]);

    if (pedidoRows.length === 0) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    const queryLineas = `
      SELECT
        pl.id AS idLinea,
        pl.pedido_id,
        pl.producto_id,
        pl.cantidad,
        pl.precio_unitario,
        pl.ral,
        pl.observaciones,
        pr.nombre AS nombreMaterial,
        pr.refObra,
        pr.uni,
        pr.consumo,
        pr.precio AS precioCatalogo,
        (pl.cantidad * pl.precio_unitario) AS totalLinea,
        pi.id AS pinturaId,
        pi.stock AS pinturaStock,
        pi.marca AS pinturaMarca,
        pi.RefPintura AS pinturaRef
      FROM pedido_lineas pl
      LEFT JOIN productos pr ON pl.producto_id = pr.id
      LEFT JOIN (
        SELECT
          MAX(id) AS id,
          ral,
          MAX(stock) AS stock,
          MAX(marca) AS marca,
          MAX(RefPintura) AS RefPintura
        FROM pintura
        GROUP BY ral
      ) pi ON pl.ral = pi.ral
      WHERE pl.pedido_id = ?
      ORDER BY pl.id ASC
    `;
    const [lineas] = await conexion.query(queryLineas, [id]);

    const pedido = pedidoRows[0];
    const totalPedido = lineas.reduce(
      (acc, linea) => acc + Number(linea.totalLinea || 0),
      0,
    );

    const response = {
      pedido: {
        id: pedido.pedido_id,
        pedido_id: pedido.pedido_id,
        cliente_id: pedido.cliente_id,
        fecha: pedido.fecha,
        estado: pedido.estado,
        observaciones: pedido.pedido_observaciones,
        total: totalPedido,
      },
      cliente: {
        id: pedido.cliente_id_ref,
        nombre: pedido.cliente_nombre,
        Nif: pedido.cliente_nif,
        tel: pedido.cliente_tel,
        dir: pedido.cliente_dir,
        proceso: pedido.estado,
        cliente_id: pedido.cliente_id,
        pedido_id: pedido.pedido_id,
        idAlbaran: pedido.pedido_id,
      },
      lineas,
      productos: lineas.map((linea) => ({
        idALbaran: linea.pedido_id,
        idMaterial: linea.producto_id,
        cantidad: linea.cantidad,
        ral: linea.ral,
        observaciones: linea.observaciones,
        nombreMaterial: linea.nombreMaterial,
        refObra: linea.refObra,
        precio: linea.precio_unitario,
        totalLinea: linea.totalLinea,
      })),
      totalPedido,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error("Error al ejecutar la consulta:", err);
    res.status(500).json({ error: "Error al obtener el albarán" });
  }
});

export default router;
