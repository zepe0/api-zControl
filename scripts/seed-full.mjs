/**
 * SEED COMPLETO — Datos de test para Enero, Febrero y Marzo 2026
 *
 * Genera:
 *  - pintura_compras  IDs 200-222 (3 meses × ~6 compras)
 *  - pintura_stock_movimientos IDs 300-374 (ENTRADAs + SALIDAs bien distribuidas)
 *
 * Cubre:
 *  - Gráfica dailySeries con picos y valles realistas
 *  - weeklyCostRise: 7016 sube >12% semana 5→6 en Febrero, IMP sube semana 7→8
 *  - highConsumptionNoPurchase: IMP Jan (sin compra en vista de ese mes... nah, mejor usar otro)
 *  - lowStockHighConsumption: 7035 stockbajo + consumo alto
 *  - Data quality: algunas salidas sin coste para movimientos de NOIR/comodines
 *
 * Limpieza:  node scripts/seed-full.mjs --clean
 */

import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "qalz943.zepedev.es",
  user: "qalz943",
  password: "Z0106199z.",
  database: "qalz943",
});

const CLEAN = process.argv.includes("--clean");

// ─── Función auxiliar: rastreo de stock simulado ───────────────────────────
const simStock = {
  p01: 200.0,
  p02: 200.0,
  p03: 100.0,
  IMP: 200.0,
  p05: 100.0,
  p11: 100.0,
  p04: 100.0,
  p14: 100.0,
};

function mov(
  id,
  pintura_id,
  ral_snapshot,
  tipo,
  cantidad_kg,
  coste_kg,
  origen,
  obs,
  created_at,
) {
  const ant = Number((simStock[pintura_id] || 100).toFixed(3));
  const nw = tipo === "ENTRADA" ? ant + cantidad_kg : ant - cantidad_kg;
  simStock[pintura_id] = Number(nw.toFixed(3));
  return [
    id,
    pintura_id,
    null,
    null,
    ral_snapshot,
    tipo,
    cantidad_kg,
    ant,
    nw,
    coste_kg,
    Number((coste_kg * cantidad_kg).toFixed(4)),
    origen,
    obs,
    null,
    new Date(created_at),
  ];
}

// ─── COMPRAS ───────────────────────────────────────────────────────────────
// Columnas: id, pintura_id, fecha_compra, formato_kg, cantidad_cajas, precio_total, precio_total_caja, precio_kg_calculado, proveedor
const compras = [
  // ── ENERO 2026 ──
  [200, "p01", "2026-01-05 08:00:00", 25, 2, null, 250.0, 10.0, "AkzoNobel"],
  [201, "p02", "2026-01-08 09:00:00", 20, 2, null, 180.0, 9.0, "Axalta"],
  [202, "IMP", "2026-01-10 10:00:00", 25, 2, null, 125.0, 5.0, "Titan"],
  [203, "p03", "2026-01-15 08:00:00", 25, 1, null, 350.0, 14.0, "Tiger"],
  [204, "p05", "2026-01-18 09:00:00", 25, 1, null, 275.0, 11.0, "Jotun"],
  [205, "p11", "2026-01-20 08:00:00", 25, 2, null, 175.0, 7.0, "AkzoNobel"],

  // ── FEBRERO 2026 ──
  [210, "p01", "2026-02-03 08:00:00", 25, 2, null, 275.0, 11.0, "AkzoNobel"], // +10%
  [211, "IMP", "2026-02-08 10:00:00", 25, 2, null, 130.0, 5.2, "Titan"], // +4%
  [212, "p02", "2026-02-10 09:00:00", 20, 2, null, 190.0, 9.5, "Axalta"], // +5.6%
  [213, "p04", "2026-02-15 09:00:00", 20, 2, null, 230.0, 11.5, "AkzoNobel"],
  [214, "p11", "2026-02-18 08:00:00", 25, 2, null, 180.0, 7.2, "AkzoNobel"], // +2.9%
  [215, "p14", "2026-02-20 08:00:00", 25, 2, null, 240.0, 9.6, "Axalta"],

  // ── MARZO 2026 (complementan las existentes) ──
  [220, "IMP", "2026-03-02 08:00:00", 25, 2, null, 132.0, 5.28, "Titan"], // +1.5%
  [221, "p05", "2026-03-08 09:00:00", 25, 1, null, 286.0, 11.44, "Jotun"],
  [222, "p11", "2026-03-10 08:00:00", 25, 2, null, 185.0, 7.4, "AkzoNobel"],
];

