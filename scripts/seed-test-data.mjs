/**
 * SEED: Datos de test para validar todas las funcionalidades de analytics
 * de zControl (periodo 2026-03)
 *
 * Cubre:
 *  - Alert 1: consumo alto SIN compra (RAL 1021 / p14 → formato_kg=NULL → kg_comprados=0)
 *  - Alert 2: subida coste semanal >12% (RAL 7016 / p01 → semana 11 vs 12)
 *  - Alert 3: stock bajo + consumo alto (RAL 7035 / p04 → stock=8.25 ≤ 10)
 *  - Data Quality: salidasSinCoste (adicionales), movimientoSinRal (1 test)
 *  - pinturasSinPrecio ya existe: hay 14+ pinturas con stock>0 y sin compras
 *
 * Para limpiar: node scripts/seed-test-data.mjs --clean
 */

import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "qalz943.zepedev.es",
  user: "qalz943",
  password: "Z0106199z.",
  database: "qalz943",
  multipleStatements: false,
});

const CLEAN = process.argv.includes("--clean");

// IDs de test: 200+ para no colisionar con los existentes (max actual = 10)
const TEST_IDS = [200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211];

async function clean(conn) {
  console.log("\n🧹 Limpiando datos de test...");
  const [result] = await conn.query(
    `DELETE FROM pintura_stock_movimientos WHERE id IN (${TEST_IDS.join(",")})`,
  );
  console.log(`  Eliminados ${result.affectedRows} movimientos de test`);
}

