import express from "express";
import conexion from "../../conexion.js";

const router = express.Router();

const toNumber = (value, defaultValue = 0) => {
  const parsed = Number.parseFloat(String(value ?? "").replace(",", "."));
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

const toMysqlDateTime = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
};

const hasTable = async (connection, tableName) => {
  const [rows] = await connection.query(
    `
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = DATABASE() AND table_name = ?
    LIMIT 1
    `,
    [tableName],
  );
  return rows.length > 0;
};

const registrarEntradaStockLinea = async ({
  connection,
  pinturaId,
  proveedor,
  kgEntrada,
  precioAlbaran,
  cantidadCajas,
  precioTotalCaja,
  precioKgCalculadoInput,
  fifoEnabled,
  movimientosEnabled,
  fechaCompra = null,
}) => {
  const kg = toNumber(kgEntrada, 0);
  const totalAlbaran = toNumber(precioAlbaran, 0);
  const cajas = Math.max(Math.round(toNumber(cantidadCajas, 1)), 1);
  const fechaCompraMysql = toMysqlDateTime(fechaCompra);

  if (!pinturaId) {
    throw new Error("Falta pintura_id en una de las líneas");
  }

  if (kg <= 0) {
    throw new Error(
      `kg_entrada debe ser mayor que 0 para pintura ${pinturaId}`,
    );
  }

  const precioKgCalculado =
    toNumber(precioKgCalculadoInput, 0) > 0
      ? Number.parseFloat(toNumber(precioKgCalculadoInput, 0).toFixed(2))
      : Number.parseFloat((totalAlbaran / kg).toFixed(2));
  const totalCaja =
    toNumber(precioTotalCaja, 0) > 0
      ? Number.parseFloat(toNumber(precioTotalCaja, 0).toFixed(2))
      : Number.parseFloat((totalAlbaran / cajas).toFixed(2));

  const [pinturaRows] = await connection.query(
    "SELECT id, ral, stock FROM pintura WHERE id = ? FOR UPDATE",
    [pinturaId],
  );

  if (pinturaRows.length === 0) {
    debugger;
    throw new Error(`No se encontró la pintura ${pinturaId} para sumar stock`);
  }

  const stockAnterior = toNumber(pinturaRows[0].stock, 0);
  const stockNuevo = stockAnterior + kg;

  const sqlHistorial = `
    INSERT INTO pintura_compras
    (pintura_id, fecha_compra, cantidad_cajas, precio_total_caja, precio_kg_calculado, proveedor)
    VALUES (?, COALESCE(?, NOW()), ?, ?, ?, ?)
  `;

  await connection.query(sqlHistorial, [
    pinturaId,
    fechaCompraMysql,
    cajas,
    totalCaja,
    precioKgCalculado,
    proveedor ?? null,
  ]);

  const [[lastCompra]] = await connection.query(
    "SELECT id FROM pintura_compras WHERE pintura_id = ? ORDER BY id DESC LIMIT 1",
    [pinturaId],
  );

  if (fifoEnabled) {
    await connection.query(
      `
      INSERT INTO pintura_stock_lotes_fifo
      (pintura_id, compra_id, fecha_entrada, proveedor, cantidad_inicial_kg, cantidad_restante_kg, coste_unitario_eur_kg, estado)
      VALUES (?, ?, COALESCE(?, NOW()), ?, ?, ?, ?, 'ABIERTO')
      `,
      [
        pinturaId,
        lastCompra?.id ?? null,
        fechaCompraMysql,
        proveedor ?? null,
        kg,
        kg,
        precioKgCalculado,
      ],
    );
  }

  const [resultUpdate] = await connection.query(
    "UPDATE pintura SET stock = ? WHERE id = ?",
    [stockNuevo, pinturaId],
  );

  if (resultUpdate.affectedRows === 0) {
    throw new Error(`No se pudo actualizar stock para la pintura ${pinturaId}`);
  }

  if (movimientosEnabled) {
    await connection.query(
      `
      INSERT INTO pintura_stock_movimientos
      (pedido_id, pedido_linea_id, pintura_id, ral_snapshot, tipo, cantidad_kg,
       stock_anterior_kg, stock_nuevo_kg, coste_unitario_eur_kg, coste_total_eur,
       origen, observaciones, usuario)
      VALUES (NULL, NULL, ?, ?, 'ENTRADA', ?, ?, ?, ?, ?, 'entrada_mercancia', ?, NULL)
      `,
      [
        pinturaId,
        pinturaRows[0].ral,
        kg,
        stockAnterior,
        stockNuevo,
        precioKgCalculado,
        totalAlbaran,
        proveedor ?? null,
      ],
    );
  }
};

