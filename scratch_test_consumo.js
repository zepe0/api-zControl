import { calcularConsumoPintura } from './server/utils/calcularConsumo.js';

const tests = [
  {
    name: "UD sin medidas",
    params: { unidad_medida: "ud", largo: "", ancho: "", consumoManual: "" },
    expected: 0.12
  },
  {
    name: "UD con dimensiones (3000x1500)",
    params: { unidad_medida: "ud", largo: "3000", ancho: "1500", consumoManual: "" },
    expected: 0.6
  },
  {
    name: "M2 con dimensiones (1000x1000 = 1m2)",
    params: { unidad_medida: "m2", largo: 1000, ancho: 1000, consumoManual: "" },
    expected: +(0.133333333).toFixed(4)
  },
  {
    name: "ML (2000mm = 2m)",
    params: { unidad_medida: "ml", largo: "2000", ancho: "", consumoManual: "" },
    expected: 0.24 // 2m * 0.12
  },
  {
    name: "Consumo manual prevalece",
    params: { unidad_medida: "ud", largo: "3000", ancho: "1500", consumoManual: "1.5" },
    expected: 1.5
  }
];

console.log("--- TEST RESULTADOS ---");
tests.forEach(t => {
  const result = calcularConsumoPintura(t.params);
  const passed = result === t.expected;
  console.log(`${passed ? '✅' : '❌'} ${t.name}: Obtenido ${result}, Esperado ${t.expected}`);
});
