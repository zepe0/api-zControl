import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "qalz943.zepedev.es",
  user: "qalz943",
  password: "Z0106199z.",
  database: "qalz943",
});

async function main() {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      `
      INSERT INTO pintura (id, ral, stock, marca, refPintura, rendimiento_kg_m2)
      VALUES ('PI-SIN-COLOR', 'SIN COLOR', 999.99, 'SISTEMA', 'N/A', 0.000)
      ON DUPLICATE KEY UPDATE
        ral = VALUES(ral),
        stock = VALUES(stock),
        marca = VALUES(marca),
        refPintura = VALUES(refPintura),
        rendimiento_kg_m2 = VALUES(rendimiento_kg_m2)
      `,
    );

    const [rows] = await conn.query(
      `SELECT id, ral, stock, marca, refPintura, rendimiento_kg_m2 FROM pintura WHERE id IN ('PI-PEND', 'PI-SIN-COLOR') ORDER BY id`,
    );

    console.log("Registros sistema para color no asignado:");
    rows.forEach((r) => {
      console.log(
        `${r.id} | ${r.ral} | stock=${r.stock} | marca=${r.marca} | ref=${r.refPintura} | rend=${r.rendimiento_kg_m2}`,
      );
    });
  } finally {
    conn.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
