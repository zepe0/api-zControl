import conexion from "../server/conexion.js";

const PRODUCTO_SIN_ESPECIFICAR = {
  id: "9999",
  nombre: "Sin Especificar",
  precio: 0.0,
  uni: 1,
  unidad_medida: "Ud",
  consumo: 0.0,
};

export async function ensureProductoSinEspecificar() {
  const conn = await conexion.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT COUNT(*) as cnt FROM productos WHERE id = ?",
      [PRODUCTO_SIN_ESPECIFICAR.id],
    );
    if (rows[0].cnt === 0) {
      await conn.query(
        "INSERT INTO productos (id, nombre, precio, uni, unidad_medida, consumo) VALUES (?, ?, ?, ?, ?, ?)",
        [
          PRODUCTO_SIN_ESPECIFICAR.id,
          PRODUCTO_SIN_ESPECIFICAR.nombre,
          PRODUCTO_SIN_ESPECIFICAR.precio,
          PRODUCTO_SIN_ESPECIFICAR.uni,
          PRODUCTO_SIN_ESPECIFICAR.unidad_medida,
          PRODUCTO_SIN_ESPECIFICAR.consumo,
        ],
      );
      console.log("Producto especial 'Sin Especificar' creado");
    }
  } finally {
    conn.release();
  }
}
