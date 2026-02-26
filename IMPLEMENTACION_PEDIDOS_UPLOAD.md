# Implementación: Endpoint `/api/pedidos/upload`

## 📋 Resumen

Se ha implementado un endpoint backend completo que permite:

- ✅ Procesar archivos PDF e imágenes (JPG, PNG, WEBP)
- ✅ Extraer información automáticamente (cliente, NIF, teléfono, dirección, materiales)
- ✅ Guardar los datos en la base de datos (albaranes, clientes, materiales)
- ✅ Notificar cambios en tiempo real mediante Socket.IO

## 🚀 Archivos Creados/Modificados

### Nuevos archivos:

1. **`server/query/Pedidos/uploadPedidos.js`** (307 líneas)
   - Lógica principal del endpoint
   - Procesamiento de PDF con `pdf-parse`
   - OCR de imágenes con `tesseract.js`
   - Extracción de datos mediante regex
   - Transacciones de base de datos

2. **`ENDPOINT_PEDIDOS_UPLOAD.md`** (Documentación completa)
   - Especificación del endpoint
   - Ejemplos de uso
   - Estructura de respuestas
   - Patrones regex utilizados

3. **`test-upload.html`** (Cliente web para pruebas)
   - Interfaz visual para subir archivos
   - Visualización de resultados
   - Soporte para drag & drop

### Modificados:

1. **`server/index.js`**
   - Importación del módulo `uploadPedidos`
   - Registro de la ruta `/api/pedidos`

## 📦 Dependencias Instaladas

```bash
npm install pdf-parse multer tesseract.js pdfjs-dist
```

| Dependencia    | Versión | Propósito                     |
| -------------- | ------- | ----------------------------- |
| `multer`       | ^5.x    | Manejo de uploads de archivos |
| `pdf-parse`    | latest  | Extracción de texto de PDFs   |
| `tesseract.js` | latest  | OCR para imágenes             |
| `pdfjs-dist`   | latest  | Dependencia de pdf-parse      |

## 🔌 Endpoint API

### URL

```
POST /api/pedidos/upload
```

### Body (multipart/form-data)

```
file: <PDF o imagen>
```

### Respuesta Exitosa (200)

```json
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
    "extractedText": "... texto extraído ..."
  }
}
```

### Respuesta con Error (400/500)

```json
{
  "error": "Descripción del error"
}
```

## 🧪 Pruebas

### Opción 1: Cliente Web

```bash
# Abre en navegador:
http://localhost:3001/test-upload.html
```

### Opción 2: cURL

```bash
curl -X POST http://localhost:3001/api/pedidos/upload \
  -F "file=@pedido.pdf"
```

### Opción 3: JavaScript

```javascript
const formData = new FormData();
formData.append("file", fileInput.files[0]);

const response = await fetch("/api/pedidos/upload", {
  method: "POST",
  body: formData,
});

const result = await response.json();
console.log(result);
```

## 🔍 Cómo Funciona

### 1. Recepción del Archivo

- Se valida que exista un archivo
- Se verifica el tipo MIME (PDF o imagen)
- Se almacena temporalmente en `uploads/`

### 2. Extracción de Texto

- **Para PDF**: `pdf-parse` extrae el texto directamente
- **Para imágenes**: `tesseract.js` realiza OCR en español

### 3. Parsing de Información

Utiliza patrones regex para extraer:

```
- Número de albarán: palabras como "albarán", "pedido", "número"
- Cliente: después de "cliente", "empresa", "de:", "a:"
- NIF: después de "nif", "dni", "cif"
- Teléfono: después de "tel", "teléfono", "phone"
- Dirección: después de "dirección", "calle", "avenida"
- Materiales: referencias - descripción - cantidad - unidad
```

### 4. Almacenamiento en BD

Ejecuta en transacción:

1. Verifica/crea cliente
2. Crea albarán
3. Verifica/crea materiales
4. Asocia materiales al albarán
5. Actualiza stocks si aplica

### 5. Notificación Socket.IO

Emite evento `nuevoAlbaran` a todos los clientes conectados

### 6. Limpieza

Elimina el archivo temporal

## 📁 Estructura de Carpetas Creadas

```
d:\apps\api-zControl\
├── server/
│   ├── uploads/                    (creada automáticamente)
│   └── query/
│       └── Pedidos/
│           └── uploadPedidos.js    (NUEVO)
├── ENDPOINT_PEDIDOS_UPLOAD.md      (NUEVO)
├── test-upload.html                (NUEVO)
└── test-upload.js                  (NUEVO)
```

## ⚙️ Configuración

### Variables de entorno necesarias

Deben estar en `.env`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=zControl
PORT=3001
```

### Socket.IO

El endpoint está integrado con Socket.IO para notificaciones en tiempo real.

## 🎯 Ejemplo de Documento Válido

```
ALBARÁN DE ENTREGA

Número de Albarán: ALB-2026-001
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
```

## ⚠️ Limitaciones y Consideraciones

1. **Precisión OCR**: Depende de la calidad del PDF/imagen
2. **Tiempo de procesamiento**: Las imágenes pueden tardar 5-10 segundos en OCR
3. **Idioma**: Configurado para español (es), se puede ajustar en `Tesseract.recognize()`
4. **Formato documento**: Funciona mejor con documentos estructurados
5. **Caracteres especiales**: Soporta acentos (á, é, í, ó, ú) y caracteres españoles

## 🔧 Mejoras Futuras Sugeridas

- [ ] Interfaz para validación manual de datos extraídos
- [ ] Configuración de plantillas de documentos
- [ ] Métricas de precisión de extracción
- [ ] Búsqueda de materiales existentes por similitud
- [ ] Integración con servicios de IA para extracción más precisa
- [ ] Exportación de logs de procesamiento
- [ ] Caché de resultados por cliente

## 🐛 Debugging

### Ver logs del servidor

```bash
npm start
```

### Logs importantes

- Conexión a BD: "¡Conexión exitosa a la base de datos!"
- Inicio: "Servidor ejecutándose en localhost:3001"
- Transacciones: Mensajes de error incluyen detalles SQL

### Obtener texto extraído

En la respuesta JSON, el campo `extractedText` contiene los primeros 1000 caracteres del documento procesado.

## 📞 Soporte

Para más información sobre:

- Patrones regex: Ver `ENDPOINT_PEDIDOS_UPLOAD.md`
- Librerías OCR: https://tesseract.js.org/
- Procesamiento PDF: https://github.com/modesty/pdf-parse
- Multer: https://github.com/expressjs/multer