// ─── MOVIMIENTOS ───────────────────────────────────────────────────────────
// Columnas: id, pintura_id, pedido_id, pedido_linea_id, ral_snapshot, tipo,
//           cantidad_kg, stock_anterior_kg, stock_nuevo_kg,
//           coste_unitario_eur_kg, coste_total_eur,
//           origen, observaciones, usuario, created_at

const movimientos = [
  // ═══════════════════════════════════════════════
  // ENERO 2026 — ENTRADAs y SALIDAs (IDs 300-327)
  // ═══════════════════════════════════════════════

  // ENTRADAs enero
  mov(
    300,
    "p01",
    "7016",
    "ENTRADA",
    50,
    10.0,
    "COMPRA",
    "Seed ene",
    "2026-01-05 08:00:00",
  ),
  mov(
    301,
    "p02",
    "9010",
    "ENTRADA",
    40,
    9.0,
    "COMPRA",
    "Seed ene",
    "2026-01-08 09:00:00",
  ),
  mov(
    302,
    "IMP",
    "Imprimacion",
    "ENTRADA",
    50,
    5.0,
    "COMPRA",
    "Seed ene",
    "2026-01-10 10:00:00",
  ),
  mov(
    303,
    "p03",
    "9005",
    "ENTRADA",
    25,
    14.0,
    "COMPRA",
    "Seed ene",
    "2026-01-15 08:00:00",
  ),
  mov(
    304,
    "p05",
    "6005",
    "ENTRADA",
    25,
    11.0,
    "COMPRA",
    "Seed ene",
    "2026-01-18 09:00:00",
  ),
  mov(
    305,
    "p11",
    "9006",
    "ENTRADA",
    50,
    7.0,
    "COMPRA",
    "Seed ene",
    "2026-01-20 08:00:00",
  ),

  // SALIDAs enero — distribuidas por semanas
  // Semana 1 (Jan 5-11)
  mov(
    306,
    "p01",
    "7016",
    "SALIDA",
    8,
    10.0,
    "PEDIDO",
    "Seed ene",
    "2026-01-07 09:00:00",
  ),
  mov(
    307,
    "p02",
    "9010",
    "SALIDA",
    6,
    9.0,
    "PEDIDO",
    "Seed ene",
    "2026-01-07 09:10:00",
  ),
  mov(
    308,
    "IMP",
    "Imprimacion",
    "SALIDA",
    5,
    5.0,
    "PEDIDO",
    "Seed ene",
    "2026-01-09 10:00:00",
  ),

  // Semana 2 (Jan 12-18)
  mov(
    309,
    "p01",
    "7016",
    "SALIDA",
    6,
    10.0,
    "PEDIDO",
    "Seed ene",
    "2026-01-12 09:00:00",
  ),
  mov(
    310,
    "p03",
    "9005",
    "SALIDA",
    4,
    14.0,
    "PEDIDO",
    "Seed ene",
    "2026-01-12 09:10:00",
  ),
  mov(
    311,
    "p02",
    "9010",
    "SALIDA",
    8,
    9.0,
    "PEDIDO",
    "Seed ene",
    "2026-01-14 10:00:00",
  ),
  mov(
    312,
    "IMP",
    "Imprimacion",
    "SALIDA",
    6,
    5.0,
    "PEDIDO",
    "Seed ene",
    "2026-01-14 10:10:00",
  ),
  mov(
    313,
    "p01",
    "7016",
    "SALIDA",
    10,
    10.0,
    "PEDIDO",
    "Seed ene",
    "2026-01-16 09:00:00",
  ),

  // Semana 3 (Jan 19-25)
  mov(
    314,
    "p05",
    "6005",
    "SALIDA",
    5,
    11.0,
    "PEDIDO",
    "Seed ene",
    "2026-01-21 09:00:00",
  ),
  mov(
    315,
    "p11",
    "9006",
    "SALIDA",
    6,
    7.0,
    "PEDIDO",
    "Seed ene",
    "2026-01-21 09:10:00",
  ),
  mov(
    316,
    "p01",
    "7016",
    "SALIDA",
    8,
    10.0,
    "PEDIDO",
    "Seed ene",
    "2026-01-21 09:20:00",
  ),
  mov(
    317,
    "p02",
    "9010",
    "SALIDA",
    8,
    9.0,
    "PEDIDO",
    "Seed ene",
    "2026-01-21 10:00:00",
  ),
  mov(
    318,
    "IMP",
    "Imprimacion",
    "SALIDA",
    5,
    5.0,
    "PEDIDO",
    "Seed ene",
    "2026-01-21 10:10:00",
  ),
  mov(
    319,
    "p03",
    "9005",
    "SALIDA",
    7,
    14.0,
    "PEDIDO",
    "Seed ene",
    "2026-01-23 09:00:00",
  ),
  mov(
    320,
    "p05",
    "6005",
    "SALIDA",
    3,
    11.0,
    "PEDIDO",
    "Seed ene",
    "2026-01-23 09:10:00",
  ),

  // Semana 4 (Jan 26-31)
  mov(
    321,
    "p01",
    "7016",
    "SALIDA",
    5,
    10.0,
    "PEDIDO",
    "Seed ene",
    "2026-01-26 09:00:00",
  ),
  mov(
    322,
    "p11",
    "9006",
    "SALIDA",
    6,
    7.0,
    "PEDIDO",
    "Seed ene",
    "2026-01-26 09:10:00",
  ),
  mov(
    323,
    "p02",
    "9010",
    "SALIDA",
    6,
    9.0,
    "PEDIDO",
    "Seed ene",
    "2026-01-28 10:00:00",
  ),
  mov(
    324,
    "IMP",
    "Imprimacion",
    "SALIDA",
    4,
    5.0,
    "PEDIDO",
    "Seed ene",
    "2026-01-28 10:10:00",
  ),
  mov(
    325,
    "p01",
    "7016",
    "SALIDA",
    8,
    10.0,
    "PEDIDO",
    "Seed ene",
    "2026-01-30 09:00:00",
  ),
  mov(
    326,
    "p05",
    "6005",
    "SALIDA",
    3,
    11.0,
    "PEDIDO",
    "Seed ene",
    "2026-01-30 09:10:00",
  ),
  mov(
    327,
    "p11",
    "9006",
    "SALIDA",
    4,
    7.0,
    "PEDIDO",
    "Seed ene",
    "2026-01-30 09:20:00",
  ),

  // ═══════════════════════════════════════════════
  // FEBRERO 2026 — ENTRADAs y SALIDAs (IDs 330-357)
  // Nota: 7016 sube wk5(10.50€/kg)→wk6(12.00€/kg) = +14.3% > 12% → dispara alerta
  //       IMP sube  wk7(5.20€/kg) →wk8(6.00€/kg)  = +15.4% > 12% → dispara alerta
  // ═══════════════════════════════════════════════

  // ENTRADAs febrero
  mov(
    330,
    "p01",
    "7016",
    "ENTRADA",
    50,
    11.0,
    "COMPRA",
    "Seed feb",
    "2026-02-03 08:00:00",
  ),
  mov(
    331,
    "IMP",
    "Imprimacion",
    "ENTRADA",
    50,
    5.2,
    "COMPRA",
    "Seed feb",
    "2026-02-08 10:00:00",
  ),
  mov(
    332,
    "p02",
    "9010",
    "ENTRADA",
    40,
    9.5,
    "COMPRA",
    "Seed feb",
    "2026-02-10 09:00:00",
  ),
  mov(
    333,
    "p04",
    "7035",
    "ENTRADA",
    40,
    11.5,
    "COMPRA",
    "Seed feb",
    "2026-02-15 09:00:00",
  ),
  mov(
    334,
    "p11",
    "9006",
    "ENTRADA",
    50,
    7.2,
    "COMPRA",
    "Seed feb",
    "2026-02-18 08:00:00",
  ),
  mov(
    335,
    "p14",
    "1021",
    "ENTRADA",
    50,
    9.6,
    "COMPRA",
    "Seed feb",
    "2026-02-20 08:00:00",
  ),

  // Semana 5 (Feb 2-8) — 7016 a 10.50€/kg (precio legado antes de nueva compra)
  mov(
    336,
    "p01",
    "7016",
    "SALIDA",
    5,
    10.5,
    "PEDIDO",
    "Seed feb",
    "2026-02-04 09:00:00",
  ),
  mov(
    337,
    "p02",
    "9010",
    "SALIDA",
    8,
    9.0,
    "PEDIDO",
    "Seed feb",
    "2026-02-04 09:10:00",
  ),
  mov(
    338,
    "IMP",
    "Imprimacion",
    "SALIDA",
    5,
    5.0,
    "PEDIDO",
    "Seed feb",
    "2026-02-06 10:00:00",
  ),
  mov(
    339,
    "p01",
    "7016",
    "SALIDA",
    5,
    10.5,
    "PEDIDO",
    "Seed feb",
    "2026-02-07 09:00:00",
  ),

  // Semana 6 (Feb 9-15) — 7016 sube a 12.00€/kg (nueva compra llegó Feb 3)
  mov(
    340,
    "p01",
    "7016",
    "SALIDA",
    6,
    12.0,
    "PEDIDO",
    "Seed feb",
    "2026-02-10 09:00:00",
  ),
  mov(
    341,
    "p11",
    "9006",
    "SALIDA",
    8,
    7.0,
    "PEDIDO",
    "Seed feb",
    "2026-02-10 09:10:00",
  ),
  mov(
    342,
    "IMP",
    "Imprimacion",
    "SALIDA",
    8,
    5.2,
    "PEDIDO",
    "Seed feb",
    "2026-02-12 10:00:00",
  ),
  mov(
    343,
    "p02",
    "9010",
    "SALIDA",
    8,
    9.5,
    "PEDIDO",
    "Seed feb",
    "2026-02-12 10:10:00",
  ),
  mov(
    344,
    "p01",
    "7016",
    "SALIDA",
    6,
    12.0,
    "PEDIDO",
    "Seed feb",
    "2026-02-13 09:00:00",
  ),

  // Semana 7 (Feb 16-22) — IMP a 5.20€/kg
  mov(
    345,
    "p01",
    "7016",
    "SALIDA",
    8,
    11.0,
    "PEDIDO",
    "Seed feb",
    "2026-02-16 09:00:00",
  ),
  mov(
    346,
    "p04",
    "7035",
    "SALIDA",
    5,
    11.5,
    "PEDIDO",
    "Seed feb",
    "2026-02-17 09:00:00",
  ),
  mov(
    347,
    "IMP",
    "Imprimacion",
    "SALIDA",
    5,
    5.2,
    "PEDIDO",
    "Seed feb",
    "2026-02-18 10:00:00",
  ),
  mov(
    348,
    "p11",
    "9006",
    "SALIDA",
    8,
    7.2,
    "PEDIDO",
    "Seed feb",
    "2026-02-19 09:10:00",
  ),

  // Semana 8 (Feb 23-28) — IMP SUBE a 6.00€/kg (+15.4% vs sem 7) → dispara alerta
  mov(
    349,
    "p01",
    "7016",
    "SALIDA",
    8,
    11.0,
    "PEDIDO",
    "Seed feb",
    "2026-02-23 09:00:00",
  ),
  mov(
    350,
    "p11",
    "9006",
    "SALIDA",
    8,
    7.2,
    "PEDIDO",
    "Seed feb",
    "2026-02-23 09:10:00",
  ),
  mov(
    351,
    "p14",
    "1021",
    "SALIDA",
    8,
    9.6,
    "PEDIDO",
    "Seed feb",
    "2026-02-24 09:00:00",
  ),
  mov(
    352,
    "p02",
    "9010",
    "SALIDA",
    8,
    9.5,
    "PEDIDO",
    "Seed feb",
    "2026-02-24 09:10:00",
  ),
  mov(
    353,
    "IMP",
    "Imprimacion",
    "SALIDA",
    8,
    6.0,
    "PEDIDO",
    "Seed feb",
    "2026-02-26 10:00:00",
  ), // ← subida IMP
  mov(
    354,
    "p04",
    "7035",
    "SALIDA",
    5,
    11.5,
    "PEDIDO",
    "Seed feb",
    "2026-02-26 10:10:00",
  ),
  mov(
    355,
    "p01",
    "7016",
    "SALIDA",
    8,
    11.0,
    "PEDIDO",
    "Seed feb",
    "2026-02-27 09:00:00",
  ),
  mov(
    356,
    "p11",
    "9006",
    "SALIDA",
    7,
    7.2,
    "PEDIDO",
    "Seed feb",
    "2026-02-27 09:10:00",
  ),
  mov(
    357,
    "p14",
    "1021",
    "SALIDA",
    8,
    9.6,
    "PEDIDO",
    "Seed feb",
    "2026-02-28 09:00:00",
  ),

  // ═══════════════════════════════════════════════
  // MARZO 2026 — Complemento (IDs 360-374)
  // Los IDs 200-211 del seed anterior ya cubren 1021, 7016, 7035 etc.
  // Aquí añadimos IMP, 6005, 9006, 9010 para completar la gráfica diaria
  // ═══════════════════════════════════════════════

  // ENTRADAs marzo
  mov(
    360,
    "IMP",
    "Imprimacion",
    "ENTRADA",
    50,
    5.28,
    "COMPRA",
    "Seed mar",
    "2026-03-02 08:00:00",
  ),
  mov(
    361,
    "p05",
    "6005",
    "ENTRADA",
    25,
    11.44,
    "COMPRA",
    "Seed mar",
    "2026-03-08 09:00:00",
  ),
  mov(
    362,
    "p11",
    "9006",
    "ENTRADA",
    50,
    7.4,
    "COMPRA",
    "Seed mar",
    "2026-03-10 08:00:00",
  ),

  // SALIDAs marzo
  mov(
    363,
    "p02",
    "9010",
    "SALIDA",
    8,
    9.5,
    "PEDIDO",
    "Seed mar",
    "2026-03-02 09:00:00",
  ),
  mov(
    364,
    "p01",
    "7016",
    "SALIDA",
    6,
    11.95,
    "PEDIDO",
    "Seed mar",
    "2026-03-03 09:00:00",
  ),
  mov(
    365,
    "IMP",
    "Imprimacion",
    "SALIDA",
    4,
    5.0,
    "PEDIDO",
    "Seed mar",
    "2026-03-04 10:00:00",
  ),
  mov(
    366,
    "p02",
    "9010",
    "SALIDA",
    6,
    9.5,
    "PEDIDO",
    "Seed mar",
    "2026-03-05 09:00:00",
  ),
  mov(
    367,
    "p01",
    "7016",
    "SALIDA",
    5,
    11.95,
    "PEDIDO",
    "Seed mar",
    "2026-03-06 09:00:00",
  ),
  mov(
    368,
    "IMP",
    "Imprimacion",
    "SALIDA",
    6,
    5.28,
    "PEDIDO",
    "Seed mar",
    "2026-03-09 10:00:00",
  ),
  mov(
    369,
    "p05",
    "6005",
    "SALIDA",
    4,
    11.44,
    "PEDIDO",
    "Seed mar",
    "2026-03-11 09:00:00",
  ),
  mov(
    370,
    "p11",
    "9006",
    "SALIDA",
    8,
    7.4,
    "PEDIDO",
    "Seed mar",
    "2026-03-11 09:10:00",
  ),
  mov(
    371,
    "p01",
    "7016",
    "SALIDA",
    6,
    13.5,
    "PEDIDO",
    "Seed mar",
    "2026-03-13 09:00:00",
  ),
  mov(
    372,
    "IMP",
    "Imprimacion",
    "SALIDA",
    6,
    5.28,
    "PEDIDO",
    "Seed mar",
    "2026-03-14 10:00:00",
  ),
  mov(
    373,
    "p02",
    "9010",
    "SALIDA",
    5,
    10.0,
    "PEDIDO",
    "Seed mar",
    "2026-03-17 09:00:00",
  ),
  mov(
    374,
    "p11",
    "9006",
    "SALIDA",
    10,
    7.4,
    "PEDIDO",
    "Seed mar",
    "2026-03-17 09:10:00",
  ),
];

