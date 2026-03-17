import express from "express";
import conexion from "../../conexion.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;

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
        pl.unidad_medida,          
        pl.precio_unitario,
        pl.ral,
        pl.tiene_imprimacion, -- AÑADIDO: Recuperamos el flag de imprimación
        pl.refObra,
        pl.observaciones,
        pl.largo,
        pl.ancho,
        pl.espesor,
        pl.total_unidades_calculadas,
        pl.precio_pintura_extra,
        pl.fabricacion_manual,      
        pl.fecha_fabricacion_manual, 
        pr.nombre AS nombreMaterial,
        pr.uni,                                     
        pr.precio AS precioCatalogo,
        pi.id AS pinturaId,
        pi.stock AS pinturaStock,
        pi.marca AS pinturaMarca
      FROM pedido_lineas pl
      LEFT JOIN productos pr ON pl.producto_id = pr.id
      LEFT JOIN (
        SELECT id, ral, stock, marca FROM pintura
        WHERE id IN (SELECT MAX(id) FROM pintura GROUP BY ral)
      ) pi ON pl.ral = pi.ral
      WHERE pl.pedido_id = ?
      ORDER BY pl.id ASC
    `;
    const [lineas] = await conexion.query(queryLineas, [id]);

    const pedido = pedidoRows[0];

    const response = {
      pedido: {
        id: pedido.pedido_id,
        pedido_id: pedido.pedido_id,
        cliente_id: pedido.cliente_id,
        fecha: pedido.fecha,
        estado: pedido.estado,
        observaciones: pedido.pedido_observaciones,
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
      lineas: lineas.map((linea) => ({
        idLinea: linea.idLinea,
        pedido_id: linea.pedido_id,
        producto_id: linea.producto_id,
        cantidad: linea.cantidad,
        precio_unitario: linea.precio_unitario,
        ral: linea.ral,
        tiene_imprimacion: linea.tiene_imprimacion, // AÑADIDO: Lo enviamos al front
        observaciones: linea.observaciones,
        refObra: linea.refObra,
        largo: linea.largo,
        ancho: linea.ancho,
        espesor: linea.espesor,
        total_unidades_calculadas: linea.total_unidades_calculadas,
        precio_pintura_extra: linea.precio_pintura_extra,
        fabricacion_manual: linea.fabricacion_manual,
        fecha_fabricacion_manual: linea.fecha_fabricacion_manual,
        nombreMaterial: linea.nombreMaterial,
        uni: linea.uni,
        consumo: linea.consumo,
        precioCatalogo: linea.precioCatalogo,
        pinturaId: linea.pinturaId,
        pinturaStock: linea.pinturaStock,
        pinturaMarca: linea.pinturaMarca,
        pinturaRef: linea.pinturaRef,
      })),
    };

    res.status(200).json(response);
  } catch (err) {
    console.error("Error al ejecutar la consulta:", err);
    res.status(500).json({ error: "Error al obtener el albarán" });
  }
});

export default router;
