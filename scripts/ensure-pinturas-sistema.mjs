import conexion from "../server/conexion.js";

const PINTURAS_SISTEMA = [
  {
    id: "PI-PEND",
    ral: "PENDIENTE",
    stock: 999.99,
    marca: "SISTEMA",
    rendimiento_kg_m2: 0.0,
  },
  {
    id: "PI-SIN-COLOR",
    ral: "SIN COLOR",
    stock: 999.99,
    marca: "SISTEMA",
    rendimiento_kg_m2: 0.0,
  },
  {
    id: "9999",
    ral: "Sin Especificar",
    stock: 999999.0,
    marca: "SISTEMA",
    rendimiento_kg_m2: 0.15,
  },
  {
    id: "IMP",
    ral: "Imprimacion",
    stock: 0.0,
    marca: "Titan",
    rendimiento_kg_m2: 0.15,
  },
];

export async function ensurePinturasSistema() {
  const conn = await conexion.getConnection();
  try {
    for (const pintura of PINTURAS_SISTEMA) {
      const [rows] = await conn.query(
        "SELECT COUNT(*) as cnt FROM pintura WHERE id = ?",
        [pintura.id],
      );
      if (rows[0].cnt === 0) {
        await conn.query(
          "INSERT INTO pintura (id, ral, stock, marca, rendimiento_kg_m2) VALUES (?, ?, ?, ?, ?)",
          [
            pintura.id,
            pintura.ral,
            pintura.stock,
            pintura.marca,
            pintura.rendimiento_kg_m2,
          ],
        );
        console.log(`Pintura especial creada: ${pintura.id}`);
      }
    }
  } finally {
    conn.release();
  }
}
