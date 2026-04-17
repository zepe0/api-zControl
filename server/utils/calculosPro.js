/**
 * validarPrecioConTarifa
 * ─────────────────────────────────────────────────────────────────
 * Consulta la tabla tarifas_estandar y devuelve el precio oficial
 * para la unidad y combinación de RAL/imprimación indicada.
 *
 * Flujo:
 *  1. Ejecuta SELECT * FROM tarifas_estandar WHERE unidad = ? (o tipo/codigo/id).
 *  2. Si no encuentra la tarifa, devuelve 0.
 *  3. Si encuentra, aplica la lógica:
 *       - RAL y no IMP → precio_color
 *       - RAL e IMP → precio_color_mas_imp
 *       - Sin RAL y con IMP → precio_imprimacion
 *       - Si no aplica ninguna, usa precio_base o precio_unitario como fallback.
 *  4. Devuelve el precio oficial como número.
 *
 * @param {string} unidad
 * @param {boolean} tieneRal
 * @param {boolean} tieneImp
 * @returns {Promise<number>} Precio oficial de la tarifa.
 */
export async function validarPrecioConTarifa(
  unidad,
  tieneRal = false,
  tieneImp = false,
) {
  const unidadKey = String(unidad ?? "ud")
    .toLowerCase()
    .trim();
  const [rows] = await conexion.query(
    "SELECT * FROM tarifas_estandar WHERE unidad = ? OR tipo = ? OR codigo = ? OR id = ? LIMIT 1",
    [unidadKey, unidadKey, unidadKey, unidadKey],
  );
  const tarifa = rows[0] || {};

  const precioColor =
    Number.parseFloat(String(tarifa.precio_color ?? 0).replace(",", ".")) || 0;
  const precioColorMasImp =
    Number.parseFloat(
      String(tarifa.precio_color_mas_imp ?? 0).replace(",", "."),
    ) || 0;
  const precioImprimacion =
    Number.parseFloat(
      String(tarifa.precio_imprimacion ?? 0).replace(",", "."),
    ) || 0;
  const precioBase =
    Number.parseFloat(
      String(tarifa.precio_base ?? tarifa.precio_unitario ?? 0).replace(
        ",",
        ".",
      ),
    ) || 0;

  if (tieneRal && !tieneImp) {
    return precioColor;
  }
  if (tieneRal && tieneImp) {
    return precioColorMasImp;
  }
  if (!tieneRal && tieneImp) {
    return precioImprimacion;
  }
  return precioBase;
}
import conexion from "../conexion.js";

/**
 * calculosPro.js
 * Centraliza la lógica de negocio de cálculo de superficies,
 * consumo de pintura y precio de línea de pedido.
 */

let cacheTarifas = {};

/**
 * fetchTarifas
 * ─────────────────────────────────────────────────────────────────
 * Carga las tarifas estándar desde base de datos y las deja en memoria.
 *
 * Flujo:
 *  1. Consulta todas las filas de la tabla tarifas_estandar.
 *  2. Detecta la clave de unidad de cada fila usando unidad, tipo, codigo o id.
 *  3. Guarda cada tarifa normalizada dentro de cacheTarifas para acceso rápido.
 *  4. Devuelve la caché completa para reutilizarla desde otros módulos.
 *
 * @returns {Promise<object>} Tarifas cacheadas indexadas por unidad.
 */
export async function fetchTarifas() {
  const [rows] = await conexion.query("SELECT * FROM tarifas_estandar");

  cacheTarifas = rows.reduce((acc, row) => {
    const unidadRaw = row.unidad ?? row.tipo ?? row.codigo ?? row.id;
    const unidad = String(unidadRaw ?? "")
      .toLowerCase()
      .trim();

    if (!unidad) {
      return acc;
    }

    acc[unidad] = row;
    return acc;
  }, {});

  return cacheTarifas;
}

/**
 * getPrecioTarifa
 * ─────────────────────────────────────────────────────────────────
 * Devuelve el precio unitario correcto de la tarifa estándar según
 * unidad de medida y combinación de RAL / imprimación.
 *
 * Flujo:
 *  1. Busca la tarifa en cacheTarifas por la unidad indicada.
 *  2. Normaliza los precios a Number para evitar problemas con strings.
 *  3. Selecciona el precio aplicable:
 *       - RAL y no imprimación → precio_color
 *       - RAL e imprimación → precio_color_mas_imp
 *       - Sin RAL y con imprimación → precio_imprimacion
 *     En cualquier otro caso usa precio_base o precio_unitario como fallback.
 *  4. Devuelve el precio unitario resultante.
 *
 * @param {string} unidad
 * @param {boolean} tieneRal
 * @param {boolean} tieneImp
 * @returns {number} Precio unitario de la tarifa.
 */
export function getPrecioTarifa(unidad, tieneRal = false, tieneImp = false) {
  const tarifaUnidad =
    cacheTarifas[
      String(unidad ?? "ud")
        .toLowerCase()
        .trim()
    ] ?? {};

  const precioColor =
    Number.parseFloat(
      String(tarifaUnidad.precio_color ?? 0).replace(",", "."),
    ) || 0;
  const precioColorMasImp =
    Number.parseFloat(
      String(tarifaUnidad.precio_color_mas_imp ?? 0).replace(",", "."),
    ) || 0;
  const precioImprimacion =
    Number.parseFloat(
      String(tarifaUnidad.precio_imprimacion ?? 0).replace(",", "."),
    ) || 0;
  const precioBase =
    Number.parseFloat(
      String(
        tarifaUnidad.precio_base ?? tarifaUnidad.precio_unitario ?? 0,
      ).replace(",", "."),
    ) || 0;

  if (tieneRal && !tieneImp) {
    return precioColor;
  }

  if (tieneRal && tieneImp) {
    return precioColorMasImp;
  }

  if (!tieneRal && tieneImp) {
    return precioImprimacion;
  }

  return precioBase;
}

