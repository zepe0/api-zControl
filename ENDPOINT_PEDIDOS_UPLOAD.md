# Documentación del Endpoint `/api/pedidos/upload`

## Descripción

El endpoint `/api/pedidos/upload` permite procesar archivos PDF e imágenes de pedidos, extrayendo automáticamente información relevante como:

- Número de albarán/pedido
- Datos del cliente (nombre, NIF, teléfono, dirección)
- Información de materiales con cantidades y unidades

## URL

```
POST /api/pedidos/upload
```

## Método HTTP

`POST` con `multipart/form-data`

## Parámetros de Entrada

### Form-Data

- **file** (requerido): Archivo PDF o imagen (JPG, PNG, WEBP)
  - Tipos MIME soportados:
    - `image/jpeg`
    - `image/png`
    - `image/webp`
    - `application/pdf`
  - Tamaño máximo: Sin límite específico (configurable en multer)

## Respuesta Exitosa (200)

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
      },
      {
        "ref": "REF-002",
        "mat": "Pintura Roja Industrial",
        "unid": 25,
        "unit": "kg"
      }
    ],
    "extractedText": "... primeros 1000 caracteres del documento extraído ..."
  }
}
```

## Respuestas de Error

### 400 - Sin archivo

```json
{
  "error": "No se proporcionó archivo"
}
```

### 400 - Cliente no encontrado

```json
{
  "error": "No se pudo extraer el nombre del cliente del documento",
  "data": {
    /* datos extraídos */
  },
  "text": "... primeros 500 caracteres para debugging ..."
}
```

### 400 - Tipo de archivo no permitido

```json
{
  "error": "Tipo de archivo no permitido. Usa PDF, JPG o PNG"
}
```

### 500 - Error en procesamiento

```json
{
  "error": "Error al procesar el documento"
}
```

## Ejemplo de Uso con cURL

```bash
curl -X POST http://localhost:3001/api/pedidos/upload \
  -F "file=@pedido.pdf"
```

## Ejemplo con JavaScript/Fetch

```javascript
const formData = new FormData();
const fileInput = document.querySelector('input[type="file"]');
formData.append("file", fileInput.files[0]);

const response = await fetch("/api/pedidos/upload", {
  method: "POST",
  body: formData,
});

const result = await response.json();
console.log(result);
```

## Ejemplo con JavaScript/Axios

```javascript
import axios from "axios";

const formData = new FormData();
formData.append("file", fileInput.files[0]);

const response = await axios.post("/api/pedidos/upload", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

console.log(response.data);
```

## Flujo de Procesamiento

1. **Validación del archivo**
   - Verifica que exista un archivo
   - Verifica que sea un tipo permitido (PDF o imagen)

2. **Extracción de texto**
   - **PDF**: Usa `pdf-parse` para extraer texto
   - **Imagen**: Usa `Tesseract.js` para OCR (reconocimiento de caracteres)

3. **Parsing de datos**
   - Busca patrones regex para extraer:
     - Número de albarán
     - Nombre del cliente
     - NIF/DNI/CIF
     - Teléfono
     - Dirección
     - Materiales con cantidades

4. **Almacenamiento en BD**
   - Crea/verifica cliente
   - Crea albarán
   - Asocia materiales al albarán
   - Actualiza stock si aplica

5. **Notificación Socket.IO**
   - Emite evento `nuevoAlbaran` a todos los clientes conectados

6. **Limpieza**
   - Elimina el archivo temporal

## Estructura de Datos en Base de Datos

### Tabla: `Albaranes`

```sql
INSERT INTO Albaranes (id, nCliente, proceso, idPedido)
VALUES (?, ?, 'pendiente', ?)
```

### Tabla: `cliente`

```sql
INSERT INTO cliente (id, nombre, Nif, tel, dir)
VALUES (?, ?, ?, ?, ?)
```

### Tabla: `productos`

```sql
INSERT INTO productos (id, nombre, uni, refObra)
VALUES (?, ?, ?, ?)
```

### Tabla: `AlbaranMateriales`

```sql
INSERT INTO AlbaranMateriales (idAlbaran, idMaterial, cantidad, observaciones)
VALUES (?, ?, ?, ?)
```

## Patrones Regex Utilizados

### Número de Albarán

```regex
(?:albarán|albaran|pedido|número|num)[\s:]*(\d+)
```

### Cliente

```regex
(?:cliente|empresa|de:|a:)\s+([A-Za-z\s&áéíóúÁÉÍÓÚ]+?)(?:\n|nif|dni|cif|tel|\d{8,})
```

### NIF

```regex
(?:nif|dni|cif|cif-nif)[\s:]*([A-Za-z0-9-]+)
```

### Teléfono

```regex
(?:tel|teléfono|phone)[\s:]*(\+?\d[\d\s\-()]{7,})
```

### Dirección

```regex
(?:dirección|direccion|address|calle|avenida|avda)[\s:]*([^\n]+)
```

### Materiales

```regex
([A-Z0-9]+)\s*[-–]\s*([^-\n]+?)\s*[-–]\s*(\d+(?:[.,]\d+)?)\s*(kg|l|ud|unidades?|litro|kilo|m3|m2)
```

## Notas Importantes

1. **OCR en imágenes**: El procesamiento de imágenes mediante OCR puede tardar algunos segundos (depende del tamaño y calidad).

2. **Precisión de extracción**: La precisión depende de:
   - Calidad del PDF/imagen
   - Formato del documento
   - Presencia de campos claramente etiquetados

3. **Manejo de errores**: Se implementa manejo de transacciones para garantizar consistencia de datos.

4. **Generación automática de IDs**: Si no se encuentra número de albarán, se genera automáticamente como `ALB-{timestamp}`.

5. **Socket.IO**: Se emiten eventos en tiempo real para actualizar la UI de otros clientes.

## Mejoras Futuras Sugeridas

- [ ] Soporte para más formatos (DOCX, Excel)
- [ ] Entrenamiento de modelos OCR específicos para facturas
- [ ] Interfaz visual para validación y corrección de datos extraídos
- [ ] Gestión de porcentajes de confianza en la extracción
- [ ] Caché de patrones de documentos conocidos
- [ ] Exportación de logs de procesamiento