async function seed(conn) {
  console.log("\n🌱 Insertando datos de test para 2026-03...\n");

  // ─────────────────────────────────────────────────────────────────────────
  // ALERTA 1: RAL "1021" (p14) — consumo >= 20 kg Y total_kg_comprados = 0
  //  La única compra de p14 tiene formato_kg=NULL → total_kg_comprados=0 ✓
  //  Añadimos 25 kg de SALIDAs (5 filas × 5 kg) en 2026-03
  //  DOS sin coste → también suman a salidasSinCoste
  // ─────────────────────────────────────────────────────────────────────────
  console.log(
    "→ Insertando Alert 1: RAL 1021 (consumo alto, sin compras en kg)...",
  );
  await conn.query(`
    INSERT INTO pintura_stock_movimientos
      (id, pintura_id, ral_snapshot, tipo, cantidad_kg, stock_anterior_kg, stock_nuevo_kg,
       coste_unitario_eur_kg, coste_total_eur, origen, observaciones, created_at)
    VALUES
      (200, 'p14', '1021', 'SALIDA', 5.000, 25.66, 20.66,  9.60, 48.00, 'PEDIDO', 'TEST seed', '2026-03-02 08:00:00'),
      (201, 'p14', '1021', 'SALIDA', 5.000, 20.66, 15.66,  9.60, 48.00, 'PEDIDO', 'TEST seed', '2026-03-04 08:00:00'),
      (202, 'p14', '1021', 'SALIDA', 5.000, 15.66, 10.66,  0.00,  0.00, 'PEDIDO', 'TEST seed sin-coste', '2026-03-06 08:00:00'),
      (203, 'p14', '1021', 'SALIDA', 5.000, 10.66,  5.66,  9.60, 48.00, 'PEDIDO', 'TEST seed', '2026-03-10 08:00:00'),
      (204, 'p14', '1021', 'SALIDA', 5.000,  5.66,  0.66,  0.00,  0.00, 'PEDIDO', 'TEST seed sin-coste', '2026-03-12 08:00:00')
  `);
  console.log("   ✓ 5 SALIDAs de 1021 (25 kg totales, 2 sin coste)");

  // ─────────────────────────────────────────────────────────────────────────
  // ALERTA 2: RAL "7016" (p01) — subida de coste unitario >12% semana a semana
  //  Semana 11 (2026-03-09 → ISO week 202611): 5 kg × 10 EUR/kg = 50 EUR
  //  Semana 12 (2026-03-16 → ISO week 202612): 5 kg × 15 EUR/kg = 75 EUR
  //  Delta: (15-10)/10 × 100 = 50% > 12% ✓
  // ─────────────────────────────────────────────────────────────────────────
  console.log("→ Insertando Alert 2: RAL 7016 (subida coste semana 11→12)...");
  await conn.query(`
    INSERT INTO pintura_stock_movimientos
      (id, pintura_id, ral_snapshot, tipo, cantidad_kg, stock_anterior_kg, stock_nuevo_kg,
       coste_unitario_eur_kg, coste_total_eur, origen, observaciones, created_at)
    VALUES
      (205, 'p01', '7016', 'SALIDA', 5.000, 49.10, 44.10, 10.00, 50.00, 'PEDIDO', 'TEST seed wk11', '2026-03-09 10:00:00'),
      (206, 'p01', '7016', 'SALIDA', 5.000, 44.10, 39.10, 15.00, 75.00, 'PEDIDO', 'TEST seed wk12', '2026-03-16 10:00:00')
  `);
  console.log(
    "   ✓ 2 SALIDAs de 7016 (semana 11 a 10 €/kg, semana 12 a 15 €/kg)",
  );

  // ─────────────────────────────────────────────────────────────────────────
  // ALERTA 3: RAL "7035" (p04) — stock<=10 Y consumo>=12 en el periodo
  //  p04.stock = 8.25 → cumple stock <= 10 ✓
  //  Añadimos 12 kg de SALIDAs (2 filas × 6 kg)
  // ─────────────────────────────────────────────────────────────────────────
  console.log("→ Insertando Alert 3: RAL 7035 (stock bajo + consumo alto)...");
  await conn.query(`
    INSERT INTO pintura_stock_movimientos
      (id, pintura_id, ral_snapshot, tipo, cantidad_kg, stock_anterior_kg, stock_nuevo_kg,
       coste_unitario_eur_kg, coste_total_eur, origen, observaciones, created_at)
    VALUES
      (207, 'p04', '7035', 'SALIDA', 6.000, 8.25, 2.25, 12.00, 72.00, 'PEDIDO', 'TEST seed', '2026-03-05 09:00:00'),
      (208, 'p04', '7035', 'SALIDA', 6.000, 2.25, -3.75, 12.00, 72.00, 'PEDIDO', 'TEST seed', '2026-03-11 09:00:00')
  `);
  console.log("   ✓ 2 SALIDAs de 7035 (12 kg totales, stock=8.25 ≤ 10)");

  // ─────────────────────────────────────────────────────────────────────────
  // DATA QUALITY: movimiento SIN ral_snapshot → suma a movimientosSinRal
  // ─────────────────────────────────────────────────────────────────────────
  console.log("→ Insertando movimiento sin RAL (data quality test)...");
  await conn.query(`
    INSERT INTO pintura_stock_movimientos
      (id, pintura_id, ral_snapshot, tipo, cantidad_kg, stock_anterior_kg, stock_nuevo_kg,
       coste_unitario_eur_kg, coste_total_eur, origen, observaciones, created_at)
    VALUES
      (209, '9999', '', 'SALIDA', 2.000, 100.00, 98.00, 0.00, 0.00, 'PEDIDO', 'TEST seed sin-ral', '2026-03-08 14:00:00')
  `);
  console.log("   ✓ 1 movimiento sin ral_snapshot");

  // ─────────────────────────────────────────────────────────────────────────
  // ENTRADA para el gráfico de líneas (dailySeries)
  // ─────────────────────────────────────────────────────────────────────────
  console.log("→ Insertando ENTRADAs para gráfica dailySeries...");
  await conn.query(`
    INSERT INTO pintura_stock_movimientos
      (id, pintura_id, ral_snapshot, tipo, cantidad_kg, stock_anterior_kg, stock_nuevo_kg,
       coste_unitario_eur_kg, coste_total_eur, origen, observaciones, created_at)
    VALUES
      (210, 'p01', '7016', 'ENTRADA', 25.000, 39.10, 64.10, 13.50, 337.50, 'COMPRA', 'TEST seed compra', '2026-03-12 14:00:00'),
      (211, 'p04', '7035', 'ENTRADA', 20.000, -3.75, 16.25, 12.00, 240.00, 'COMPRA', 'TEST seed compra', '2026-03-16 09:30:00')
  `);
  console.log("   ✓ 2 ENTRADAs (7016 el 12, 7035 el 16)");
}

