import express from "express";
import conexion from "../../conexion.js";

const toNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const normalizeToken = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const isWildcardRal = (value) => {
  const token = normalizeToken(value);
  return (
    token === "pendiente" ||
    token === "sin color" ||
    token === "sincolor" ||
    token === "sistema" ||
    token === "sin especificar" ||
    token === "sinespecificar"
  );
};

const checkPedidoStock = async (pedidoId) => {
  const [lineas] = await conexion.query(
    `
      SELECT 
        pl.id, 
        pl.ral, 
        pl.cantidad,
        pl.tiene_imprimacion,
        pl.consumo_pintura_kg,
        pl.consumo_imprimacion
      FROM pedido_lineas pl
      WHERE pl.pedido_id = ?
    `,
    [pedidoId],
  );

  const insufficient = [];

  for (const linea of lineas) {
    const ral = String(linea?.ral || "").trim();
    if (!ral || ral === "-" || isWildcardRal(ral)) {
      continue;
    }

    const consumoPintura = toNumber(linea?.consumo_pintura_kg, NaN);
    const requiredRal =
      Number.isFinite(consumoPintura) && consumoPintura > 0
        ? consumoPintura
        : Math.max(toNumber(linea?.cantidad, 0), 0);

    if (requiredRal > 0) {
      const [pinturaRows] = await conexion.query(
        `
          SELECT id, ral, stock
          FROM pintura
          WHERE UPPER(TRIM(ral)) = ?
             OR UPPER(TRIM(ral)) LIKE CONCAT(?, ' %')
          ORDER BY CASE WHEN UPPER(TRIM(ral)) = ? THEN 0 ELSE 1 END, id ASC
          LIMIT 1
        `,
        [
          String(ral).trim().toUpperCase(),
          String(ral).trim().toUpperCase(),
          String(ral).trim().toUpperCase(),
        ],
      );

      const pintura = pinturaRows[0];
      const stockRal = toNumber(pintura?.stock, 0);

      if (stockRal < requiredRal) {
        insufficient.push({
          lineId: linea.id,
          ral: pintura?.ral || ral,
          required: requiredRal,
          stock: stockRal,
        });
      }
    }

    const hasImp =
      linea?.tiene_imprimacion === 1 ||
      linea?.tiene_imprimacion === true ||
      linea?.tiene_imprimacion === "1";

    if (hasImp) {
      const consumoImp = toNumber(linea?.consumo_imprimacion, NaN);
      const requiredImp =
        Number.isFinite(consumoImp) && consumoImp > 0
          ? consumoImp
          : requiredRal;

      if (requiredImp > 0) {
        const [impRows] = await conexion.query(
          `
            SELECT id, ral, stock
            FROM pintura
            WHERE UPPER(TRIM(ral)) = 'IMPRIMACION'
            LIMIT 1
          `,
        );

        const pintura = impRows[0];
        const stockImp = toNumber(pintura?.stock, 0);

        if (stockImp < requiredImp) {
          insufficient.push({
            lineId: linea.id,
            ral: "IMPRIMACION",
            required: requiredImp,
            stock: stockImp,
          });
        }
      }
    }
  }

  return insufficient;
};

const crearRouter = (io) => {
  const router = express.Router();

  const actualizarEstadoPedido = async (req, res) => {
    const pedidoId = req.params.id || req.params.pedidoId;
    const { estado } = req.body;

    const estadosPermitidos = [
      "Borrador",
      "Confirmado",
      "EnProceso",
      "Completado",
      "Cancelado",
      "Almacén",
      "En Almacén",
      "Pendiente",
    ];
    console.log("Estado recibido:", estado);

    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({ error: "Estado no permitido" });
    }

    try {
      let finalEstado = estado;

      if (estado === "Confirmado") {
        const insufficient = await checkPedidoStock(pedidoId);
        if (insufficient.length > 0) {
          finalEstado = "Pendiente";
          console.log(
            `Pedido ${pedidoId}: Confirmado → Pendiente (falta stock)`,
          );
        }
      }

      const query = "UPDATE pedidos SET estado = ? WHERE id = ?";
      const [resultados] = await conexion.query(query, [finalEstado, pedidoId]);

      if (resultados.affectedRows === 0) {
        return res.status(404).json({ error: "Pedido no encontrado" });
      }

      if (io) {
        io.emit("estadoPedidoActualizado", {
          pedidoId,
          estado: finalEstado,
          cambioAutomatico: finalEstado !== estado,
        });
      }

      res.status(200).json({
        exito: "Estado del pedido actualizado",
        estado: finalEstado,
        cambioAutomatico: finalEstado !== estado,
      });
    } catch (err) {
      console.error("Error al ejecutar la consulta:", err);
      res
        .status(500)
        .json({ error: "Error al actualizar el estado del pedido" });
    }
  };

  router.put("/:id/estado", actualizarEstadoPedido);
  router.patch("/:pedidoId/estado", actualizarEstadoPedido);
  router.patch("/:fecha/estado/:id", actualizarEstadoPedido);

  return router;
};

export default crearRouter;
