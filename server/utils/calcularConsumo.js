/**
 * Calcula el consumo de pintura en kg para una línea de pedido.
 *
 * Regla base:
 *   Panel de 3000×1500 mm (4.5 m²) consume 0.6 kg de pintura.
 *   Factor = 0.6 / 4.5 = 0.133333 kg/m²
 *
 * Según la unidad de medida:
 *   - "m2": consumo = (largo_mm * ancho_mm / 1_000_000) * FACTOR_M2
 *   - "ml": consumo = (largo_mm / 1_000) * FACTOR_ML
 *   - "ud": si tiene largo y ancho → se trata como m2
 *           si no tiene dimensiones → CONSUMO_DEFAULT (0.12 kg)
 *
 * @param {object} params
 * @param {string|null}  params.unidad_medida  - "m2", "ml", "ud", etc.
 * @param {number|null}  params.largo          - Largo en mm
 * @param {number|null}  params.ancho          - Ancho en mm
 * @param {number|null}  params.espesor        - Espesor (no afecta pintura, reservado)
 * @param {number|null}  params.consumoManual  - Consumo enviado por el frontend
 * @returns {number} Consumo en kg por CADA unidad/pieza (sin multiplicar por cantidad)
 */

const FACTOR_KG_POR_M2 = 0.6 / 4.5; // ≈ 0.133333
const FACTOR_KG_POR_ML = 0.12;       // kg por metro lineal
const CONSUMO_DEFAULT  = 0.12;       // kg por unidad sin dimensiones

export function calcularConsumoPintura({
  unidad_medida,
  largo,
  ancho,
  espesor,
  consumoManual,
}) {
  // Si el frontend ya envió un consumo manual > 0, lo respetamos
  const manualParsed = parseFloat(String(consumoManual ?? "").replace(",", "."));
  if (!Number.isNaN(manualParsed) && manualParsed > 0) {
    return manualParsed;
  }

  const largoMM  = parseFloat(String(largo ?? "").replace(",", ".")) || 0;
  const anchoMM  = parseFloat(String(ancho ?? "").replace(",", ".")) || 0;
  const unidad   = String(unidad_medida ?? "ud").trim().toLowerCase();

  switch (unidad) {
    case "m2": {
      // largo y ancho en mm → convertir a m²
      if (largoMM > 0 && anchoMM > 0) {
        const areaM2 = (largoMM * anchoMM) / 1_000_000;
        return +(areaM2 * FACTOR_KG_POR_M2).toFixed(4);
      }
      return CONSUMO_DEFAULT;
    }

    case "ml": {
      // largo en mm → convertir a metros lineales
      if (largoMM > 0) {
        const metrosLineales = largoMM / 1_000;
        return +(metrosLineales * FACTOR_KG_POR_ML).toFixed(4);
      }
      return CONSUMO_DEFAULT;
    }

    case "ud":
    default: {
      // Si tiene dimensiones, calcular como superficie
      if (largoMM > 0 && anchoMM > 0) {
        const areaM2 = (largoMM * anchoMM) / 1_000_000;
        return +(areaM2 * FACTOR_KG_POR_M2).toFixed(4);
      }
      return CONSUMO_DEFAULT;
    }
  }
}
