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

  if (movimientos.length > 0) {
    // Modo trazable: revertimos según los movimientos registrados
    for (const mov of movimientos) {
      await connection.query(
        "UPDATE pintura SET stock = stock + ? WHERE id = ?",
        [mov.cantidad_kg || mov.cantidad || 0, mov.pintura_id],
      );
    }
    // Limpiamos los movimientos revertidos
    await connection.query(
      "DELETE FROM pintura_stock_movimientos WHERE pedido_linea_id = ?",
      [lineaId],
    );
  } else {
    // Modo Fallback: No hay movimientos (pedido antiguo o lógica previa)
    // Consultamos la línea directamente para intentar revertir lo que haya
    const [lineas] = await connection.query(
      "SELECT ral, cantidad, consumo_pintura_kg, tiene_imprimacion FROM pedido_lineas WHERE id = ?",
      [lineaId],
    );

    if (lineas.length > 0) {
      const l = lineas[0];
      const cantidad = parseFloat(l.cantidad) || 0;
      const consumo = parseFloat(l.consumo_pintura_kg) || 0;
      const totalKg = cantidad * consumo;

      if (totalKg > 0) {
        // Revertir Pintura Principal
        if (l.ral && l.ral !== "Sin especificar") {
          await connection.query(
            "UPDATE pintura SET stock = stock + ? WHERE ral = ?",
            [totalKg, l.ral],
          );
        }
        // Revertir Imprimación si la línea lo indica
        if (l.tiene_imprimacion === 1 || l.tiene_imprimacion === true) {
          await connection.query(
            "UPDATE pintura SET stock = stock + ? WHERE ral = ?",
            [totalKg, "IMPRIMACION"],
          );
        }
      }
    }
  }
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
  const consumoPintura = parseFloat(lineaData.consumo_pintura_kg || lineaData.consumo) || 0;
  const cantidad = parseFloat(lineaData.cantidad || lineaData.unid) || 1;
  const kgTotalPintura = consumoPintura * cantidad;
  const ralValue = lineaData.ral || "Sin especificar";
  const tieneImprimacion =
    lineaData.tiene_imprimacion === true ||
    lineaData.tiene_imprimacion === 1 ||
    String(lineaData.tiene_imprimacion).toLowerCase() === "true" ||
    String(lineaData.tiene_imprimacion) === "1";

  // 1. Manejo de Pintura Principal
  if (kgTotalPintura > 0 && ralValue !== "Sin especificar") {
    const [pinturas] = await connection.query(
      `SELECT * FROM pintura 
       WHERE UPPER(TRIM(ral)) = ? 
          OR UPPER(TRIM(ral)) LIKE CONCAT(?, ' %') 
       LIMIT 1`,
      [ralValue.toUpperCase(), ralValue.toUpperCase()],
    );

    let pinturaId;
    let stockAnterior = 0;

    if (pinturas.length > 0) {
      const p = pinturas[0];
      pinturaId = p.id;
      stockAnterior = parseFloat(p.stock) || 0;
      const stockPosterior = stockAnterior - kgTotalPintura;

      await connection.query("UPDATE pintura SET stock = ? WHERE id = ?", [
        stockPosterior,
        pinturaId,
      ]);
    } else {
      // Crear pintura nueva si no existe (igual que en newAlbaran)
      pinturaId = Date.now().toString(36) + Math.random().toString(36).substring(2);
      stockAnterior = 0;
      const stockPosterior = -kgTotalPintura;

      await connection.query(
        "INSERT INTO pintura (id, ral, stock, marca) VALUES (?, ?, ?, ?)",
        [pinturaId, ralValue, stockPosterior, "Genérica"],
      );
    }

    // Registrar movimiento de pintura
    await connection.query(
      `INSERT INTO pintura_stock_movimientos
      (pedido_id, pedido_linea_id, pintura_id, ral_snapshot, tipo, cantidad_kg, stock_anterior_kg, stock_nuevo_kg, origen)
      VALUES (?, ?, ?, ?, 'AJUSTE', ?, ?, ?, 'update_pedido')`,
      [
        pedidoId,
        lineaId,
        pinturaId,
        ralValue,
        kgTotalPintura,
        stockAnterior,
        stockAnterior - kgTotalPintura,
      ],
    );
  }

  // 2. Manejo de Imprimación
  if (tieneImprimacion && kgTotalPintura > 0) {
    const ralImp = "IMPRIMACION";
    const [registrosImp] = await connection.query(
      "SELECT * FROM pintura WHERE ral = ? LIMIT 1",
      [ralImp],
    );

    let impId;
    let stockAnteriorImp = 0;

    if (registrosImp.length > 0) {
      const imp = registrosImp[0];
      impId = imp.id;
      stockAnteriorImp = parseFloat(imp.stock) || 0;
      const stockPosteriorImp = stockAnteriorImp - kgTotalPintura;

      await connection.query("UPDATE pintura SET stock = ? WHERE id = ?", [
        stockPosteriorImp,
        impId,
      ]);
    } else {
      impId = Date.now().toString(36) + Math.random().toString(36).substring(2);
      stockAnteriorImp = 0;
      const stockPosteriorImp = -kgTotalPintura;

      await connection.query(
        "INSERT INTO pintura (id, ral, stock, marca) VALUES (?, ?, ?, ?)",
        [impId, ralImp, stockPosteriorImp, "-"],
      );
    }

    // Registrar movimiento de imprimación
    await connection.query(
      `INSERT INTO pintura_stock_movimientos
      (pedido_id, pedido_linea_id, pintura_id, ral_snapshot, tipo, cantidad_kg, stock_anterior_kg, stock_nuevo_kg, origen)
      VALUES (?, ?, ?, ?, 'AJUSTE', ?, ?, ?, 'update_pedido_imprimacion')`,
      [
        pedidoId,
        lineaId,
        impId,
        ralImp,
        kgTotalPintura,
        stockAnteriorImp,
        stockAnteriorImp - kgTotalPintura,
      ],
    );
  }
};
