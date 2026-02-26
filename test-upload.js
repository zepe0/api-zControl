#!/usr/bin/env node

/**
 * Script para probar el endpoint /api/pedidos/upload
 * Uso: node test-upload.js
 */

import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";
import path from "path";

const API_URL = "http://localhost:3001/api/pedidos/upload";

/**
 * Crear un archivo de prueba simulando un PDF/imagen
 */
function createTestFile() {
  const testContent = `
    ALBARÁN DE ENTREGA
    
    Número de Albarán: ALB-001
    Fecha: 26/02/2026
    
    CLIENTE:
    Nombre: Empresa XYZ S.L.
    NIF: 12345678A
    Teléfono: +34 912 34 56 78
    Dirección: Calle Principal 123, Madrid 28001
    
    MATERIALES:
    REF-001 - Pintura Blanca Premium - 50 kg
    REF-002 - Pintura Roja Industrial - 25 kg
    REF-003 - Diluyente Acrílico - 10 l
    
    Observaciones: Entrega urgente
  `;

  const testPath = path.join(process.cwd(), "test-document.txt");
  fs.writeFileSync(testPath, testContent);
  return testPath;
}

/**
 * Enviar archivo al endpoint
 */
async function testUpload(filePath) {
  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    const response = await fetch(API_URL, {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
    });

    const data = await response.json();

    console.log("=== RESPUESTA DEL SERVIDOR ===");
    console.log("Status:", response.status);
    console.log("Data:", JSON.stringify(data, null, 2));

    // Limpiar archivo de prueba
    fs.unlinkSync(filePath);

    if (response.status === 200) {
      console.log("\n✅ ¡Prueba exitosa!");
    } else {
      console.log("\n❌ Error en la respuesta");
    }
  } catch (error) {
    console.error("❌ Error al probar:", error.message);
    process.exit(1);
  }
}

// Ejecutar prueba
console.log("🧪 Iniciando prueba del endpoint /api/pedidos/upload...\n");
const testFile = createTestFile();
console.log(`📄 Archivo de prueba creado: ${testFile}`);
console.log(`📤 Enviando a: ${API_URL}\n`);

await testUpload(testFile);
