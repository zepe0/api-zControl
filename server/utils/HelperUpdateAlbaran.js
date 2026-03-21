// Usamos export para que sean accesibles desde fuera
export const revertirStockPintura = async (lineaId, connection) => {
  const [movimientos] = await connection.query(
    "SELECT * FROM pintura_stock_movimientos WHERE pedido_linea_id = ? AND tipo = 'SALIDA'",
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
    debugger;
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