/**
 * calcularSuperficie
 * ─────────────────────────────────────────────────────────────────
 * Convierte las medidas de una línea (en mm) a m² totales.
 *
 * Flujo:
 *  1. Convierte largo y ancho a Number para evitar errores con strings.
 *  2. Divide entre 1.000.000 para pasar de mm² a m².
 *  3. Multiplica por la cantidad de unidades del pedido.
 *  4. Redondea a 4 decimales para evitar ruido de coma flotante.
 *
 * @param {number|string} largo    - Largo en milímetros.
 * @param {number|string} ancho    - Ancho en milímetros.
 * @param {number|string} cantidad - Número de unidades.
 * @returns {number} Superficie total en m².
 */
export function calcularSuperficie(largo, ancho, cantidad) {
  const l = Number.parseFloat(String(largo).replace(",", ".")) || 0;
  const a = Number.parseFloat(String(ancho).replace(",", ".")) || 0;
  const q = Number.parseFloat(String(cantidad).replace(",", ".")) || 1;

  const superficie = (l * a) / 1_000_000;
  return Number.parseFloat((superficie * q).toFixed(4));
}

/**
 * calcularConsumoPintura
 * ─────────────────────────────────────────────────────────────────
 * Calcula los kg de pintura necesarios para cubrir una superficie.
 *
 * Flujo:
 *  1. Aplica el ratio de consumo base (0.24 kg/m²) a la superficie.
 *  2. Si la pieza lleva imprimación, calcula también su consumo con
 *     el mismo ratio (se puede ajustar de forma independiente).
 *  3. Redondea a 4 decimales cada valor.
 *
 * @param {number} superficie        - Superficie en m² (resultado de calcularSuperficie).
 * @param {boolean} tieneImprimacion - Indica si la pieza lleva capa de imprimación.
 * @returns {{ principal: number, imprimacion: number }} Consumo en kg.
 */
export function calcularConsumoPintura(superficie, tieneImprimacion = false) {
  const RATIO_PINTURA = 0.24; // kg por m² de capa principal
  const RATIO_IMPRIMACION = 0.24; // kg por m² de imprimación (mismo ratio, ajustable)

  const s = Number.parseFloat(String(superficie).replace(",", ".")) || 0;

  const principal = Number.parseFloat((s * RATIO_PINTURA).toFixed(4));
  const imprimacion = tieneImprimacion
    ? Number.parseFloat((s * RATIO_IMPRIMACION).toFixed(4))
    : 0;

  return { principal, imprimacion };
}

/**
 * calcularPrecioLinea
 * ─────────────────────────────────────────────────────────────────
 * Calcula el precio total de una línea de pedido usando los precios
 * de la tarifa estándar según la unidad de medida.
 *
 * Flujo:
 *  1. Detecta la unidad de medida de la línea: "m2", "ml" o "ud".
 *  2. Obtiene la tarifa correspondiente a esa unidad. La función admite:
 *       - un objeto plano con campos precio_color, precio_imprimacion,
 *         precio_color_mas_imp
 *       - un objeto anidado por unidad, por ejemplo tarifa.m2 o tarifas.m2
 *  3. Calcula la cantidad facturable según la unidad:
 *       - "m2" → superficie total en m²
 *       - "ml" → largo total en metros
 *       - "ud" → número de unidades
 *  4. Selecciona el precio final según la combinación de acabados:
 *       - tieneRal = true y tieneImp = false → precio_color
 *       - tieneRal = true y tieneImp = true → precio_color_mas_imp
 *       - tieneRal = false y tieneImp = true → precio_imprimacion
 *     Si no se cumple ninguna de esas combinaciones, usa precio_base o,
 *     en su defecto, precio_unitario como fallback.
 *  5. Multiplica el precio final por la cantidad facturable y redondea a 2 decimales.
 *
 * @param {object} producto
 * @param {{ largo: number|string, ancho: number|string, cantidad: number|string }} medidas
 * @param {boolean} tieneRal - Indica si la línea lleva color/RAL.
 * @param {boolean} tieneImp - Indica si la línea lleva imprimación.
 * @returns {number} Precio total de la línea en €.
 */
export function calcularPrecioLinea(
  producto,
  medidas,
  tieneRal = false,
  tieneImp = false,
) {
  const unidad = (producto.unidad_medida ?? "ud").toLowerCase().trim();

  const largo =
    Number.parseFloat(String(medidas.largo ?? 0).replace(",", ".")) || 0;
  const ancho =
    Number.parseFloat(String(medidas.ancho ?? 0).replace(",", ".")) || 0;
  const cantidad =
    Number.parseFloat(String(medidas.cantidad ?? 1).replace(",", ".")) || 1;

  let cantidadSegunUnidad = cantidad;

  if (unidad === "m2") {
    cantidadSegunUnidad = calcularSuperficie(largo, ancho, cantidad);
  } else if (unidad === "ml") {
    cantidadSegunUnidad = Number.parseFloat(
      ((largo / 1000) * cantidad).toFixed(4),
    );
  }

  const precioFinal = getPrecioTarifa(unidad, tieneRal, tieneImp);

  return Number.parseFloat((precioFinal * cantidadSegunUnidad).toFixed(2));
}

fetchTarifas().catch((error) => {
  console.error("Error al cargar tarifas_estandar en cache:", error);
});