// ─── INSERT helpers ────────────────────────────────────────────────────────
async function insertCompras(conn) {
  console.log("\n📦 Insertando compras...");
  for (const row of compras) {
    await conn.query(
      `INSERT INTO pintura_compras
         (id, pintura_id, fecha_compra, formato_kg, cantidad_cajas, precio_total, precio_total_caja, precio_kg_calculado, proveedor)
       VALUES (?,?,?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         fecha_compra=VALUES(fecha_compra), formato_kg=VALUES(formato_kg),
         cantidad_cajas=VALUES(cantidad_cajas), precio_total_caja=VALUES(precio_total_caja),
         precio_kg_calculado=VALUES(precio_kg_calculado), proveedor=VALUES(proveedor)`,
      row,
    );
  }
  console.log(
    `   ✓ ${compras.length} compras (IDs ${compras[0][0]}–${compras.at(-1)[0]})`,
  );
}

async function insertMovimientos(conn) {
  console.log("\n🔄 Insertando movimientos...");
  const cols = [
    "id",
    "pintura_id",
    "pedido_id",
    "pedido_linea_id",
    "ral_snapshot",
    "tipo",
    "cantidad_kg",
    "stock_anterior_kg",
    "stock_nuevo_kg",
    "coste_unitario_eur_kg",
    "coste_total_eur",
    "origen",
    "observaciones",
    "usuario",
    "created_at",
  ];
  for (const row of movimientos) {
    await conn.query(
      `INSERT INTO pintura_stock_movimientos (${cols.join(",")}) VALUES (${cols.map(() => "?").join(",")})
       ON DUPLICATE KEY UPDATE
         ral_snapshot=VALUES(ral_snapshot), tipo=VALUES(tipo),
         cantidad_kg=VALUES(cantidad_kg), stock_anterior_kg=VALUES(stock_anterior_kg),
         stock_nuevo_kg=VALUES(stock_nuevo_kg), coste_unitario_eur_kg=VALUES(coste_unitario_eur_kg),
         coste_total_eur=VALUES(coste_total_eur), created_at=VALUES(created_at)`,
      row,
    );
  }
  console.log(
    `   ✓ ${movimientos.length} movimientos (IDs ${movimientos[0][0]}–${movimientos.at(-1)[0]})`,
  );
}

