/**
 * Revierte el stock de pintura asociado a una línea de pedido.
 *
 * Busca todos los movimientos de stock (tipo 'SALIDA' o 'AJUSTE') vinculados a la línea
 * y devuelve las cantidades a la tabla de pintura. Luego elimina los movimientos registrados.
 *
 * @param {number} lineaId - ID de la línea de pedido cuya stock se va a revertir
 * @param {object} connection - Conexión a la base de datos (con transacción activa)
 * @returns {Promise<void>}
 *
 * @description
 * Se utiliza en dos escenarios:
 * 1. Cuando se elimina una línea de pedido completa
 * 2. Cuando se modifica el RAL de una línea (se revierte el stock anterior antes de aplicar el nuevo)
 *
 * @example
 * await revertirStockPintura(123, connection);
 */
export const revertirStockPintura = async (lineaId, connection) => {
  const [movimientos] = await connection.query(
    "SELECT * FROM pintura_stock_movimientos WHERE pedido_linea_id = ? AND tipo IN ('SALIDA', 'AJUSTE')",
    [lineaId],
  );

  for (const mov of movimientos) {
    await connection.query(
      "UPDATE pintura SET stock = stock + ? WHERE id = ?",
      [mov.cantidad, mov.pintura_id],
    );
  }

  await connection.query(
    "DELETE FROM pintura_stock_movimientos WHERE pedido_linea_id = ?",
    [lineaId],
  );
};

/**
 * Aplica el consumo de stock de pintura para una línea de pedido.
 *
 * Calcula la cantidad de pintura necesaria según el consumo especificado,
 * decrementa el stock en la tabla `pintura` y registra el movimiento en
 * `pintura_stock_movimientos` para trazabilidad.
 *
 * @param {number} pedidoId - ID del pedido al que pertenece la línea
 * @param {number} lineaId - ID de la línea de pedido
 * @param {object} lineaData - Datos de la línea de pedido
 * @param {string} lineaData.ral - Código RAL de la pintura
 * @param {number|string} lineaData.consumo_pintura_kg - Consumo en kg (también acepta `consumo`)
 * @param {object} connection - Conexión a la base de datos (con transacción activa)
 * @returns {Promise<void>}
 *
 * @description
 * Se utiliza en dos escenarios:
 * 1. Cuando se crea una nueva línea de pedido con RAL especificado
 * 2. Cuando se modifica el RAL de una línea existente (después de revertir el stock anterior)
 *
 * @example
 * await aplicarStockPintura(pedidoId, lineaId, { ral: 'RAL 9010', consumo: 2.5 }, connection);
 */
export const aplicarStockPintura = async (
  pedidoId,
  lineaId,
  lineaData,
  connection,
) => {
  const kg = parseFloat(lineaData.consumo_pintura_kg || lineaData.consumo) || 0;
  if (kg <= 0) return;

  const [pinturas] = await connection.query(
    "SELECT * FROM pintura WHERE ral = ? LIMIT 1",
    [lineaData.ral],
  );

  if (pinturas.length > 0) {
    const p = pinturas[0];
    const stockAnterior = p.stock;
    const stockPosterior = stockAnterior - kg;

    await connection.query("UPDATE pintura SET stock = ? WHERE id = ?", [
      stockPosterior,
      p.id,
    ]);
    await connection.query(
      `INSERT INTO pintura_stock_movimientos
      (pedido_id, pedido_linea_id, pintura_id, ral_snapshot, tipo, cantidad_kg, stock_anterior_kg, stock_nuevo_kg, origen)
      VALUES (?, ?, ?, ?, 'AJUSTE', ?, ?, ?, 'update_pedido')`,
      [
        pedidoId,
        lineaId,
        p.id,
        lineaData.ral,
        kg,
        stockAnterior,
        stockPosterior,
      ],
    );
  }
};
