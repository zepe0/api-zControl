import express from "express";
import conexion from "../conexion.js";

const router = express.Router();

const currentPeriod = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
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

const hasView = async (connection, viewName) => {
  const [rows] = await connection.query(
    `
    SELECT 1
    FROM information_schema.views
    WHERE table_schema = DATABASE() AND table_name = ?
    LIMIT 1
    `,
    [viewName],
  );
  return rows.length > 0;
};

const toNumber = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

router.get("/analytics/pinturas/monthly", async (req, res) => {
  const period = String(req.query.period || currentPeriod()).trim();

  if (!/^\d{4}-\d{2}$/.test(period)) {
    return res
      .status(400)
      .json({ error: "El parámetro period debe tener formato YYYY-MM" });
  }

  let connection;
  try {
    connection = await conexion.getConnection();

    const movimientosReady = await hasTable(
      connection,
      "pintura_stock_movimientos",
    );
    const gastoViewReady = await hasView(
      connection,
      "vw_pintura_gasto_mensual",
    );

    let gastoRows = [];
    let consumoRows = [];
    let dailyRows = [];
    let weeklyRows = [];

    if (gastoViewReady) {
      const [rows] = await connection.query(
        `
        SELECT periodo, pintura_id, ral, marca, compras, total_cajas, total_kg_comprados, gasto_total_eur, coste_medio_eur_kg
        FROM vw_pintura_gasto_mensual
        WHERE periodo = ?
        ORDER BY gasto_total_eur DESC, ral ASC
        `,
        [period],
      );
      gastoRows = rows;
    }

    if (movimientosReady) {
      const [rows] = await connection.query(
        `
        SELECT
          ral_snapshot AS ral,
          SUM(CASE WHEN tipo = 'SALIDA' THEN cantidad_kg ELSE 0 END) AS consumo_kg,
          SUM(CASE WHEN tipo = 'SALIDA' THEN COALESCE(coste_total_eur, 0) ELSE 0 END) AS coste_salidas_eur,
          SUM(CASE WHEN tipo = 'ENTRADA' THEN cantidad_kg ELSE 0 END) AS entradas_kg
        FROM pintura_stock_movimientos
        WHERE DATE_FORMAT(created_at, '%Y-%m') = ?
        GROUP BY ral_snapshot
        ORDER BY consumo_kg DESC, ral_snapshot ASC
        `,
        [period],
      );
      consumoRows = rows;

      const [daily] = await connection.query(
        `
        SELECT
          DATE_FORMAT(created_at, '%Y-%m-%d') AS day_iso,
          DATE_FORMAT(created_at, '%d') AS day_label,
          SUM(CASE WHEN tipo = 'SALIDA' THEN cantidad_kg ELSE 0 END) AS consumo_kg,
          SUM(CASE WHEN tipo = 'ENTRADA' THEN cantidad_kg ELSE 0 END) AS entrada_kg,
          SUM(CASE WHEN tipo = 'SALIDA' THEN COALESCE(coste_total_eur, 0) ELSE 0 END) AS coste_salidas_eur,
          SUM(CASE WHEN tipo = 'ENTRADA' THEN COALESCE(coste_total_eur, 0) ELSE 0 END) AS coste_entradas_eur
        FROM pintura_stock_movimientos
        WHERE DATE_FORMAT(created_at, '%Y-%m') = ?
        GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d'), DATE_FORMAT(created_at, '%d')
        ORDER BY day_iso ASC
        `,
        [period],
      );
      dailyRows = daily;

      const [weekly] = await connection.query(
        `
        SELECT
          ral_snapshot AS ral,
          YEARWEEK(created_at, 3) AS year_week,
          DATE_FORMAT(MIN(created_at), '%Y-%m-%d') AS week_start,
          SUM(CASE WHEN tipo = 'SALIDA' THEN cantidad_kg ELSE 0 END) AS consumo_kg,
          SUM(CASE WHEN tipo = 'SALIDA' THEN COALESCE(coste_total_eur, 0) ELSE 0 END) AS coste_salidas_eur
        FROM pintura_stock_movimientos
        WHERE DATE_FORMAT(created_at, '%Y-%m') = ?
          AND COALESCE(ral_snapshot, '') <> ''
        GROUP BY ral_snapshot, YEARWEEK(created_at, 3)
        ORDER BY ral_snapshot ASC, year_week ASC
        `,
        [period],
      );
      weeklyRows = weekly;
    }

    const consumoByRal = new Map(
      consumoRows.map((row) => [String(row.ral || "").trim(), row]),
    );

    const topRals = gastoRows.map((row) => {
      const consumo = consumoByRal.get(String(row.ral || "").trim());
      return {
        ral: row.ral,
        marca: row.marca,
        gasto_total_eur: toNumber(row.gasto_total_eur),
        total_kg_comprados: toNumber(row.total_kg_comprados),
        coste_medio_eur_kg: toNumber(row.coste_medio_eur_kg),
        consumo_kg: toNumber(consumo?.consumo_kg),
        coste_salidas_eur: toNumber(consumo?.coste_salidas_eur),
      };
    });

    const topRalsMerged =
      topRals.length > 0
        ? topRals
        : consumoRows.map((row) => ({
            ral: row.ral,
            marca: "-",
            gasto_total_eur: 0,
            total_kg_comprados: toNumber(row.entradas_kg),
            coste_medio_eur_kg: 0,
            consumo_kg: toNumber(row.consumo_kg),
            coste_salidas_eur: toNumber(row.coste_salidas_eur),
          }));

    const totals = topRalsMerged.reduce(
      (acc, item) => {
        acc.gastoComprasEur += toNumber(item.gasto_total_eur);
        acc.kgComprados += toNumber(item.total_kg_comprados);
        acc.consumoKg += toNumber(item.consumo_kg);
        acc.costeSalidasEur += toNumber(item.coste_salidas_eur);
        return acc;
      },
      {
        gastoComprasEur: 0,
        kgComprados: 0,
        consumoKg: 0,
        costeSalidasEur: 0,
      },
    );

    const totalItems = topRalsMerged.length;
    const costeMedioCompra =
      totals.kgComprados > 0 ? totals.gastoComprasEur / totals.kgComprados : 0;
    const costeMedioSalida =
      totals.consumoKg > 0 ? totals.costeSalidasEur / totals.consumoKg : 0;

    const dailySeries = dailyRows.map((row) => ({
      dayIso: row.day_iso,
      day: row.day_label,
      consumoKg: toNumber(row.consumo_kg),
      entradaKg: toNumber(row.entrada_kg),
      costeSalidasEur: toNumber(row.coste_salidas_eur),
      costeEntradasEur: toNumber(row.coste_entradas_eur),
    }));

    const weeklyByRal = new Map();
    for (const row of weeklyRows) {
      const ral = String(row?.ral || "").trim();
      if (!ral) continue;
      const list = weeklyByRal.get(ral) || [];
      const consumoKg = toNumber(row?.consumo_kg);
      const costeSalidasEur = toNumber(row?.coste_salidas_eur);
      const unitCost = consumoKg > 0 ? costeSalidasEur / consumoKg : 0;
      list.push({
        yearWeek: row?.year_week,
        weekStart: row?.week_start,
        consumoKg,
        costeSalidasEur,
        unitCost,
      });
      weeklyByRal.set(ral, list);
    }

    const weeklyCostRise = [];
    for (const [ral, weeks] of weeklyByRal.entries()) {
      const weeksWithFlow = weeks.filter((w) => w.consumoKg > 0);
      if (weeksWithFlow.length < 2) continue;
      const prev = weeksWithFlow[weeksWithFlow.length - 2];
      const last = weeksWithFlow[weeksWithFlow.length - 1];
      if (prev.unitCost <= 0 || last.unitCost <= 0) continue;

      const deltaPct = ((last.unitCost - prev.unitCost) / prev.unitCost) * 100;
      if (deltaPct < 12) continue;

      weeklyCostRise.push({
        ral,
        prevWeekStart: prev.weekStart,
        lastWeekStart: last.weekStart,
        prevUnitCost: prev.unitCost,
        lastUnitCost: last.unitCost,
        prevConsumoKg: prev.consumoKg,
        lastConsumoKg: last.consumoKg,
        deltaPct,
      });
    }

    weeklyCostRise.sort((a, b) => b.deltaPct - a.deltaPct);

    return res.status(200).json({
      period,
      totals: {
        ...totals,
        costeMedioCompra,
        costeMedioSalida,
        totalReferencias: totalItems,
      },
      topRals: topRalsMerged.slice(0, 5),
      rows: topRalsMerged,
      dailySeries,
      weeklyCostRise: weeklyCostRise.slice(0, 8),
    });
  } catch (error) {
    console.error("Error al obtener analytics mensuales de pinturas:", error);
    return res
      .status(500)
      .json({ error: "Error al obtener analytics mensuales de pinturas" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

router.get("/analytics/pinturas/data-quality", async (req, res) => {
  const period = String(req.query.period || currentPeriod()).trim();

  if (!/^\d{4}-\d{2}$/.test(period)) {
    return res
      .status(400)
      .json({ error: "El parámetro period debe tener formato YYYY-MM" });
  }

  let connection;
  try {
    connection = await conexion.getConnection();

    const movimientosReady = await hasTable(
      connection,
      "pintura_stock_movimientos",
    );
    const comprasReady = await hasTable(connection, "pintura_compras");

    let salidasSinCoste = 0;
    let movimientosSinRal = 0;

    if (movimientosReady) {
      const [[salidas]] = await connection.query(
        `
        SELECT COUNT(*) AS count
        FROM pintura_stock_movimientos
        WHERE DATE_FORMAT(created_at, '%Y-%m') = ?
          AND tipo = 'SALIDA'
          AND COALESCE(coste_total_eur, 0) <= 0
          AND pintura_id NOT IN ('9999', 'PI-PEND', 'PI-SIN-COLOR')
          AND COALESCE(ral_snapshot, '') NOT IN ('Sin Especificar', 'PENDIENTE', 'SIN COLOR', '')
        `,
        [period],
      );
      salidasSinCoste = Number(salidas?.count || 0);

      const [[sinRal]] = await connection.query(
        `
        SELECT COUNT(*) AS count
        FROM pintura_stock_movimientos
        WHERE DATE_FORMAT(created_at, '%Y-%m') = ?
          AND COALESCE(ral_snapshot, '') = ''
          AND pintura_id NOT IN ('9999', 'PI-PEND', 'PI-SIN-COLOR')
        `,
        [period],
      );
      movimientosSinRal = Number(sinRal?.count || 0);
    }

    let pinturasSinPrecio = 0;
    if (comprasReady) {
      const [[sinPrecio]] = await connection.query(
        `
        SELECT COUNT(*) AS count
        FROM pintura p
        WHERE p.stock > 0
          AND p.marca <> 'SISTEMA'
          AND p.id NOT IN ('9999', 'PI-PEND', 'PI-SIN-COLOR')
          AND NOT EXISTS (
            SELECT 1 FROM pintura_compras pc WHERE pc.pintura_id = p.id
          )
        `,
      );
      pinturasSinPrecio = Number(sinPrecio?.count || 0);
    }

    const attentionCount =
      salidasSinCoste + movimientosSinRal + pinturasSinPrecio;

    return res.status(200).json({
      period,
      salidasSinCoste,
      movimientosSinRal,
      pinturasSinPrecio,
      attentionCount,
    });
  } catch (error) {
    console.error("Error al obtener data quality de pinturas:", error);
    return res.status(500).json({
      error: "Error al obtener data quality de pinturas",
      attentionCount: 0,
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

export default router;
