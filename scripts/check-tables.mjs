import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "qalz943.zepedev.es",
  user: "qalz943",
  password: "Z0106199z.",
  database: "qalz943",
});

async function run() {
  const conn = await pool.getConnection();
  try {
    // Ver estructura de tablas clave
    const tables = [
      "pintura",
      "pintura_compras",
      "pintura_stock_movimientos",
      "pintura_stock_lotes_fifo",
    ];
    for (const t of tables) {
      const [rows] = await conn
        .query(`SELECT COUNT(*) as cnt FROM \`${t}\``)
        .catch(() => [[{ cnt: "NO EXISTE" }]]);
      console.log(`${t}: ${rows[0].cnt} registros`);
    }

    // Mostrar pinturas actuales
    console.log("\n=== PINTURAS ===");
    const [pinturas] = await conn.query(
      "SELECT id, ral, stock, marca FROM pintura ORDER BY ral LIMIT 30",
    );
    pinturas.forEach((p) =>
      console.log(`  ${p.id} | ${p.ral} | stock=${p.stock} | ${p.marca}`),
    );

    // Ver compras recientes
    console.log("\n=== COMPRAS RECIENTES ===");
    const [compras] = await conn.query(
      `SELECT id, pintura_id, fecha_compra, precio_kg_calculado, precio_total_caja FROM pintura_compras ORDER BY fecha_compra DESC LIMIT 15`,
    );
    compras.forEach((c) =>
      console.log(
        `  id=${c.id} | pintura=${c.pintura_id} | fecha=${c.fecha_compra} | precio_kg=${c.precio_kg_calculado}`,
      ),
    );

    // Ver movimientos
    console.log("\n=== MOVIMIENTOS (últimos 10) ===");
    const [movs] = await conn
      .query(
        `SELECT id, pintura_id, tipo, cantidad_kg, ral, fecha FROM pintura_stock_movimientos ORDER BY fecha DESC LIMIT 10`,
      )
      .catch(() => [[{ id: "N/A" }]]);
    movs.forEach((m) =>
      console.log(
        `  ${m.id} | tipo=${m.tipo} | pintura=${m.pintura_id} | kg=${m.cantidad_kg} | ral=${m.ral}`,
      ),
    );

    // Ver si existe la vista analítica
    console.log("\n=== VISTAS DISPONIBLES ===");
    const [views] = await conn.query(
      `SHOW FULL TABLES WHERE Table_type = 'VIEW'`,
    );
    views.forEach((v) => console.log(`  ${JSON.stringify(v)}`));
  } finally {
    conn.release();
    await pool.end();
  }
}

run().catch(console.error);