async function verify(conn) {
  console.log("\n📊 Verificando datos insertados...\n");

  const [[{ total }]] = await conn.query(
    `SELECT COUNT(*) AS total FROM pintura_stock_movimientos WHERE id >= 200`,
  );
  console.log(`  Total movimientos test (id>=200): ${total}`);

  // Consumo por RAL en 2026-03
  const [consumos] = await conn.query(`
    SELECT ral_snapshot AS ral,
           SUM(CASE WHEN tipo='SALIDA' THEN cantidad_kg ELSE 0 END) AS consumo_kg,
           SUM(CASE WHEN tipo='ENTRADA' THEN cantidad_kg ELSE 0 END) AS entradas_kg
    FROM pintura_stock_movimientos
    WHERE DATE_FORMAT(created_at,'%Y-%m') = '2026-03'
    GROUP BY ral_snapshot ORDER BY consumo_kg DESC
  `);
  console.log("  Consumo/entradas por RAL en 2026-03:");
  consumos.forEach((r) =>
    console.log(
      `    ${r.ral || "(sin RAL)"} → consumo=${r.consumo_kg} kg, entradas=${r.entradas_kg} kg`,
    ),
  );

  // Data quality counts
  const [[{ sinCoste }]] = await conn.query(`
    SELECT COUNT(*) AS sinCoste FROM pintura_stock_movimientos
    WHERE DATE_FORMAT(created_at,'%Y-%m')='2026-03' AND tipo='SALIDA' AND COALESCE(coste_total_eur,0)<=0
  `);
  const [[{ sinRal }]] = await conn.query(`
    SELECT COUNT(*) AS sinRal FROM pintura_stock_movimientos
    WHERE DATE_FORMAT(created_at,'%Y-%m')='2026-03' AND COALESCE(ral_snapshot,'')=''
  `);
  const [[{ sinPrecio }]] = await conn.query(`
    SELECT COUNT(*) AS sinPrecio FROM pintura p
    WHERE p.stock > 0 AND NOT EXISTS (SELECT 1 FROM pintura_compras pc WHERE pc.pintura_id = p.id)
  `);

  console.log(`\n  DATA QUALITY (2026-03):`);
  console.log(`    salidasSinCoste  : ${sinCoste}`);
  console.log(`    movimientosSinRal: ${sinRal}`);
  console.log(`    pinturasSinPrecio: ${sinPrecio}`);
  console.log(`    attentionCount   : ${sinCoste + sinRal + sinPrecio}`);

  // Compras por RAL en 2026-03 (para verificar alert 1)
  const [compras2603] = await conn.query(`
    SELECT p.ral, SUM(COALESCE(pc.formato_kg,0)*COALESCE(pc.cantidad_cajas,0)) AS total_kg_comprados
    FROM pintura_compras pc JOIN pintura p ON p.id=pc.pintura_id
    WHERE DATE_FORMAT(pc.fecha_compra,'%Y-%m')='2026-03'
    GROUP BY p.ral ORDER BY p.ral
  `);
  console.log("\n  kg comprados por RAL en 2026-03:");
  compras2603.forEach((r) =>
    console.log(`    ${r.ral} → kg_comprados=${r.total_kg_comprados}`),
  );

  console.log("\n✅ Verificación completa.\n");
  console.log("ALERTAS ESPERADAS:");
  console.log(
    "  🔴 Alert 1 (consumo alto sin compra kg): RAL 1021 — consumo≈25.5 kg, kg_comprados=0",
  );
  console.log(
    "  🔶 Alert 2 (subida coste semana): RAL 7016 — semana 11→12: 10→15 EUR/kg (+50%)",
  );
  console.log(
    "  🟡 Alert 3 (stock bajo + consumo): RAL 7035 — 12 kg consumidos, stock=8.25",
  );
}

async function main() {
  const conn = await pool.getConnection();
  try {
    if (CLEAN) {
      await clean(conn);
    } else {
      // Limpiar primero los IDs de test por si se ejecuta dos veces
      await conn.query(
        `DELETE FROM pintura_stock_movimientos WHERE id >= 200 AND observaciones LIKE 'TEST seed%'`,
      );
      await seed(conn);
      await verify(conn);
    }
  } finally {
    conn.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