// POST /api/pintura/guardar
router.post("/guardar", async (req, res) => {
  const {
    id,
    operacion,
    kg_entrada,
    precio_albaran,
    cantidad_cajas,
    precio_total_caja,
    precio_kg_calculado,
    fecha_compra,
    proveedor,
    ral,
    marca,
    refpintura,
    RefPintura,
    stock,
    precio,
  } = req.body || {};

  const refPinturaValue = refpintura ?? RefPintura ?? null;

  let connection;
  try {
    if (operacion === "stock") {
      const kg = toNumber(kg_entrada, 0);
      const totalAlbaran = toNumber(precio_albaran, 0);
      const cajas = Math.max(Math.round(toNumber(cantidad_cajas, 1)), 1);
      const fechaCompraMysql = toMysqlDateTime(fecha_compra);

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Para operacion stock debes enviar id de pintura",
        });
      }

      if (kg <= 0) {
        debugger;
        return res.status(400).json({
          success: false,
          message: "kg_entrada debe ser mayor que 0",
        });
      }

      const precioKgCalculado =
        toNumber(precio_kg_calculado, 0) > 0
          ? Number.parseFloat(toNumber(precio_kg_calculado, 0).toFixed(2))
          : Number.parseFloat((totalAlbaran / kg).toFixed(2));
      const totalCaja =
        toNumber(precio_total_caja, 0) > 0
          ? Number.parseFloat(toNumber(precio_total_caja, 0).toFixed(2))
          : Number.parseFloat((totalAlbaran / cajas).toFixed(2));

      connection = await conexion.getConnection();
      await connection.beginTransaction();

      const fifoEnabled = await hasTable(
        connection,
        "pintura_stock_lotes_fifo",
      );
      const movimientosEnabled = await hasTable(
        connection,
        "pintura_stock_movimientos",
      );

      const [pinturaRows] = await connection.query(
        "SELECT id, ral, stock FROM pintura WHERE id = ? FOR UPDATE",
        [id],
      );

      if (pinturaRows.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: "No se encontró la pintura para sumar stock",
        });
      }

      const stockAnterior = toNumber(pinturaRows[0].stock, 0);
      const stockNuevo = stockAnterior + kg;

      // 1) Histórico de compra
      const sqlHistorial = `
        INSERT INTO pintura_compras
        (pintura_id, fecha_compra, cantidad_cajas, precio_total_caja, precio_kg_calculado, proveedor)
        VALUES (?, COALESCE(?, NOW()), ?, ?, ?, ?)
      `;
      await connection.query(sqlHistorial, [
        id,
        fechaCompraMysql,
        cajas,
        totalCaja,
        precioKgCalculado,
        proveedor ?? null,
      ]);

      const [[lastCompra]] = await connection.query(
        "SELECT id FROM pintura_compras WHERE pintura_id = ? ORDER BY id DESC LIMIT 1",
        [id],
      );

      if (fifoEnabled) {
        await connection.query(
          `
          INSERT INTO pintura_stock_lotes_fifo
          (pintura_id, compra_id, fecha_entrada, proveedor, cantidad_inicial_kg, cantidad_restante_kg, coste_unitario_eur_kg, estado)
          VALUES (?, ?, COALESCE(?, NOW()), ?, ?, ?, ?, 'ABIERTO')
          `,
          [
            id,
            lastCompra?.id ?? null,
            fechaCompraMysql,
            proveedor ?? null,
            kg,
            kg,
            precioKgCalculado,
          ],
        );
      }

      // 2) Suma de stock en tabla maestra
      const sqlUpdateStock = "UPDATE pintura SET stock = ? WHERE id = ?";
      const [resultUpdate] = await connection.query(sqlUpdateStock, [
        stockNuevo,
        id,
      ]);

      if (resultUpdate.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: "No se encontró la pintura para sumar stock",
        });
      }

      if (movimientosEnabled) {
        await connection.query(
          `
          INSERT INTO pintura_stock_movimientos
          (pedido_id, pedido_linea_id, pintura_id, ral_snapshot, tipo, cantidad_kg,
           stock_anterior_kg, stock_nuevo_kg, coste_unitario_eur_kg, coste_total_eur,
           origen, observaciones, usuario)
          VALUES (NULL, NULL, ?, ?, 'ENTRADA', ?, ?, ?, ?, ?, 'entrada_mercancia', ?, NULL)
          `,
          [
            id,
            pinturaRows[0].ral,
            kg,
            stockAnterior,
            stockNuevo,
            precioKgCalculado,
            totalAlbaran,
            proveedor ?? null,
          ],
        );
      }

      await connection.commit();
      return res.json({
        success: true,
        message: "Entrada de stock registrada correctamente",
      });
    }

    // ESCENARIO INFO: editar datos fijos o crear pintura
    if (id) {
      const campos = [];
      const valores = [];

      if (ral !== undefined) {
        campos.push("ral = ?");
        valores.push(ral);
      }
      if (marca !== undefined) {
        campos.push("marca = ?");
        valores.push(marca);
      }
      if (refPinturaValue !== undefined) {
        campos.push("refPintura = ?");
        valores.push(refPinturaValue);
      }
      if (stock !== undefined) {
        campos.push("stock = ?");
        valores.push(toNumber(stock, 0));
      }
      if (precio !== undefined) {
        campos.push("precio = ?");
        valores.push(toNumber(precio, 0));
      }

      if (!campos.length) {
        return res.status(400).json({
          success: false,
          message: "No hay campos para actualizar",
        });
      }

      const sqlEdit = `UPDATE pintura SET ${campos.join(", ")} WHERE id = ?`;
      valores.push(id);
      const [resultEdit] = await conexion.query(sqlEdit, valores);

      if (resultEdit.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Pintura no encontrada",
        });
      }

      return res.json({ success: true, message: "Información actualizada" });
    }

    const newId =
      Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    const sqlNew =
      "INSERT INTO pintura (id, ral, marca, refPintura, stock) VALUES (?, ?, ?, ?, ?)";

    await conexion.query(sqlNew, [
      newId,
      ral ?? "",
      marca ?? "",
      refPinturaValue ?? null,
      toNumber(stock, 0),
    ]);

    return res.json({
      success: true,
      message: "Nueva pintura creada",
      id: newId,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor",
      detail: error.message,
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// POST /api/pintura/procesar-albaran
// Procesa un albarán de entrada con múltiples líneas en una sola transacción.
router.post("/procesar-albaran", async (req, res) => {
  const { fecha_compra: fechaCompra, lineas } = req.body || {};

  if (!Array.isArray(lineas) || lineas.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Debes enviar lineas con al menos una entrada",
    });
  }

  let connection;
  try {
    connection = await conexion.getConnection();
    await connection.beginTransaction();

    const fifoEnabled = await hasTable(connection, "pintura_stock_lotes_fifo");
    const movimientosEnabled = await hasTable(
      connection,
      "pintura_stock_movimientos",
    );

    for (const linea of lineas) {
      await registrarEntradaStockLinea({
        connection,
        pinturaId: linea?.pintura_id,
        proveedor: linea?.proveedor,
        kgEntrada: linea?.kg_entrada,
        precioAlbaran: linea?.precio_albaran,
        cantidadCajas: linea?.cantidad_cajas,
        precioTotalCaja: linea?.precio_total_caja,
        precioKgCalculadoInput: linea?.precio_kg_calculado,
        fifoEnabled,
        movimientosEnabled,
        fechaCompra,
      });
    }

    await connection.commit();
    return res.json({
      success: true,
      message: "Albaran procesado correctamente",
      totalLineas: lineas.length,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error en procesar-albaran:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Error al procesar el albaran",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// GET /api/pintura/historial/:id
router.get("/historial/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const sql =
      "SELECT * FROM pintura_compras WHERE pintura_id = ? ORDER BY fecha_compra DESC LIMIT 5";
    const [rows] = await conexion.query(sql, [id]);
    return res.json(rows);
  } catch (error) {
    console.error("Error al obtener historial de pintura:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener historial de pintura",
    });
  }
});

// GET /api/pintura/lista-completa
// Específico para la pantalla de Gestión con historial incluido
router.get("/lista-completa", async (req, res) => {
  try {
    const sql = `
      SELECT p.*,
      COALESCE((
        SELECT SUM(COALESCE(h2.cantidad_cajas, 0))
        FROM pintura_compras h2
        WHERE h2.pintura_id = p.id
      ), 0) AS total_cajas_compradas,
      (
        SELECT JSON_ARRAYAGG(h_data)
        FROM (
          SELECT JSON_OBJECT(
            'fecha_compra', h.fecha_compra,
            'cantidad_cajas', h.cantidad_cajas,
            'precio_total_caja', h.precio_total_caja,
            'precio_kg_calculado', h.precio_kg_calculado,
            'proveedor', h.proveedor
          ) AS h_data
          FROM pintura_compras h
          WHERE h.pintura_id = p.id
          ORDER BY h.fecha_compra DESC          
        ) AS sub
      ) AS historial
      FROM pintura p
    `;

    const [rows] = await conexion.query(sql);

    const data = rows.map((row) => ({
      ...row,
      historial:
        row.historial != null
          ? typeof row.historial === "string"
            ? JSON.parse(row.historial)
            : row.historial
          : [],
    }));

    return res.json(data);
  } catch (error) {
    console.error("Error en lista-completa:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error al obtener lista completa" });
  }
});

// GET /api/pintura/sin-precio/count
// Cuenta pinturas activas (stock > 0) sin ninguna compra registrada
router.get("/sin-precio/count", async (req, res) => {
  try {
    const [[row]] = await conexion.query(`
      SELECT COUNT(*) AS count
      FROM pintura p
      WHERE p.stock > 0
        AND NOT EXISTS (
          SELECT 1 FROM pintura_compras pc WHERE pc.pintura_id = p.id
        )
    `);
    return res.json({ count: Number(row?.count || 0) });
  } catch (error) {
    console.error("Error en sin-precio/count:", error);
    return res.status(500).json({ count: 0 });
  }
});

export default router;
