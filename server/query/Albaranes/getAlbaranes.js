import express from "express";
import conexion from "../../conexion.js";

const router = express.Router();

// Endpoint para obtener los albaranes con datos del cliente y detalles de líneas y productos
router.get("", async (req, res) => {
  const queryAlbaranes = `
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

  const queryLineas = `
    SELECT
      pl.pedido_id,
      pl.producto_id,
      pl.cantidad,
      pl.precio_unitario,
      pl.ral,
      pl.observaciones,
      pl.refObra,
      pr.nombre AS nombreMaterial,
      pr.uni
    FROM pedido_lineas pl
    LEFT JOIN productos pr ON pl.producto_id = pr.id
    WHERE pl.pedido_id = ?
  `;

  try {
    const [albaranes] = await conexion.query(queryAlbaranes);

    for (const albaran of albaranes) {
      const [lineas] = await conexion.query(queryLineas, [albaran.id]);
      albaran.lineas = lineas.map((linea) => ({
        producto_id: linea.producto_id,
        cantidad: linea.cantidad,
        precio_unitario: linea.precio_unitario,
        ral: linea.ral,
        observaciones: linea.observaciones,
        refObra: linea.refObra,
        nombreMaterial: linea.nombreMaterial,
        uni: linea.uni,
      }));
    }

    res.status(200).json(albaranes);
  } catch (err) {
    console.error("Error al ejecutar la consulta:", err);
    res.status(500).json({ error: "Error al obtener los albaranes" });
  }
});

export default router;