// ─── CLEAN ─────────────────────────────────────────────────────────────────
async function clean(conn) {
  console.log("\n🧹 Limpiando datos de test (id >= 200)...");
  const [r1] = await conn.query("DELETE FROM pintura_compras WHERE id >= 200");
  const [r2] = await conn.query(
    "DELETE FROM pintura_stock_movimientos WHERE id >= 200",
  );
  console.log(`   Compras eliminadas     : ${r1.affectedRows}`);
  console.log(`   Movimientos eliminados : ${r2.affectedRows}`);
}

// ─── VERIFY ────────────────────────────────────────────────────────────────
async function verify(conn) {
  console.log("\n📊 Resumen por mes:\n");

  for (const period of ["2026-01", "2026-02", "2026-03"]) {
    // Consumo por RAL
    const [consumo] = await conn.query(
      `
      SELECT ral_snapshot AS ral,
        SUM(CASE WHEN tipo='SALIDA' THEN cantidad_kg ELSE 0 END)  AS consumo_kg,
        SUM(CASE WHEN tipo='ENTRADA' THEN cantidad_kg ELSE 0 END) AS entrada_kg,
        SUM(CASE WHEN tipo='SALIDA' THEN COALESCE(coste_total_eur,0) ELSE 0 END) AS coste_eur
      FROM pintura_stock_movimientos
      WHERE DATE_FORMAT(created_at,'%Y-%m')=?
      GROUP BY ral_snapshot ORDER BY consumo_kg DESC
    `,
      [period],
    );

    // Compras del mes
    const [[comp]] = await conn.query(
      `
      SELECT COUNT(*) AS n_compras,
        SUM(COALESCE(formato_kg,0)*COALESCE(cantidad_cajas,0)) AS total_kg,
        SUM(COALESCE(precio_total_caja,0)*COALESCE(cantidad_cajas,0)) AS total_eur
      FROM pintura_compras
      WHERE DATE_FORMAT(fecha_compra,'%Y-%m')=?
    `,
      [period],
    );

    console.log(`  ── ${period} ──────────────────────`);
    console.log(
      `  Compras: ${comp.n_compras} pedidos | ${comp.total_kg} kg | ${Number(comp.total_eur || 0).toFixed(2)} €`,
    );
    console.log("  Consumo por RAL:");
    consumo.forEach((r) => {
      const coste = Number(r.coste_eur || 0).toFixed(2);
      console.log(
        `    ${String(r.ral || "(sin ral)").padEnd(16)} consumo=${String(r.consumo_kg).padStart(6)} kg | entradas=${String(r.entrada_kg).padStart(6)} kg | coste=${coste}€`,
      );
    });
    console.log("");
  }

  // weeklyCostRise esperado en Febrero
  console.log("  📈 Verificación weeklyCostRise en Febrero:");
  const [wkFeb] = await conn.query(`
    SELECT ral_snapshot AS ral,
      YEARWEEK(created_at,3) AS yw,
      DATE_FORMAT(MIN(created_at),'%Y-%m-%d') AS week_start,
      SUM(CASE WHEN tipo='SALIDA' THEN cantidad_kg ELSE 0 END) AS kg,
      SUM(CASE WHEN tipo='SALIDA' THEN COALESCE(coste_total_eur,0) ELSE 0 END) AS coste
    FROM pintura_stock_movimientos
    WHERE DATE_FORMAT(created_at,'%Y-%m')='2026-02'
      AND COALESCE(ral_snapshot,'') NOT IN ('','Sin Especificar','PENDIENTE','SIN COLOR')
    GROUP BY ral_snapshot, YEARWEEK(created_at,3)
    ORDER BY ral_snapshot, yw
  `);
  const wkByRal = {};
  for (const r of wkFeb) {
    if (!wkByRal[r.ral]) wkByRal[r.ral] = [];
    wkByRal[r.ral].push(r);
  }
  for (const [ral, weeks] of Object.entries(wkByRal)) {
    if (weeks.length < 2) continue;
    const w = weeks.filter((x) => x.kg > 0);
    if (w.length < 2) continue;
    const prev = w[w.length - 2],
      last = w[w.length - 1];
    const cu_prev = prev.coste / prev.kg,
      cu_last = last.coste / last.kg;
    if (cu_prev <= 0) continue;
    const delta = ((cu_last - cu_prev) / cu_prev) * 100;
    if (delta >= 12) {
      console.log(
        `    ✅ ${ral}: ${cu_prev.toFixed(2)}€/kg → ${cu_last.toFixed(2)}€/kg (+${delta.toFixed(1)}%) [semana ${prev.week_start}→${last.week_start}]`,
      );
    }
  }

  console.log(
    "\n✅ Seed completo. Reinicia la API para refrescar el analytics.\n",
  );
}

// ─── MAIN ──────────────────────────────────────────────────────────────────
async function main() {
  const conn = await pool.getConnection();
  try {
    if (CLEAN) {
      await clean(conn);
    } else {
      // Borrar test data previa antes de reinsertar (idempotente)
      await conn.query("DELETE FROM pintura_compras WHERE id >= 200");
      await conn.query("DELETE FROM pintura_stock_movimientos WHERE id >= 200");
      await insertCompras(conn);
      await insertMovimientos(conn);
      await verify(conn);
    }
  } finally {
    conn.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("❌", err.message);
  process.exit(1);
});
