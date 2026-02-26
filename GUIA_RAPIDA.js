#!/usr/bin/env node

/**
 * GUÍA RÁPIDA: Endpoint /api/pedidos/upload
 *
 * Este archivo contiene instrucciones paso a paso para usar
 * el nuevo endpoint de procesamiento de pedidos
 */

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║        🎯 GUÍA RÁPIDA: Endpoint /api/pedidos/upload          ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

📋 PASO 1: INSTALAR DEPENDENCIAS
═══════════════════════════════════════════════════════════════

El sistema ya está instalado, pero si necesitas reinstalar:

    npm install pdf-parse multer tesseract.js pdfjs-dist

✓ Dependencias instaladas:
  • multer - Manejo de uploads
  • pdf-parse - Lectura de PDFs
  • tesseract.js - OCR para imágenes
  • pdfjs-dist - Dependencia de pdf-parse


🚀 PASO 2: INICIAR EL SERVIDOR
═══════════════════════════════════════════════════════════════

    npm start

El servidor estará disponible en: http://localhost:3001


🧪 PASO 3: PROBAR EL ENDPOINT
═══════════════════════════════════════════════════════════════

Opción A - Cliente Web (Recomendado):
  
  1. Abre en navegador: http://localhost:3001/test-upload.html
  2. Arrastra un archivo PDF o imagen
  3. Haz clic en "Procesar Documento"
  4. ¡Listo! Verás los datos extraídos


Opción B - Con cURL:

  curl -X POST http://localhost:3001/api/pedidos/upload \\
    -F "file=@EJEMPLO_DOCUMENTO_PEDIDO.txt"


Opción C - Con JavaScript:

  const formData = new FormData();
  formData.append('file', fileInput.files[0]);
  
  const response = await fetch('/api/pedidos/upload', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  console.log(result);


📊 PASO 4: ENTENDER LA RESPUESTA
═══════════════════════════════════════════════════════════════

Respuesta exitosa (200):

{
  "message": "Albarán creado correctamente desde documento",
  "data": {
    "numAlbaran": "ALB-001",
    "cliente": "Empresa XYZ S.L.",
    "Nif": "12345678A",
    "tel": "+34912345678",
    "dir": "Calle Principal 123, Madrid 28001",
    "materiales": [
      {
        "ref": "REF-001",
        "mat": "Pintura Blanca Premium",
        "unid": 50,
        "unit": "kg"
      }
    ],
    "extractedText": "... primeros 1000 caracteres ..."
  }
}


✅ PASO 5: VERIFICAR QUE TODO FUNCIONA
═══════════════════════════════════════════════════════════════

Checklist de verificación:

☐ npm start ejecutándose
☐ Base de datos conectada
☐ Tablas de BD existen:
  • Albaranes
  • cliente
  • productos
  • AlbaranMateriales
☐ Archivo de prueba: EJEMPLO_DOCUMENTO_PEDIDO.txt
☐ Puerto 3001 disponible


🔍 ARCHIVOS IMPORTANTES
═══════════════════════════════════════════════════════════════

📁 Código del Endpoint:
   server/query/Pedidos/uploadPedidos.js (307 líneas)
   └─ Lógica completa de procesamiento

📖 Documentación:
   ENDPOINT_PEDIDOS_UPLOAD.md
   └─ Especificación técnica detallada

   IMPLEMENTACION_PEDIDOS_UPLOAD.md
   └─ Guía de implementación

   RESUMEN_IMPLEMENTACION.md
   └─ Resumen de todo lo implementado

🌐 Cliente Web:
   test-upload.html
   └─ Interfaz visual para pruebas

📋 Ejemplo:
   EJEMPLO_DOCUMENTO_PEDIDO.txt
   └─ Documento de prueba


⚙️ CONFIGURACIÓN REQUERIDA
═══════════════════════════════════════════════════════════════

En tu archivo .env:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=zControl
PORT=3001


🎯 FLUJO DE PROCESAMIENTO
═══════════════════════════════════════════════════════════════

1. Usuario sube archivo (PDF o imagen)
   ↓
2. Sistema valida el archivo
   ↓
3. Extrae texto:
   - PDF: pdf-parse
   - Imagen: Tesseract.js (OCR en español)
   ↓
4. Busca patrones regex para:
   - Número de albarán
   - Cliente (nombre, NIF, teléfono, dirección)
   - Materiales (referencia, descripción, cantidad)
   ↓
5. Guarda en base de datos (transacción segura)
   ↓
6. Emite notificación Socket.IO
   ↓
7. Devuelve respuesta JSON con datos extraídos


📞 SOPORTE Y RECURSOS
═══════════════════════════════════════════════════════════════

• Documentación técnica: ENDPOINT_PEDIDOS_UPLOAD.md
• Guía de implementación: IMPLEMENTACION_PEDIDOS_UPLOAD.md
• Cliente web: test-upload.html
• Tesseract.js: https://tesseract.js.org/
• pdf-parse: https://github.com/modesty/pdf-parse
• Multer: https://github.com/expressjs/multer


🚀 ¡LISTO PARA USAR!
═══════════════════════════════════════════════════════════════

El endpoint está completamente funcional y documentado.

Próximos pasos:
1. Inicia: npm start
2. Prueba: http://localhost:3001/test-upload.html
3. Integra en tu frontend
4. ¡Disfruta! 🎉


═══════════════════════════════════════════════════════════════
Fecha: 26 de febrero de 2026
Versión: 1.0.0
Estado: ✅ Producción
═══════════════════════════════════════════════════════════════
`);
