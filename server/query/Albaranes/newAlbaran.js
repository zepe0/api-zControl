import express from "express";
import conexion from "../../conexion.js";
import { calcularConsumoPintura } from "../../utils/calcularConsumo.js";
import { aplicarStockPintura } from "../../utils/HelperUpdateAlbaran.js";

export default function newAlbaran(io) {
  const router = express.Router();

  const ACABADO_TOKENS = new Map([
    ["m", "M"],
    ["mate", "M"],
    ["gof", "GOF"],
    ["gofrado", "GOF"],
    ["txt", "TXT"],
    ["texturado", "TXT"],
  ]);

  const normalizarRalInfo = (ralInput) => {
    const raw = String(ralInput ?? "").trim();
    const upperRaw = raw.toUpperCase();
    const normalizedRaw = raw
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\-_/]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Caso imprimacion: prioridad absoluta sobre cualquier otro parseo.
    if (/\bIMP(?:RIMACION)?\b/i.test(normalizedRaw)) {
      const marcaImp = normalizedRaw
        .replace(/\bIMP(?:RIMACION)?\b/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
      return {
        ralCodigo: "IMPRIMACION",
        esMate: false,
        acabado: null,
        esImprimacion: true,
        esNoir: false,
        marca: marcaImp || "-",
      };
    }

    const tokens = normalizedRaw.length > 0 ? normalizedRaw.split(" ") : [];

    // Caso "NOIR ...": los numeros siguientes forman parte del nombre.
    // La marca empieza en el primer token con letras; si no existe, queda sin marca.
    const firstToken = (tokens[0] || "").toLowerCase();
    if (firstToken === "noir") {
      const resto = tokens.slice(1);
      const nombreTokens = ["NOIR"];
      const marcaTokens = [];
      let marcaDetectada = false;

      for (const tk of resto) {
        const hasLetters = /[a-z]/i.test(tk);

        if (!marcaDetectada && !hasLetters) {
          nombreTokens.push(tk);
          continue;
        }

        marcaDetectada = true;
        marcaTokens.push(tk);
      }

      return {
        ralCodigo: nombreTokens.join(" ").trim(),
        esMate: false,
        acabado: null,
        esImprimacion: false,
        esNoir: true,
        marca: marcaTokens.join(" ").trim() || "Sin marca",
      };
    }

    // Caso RAL estándar: los 4 primeros dígitos son el código.
    const ralMatch = upperRaw.match(/(\d{4})/);
    const ralBase = ralMatch ? ralMatch[1] : "";

    const acabadosAdjuntos = [];
    const marcaTokens = [];

    for (const tk of tokens) {
      const lower = tk.toLowerCase();

      // Si el token contiene el número RAL (ej: 8015M), extraemos acabado pegado
      if (ralBase && lower.includes(ralBase)) {
        const remainder = lower.replace(ralBase, "").trim();
        if (remainder && ACABADO_TOKENS.has(remainder)) {
          acabadosAdjuntos.push(ACABADO_TOKENS.get(remainder));
        }
        continue;
      }

      if (ACABADO_TOKENS.has(lower)) {
        acabadosAdjuntos.push(ACABADO_TOKENS.get(lower));
        continue;
      }
      marcaTokens.push(tk);
    }

    const uniqueAcabados = [...new Set(acabadosAdjuntos)];
    const ralCodigo = ralBase
      ? `${ralBase}${uniqueAcabados.length > 0 ? " " + uniqueAcabados.join(" ") : ""}`
      : "";

    const marcaLimpia = marcaTokens.join(" ").trim();

    return {
      ralCodigo,
      esMate: uniqueAcabados.includes("M"),
      acabado: uniqueAcabados.join(" "),
      esImprimacion: false,
      esNoir: false,
      marca: marcaLimpia || "Genérica",
    };
  } // <- cierre correcto de normalizarRalInfo

  // --- Funciones utilitarias fuera de normalizarRalInfo ---
  const toDecimal = (value, defaultValue = 0) => {
    if (value === null || value === undefined || value === "") {
      return defaultValue;
    }
    const parsed = Number.parseFloat(String(value).replace(",", "."));
    return Number.isNaN(parsed) ? defaultValue : parsed;
  };

  const toNullableDecimal = (value) => {
    if (value === null || value === undefined || String(value).trim() === "") {
      return null;
    }
    const parsed = Number.parseFloat(String(value).replace(",", "."));
    return Number.isNaN(parsed) ? null : parsed;
  };

  const normalizeToken = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ");

  const isTruthy = (value) =>
    value === true ||
    value === 1 ||
    String(value).toLowerCase() === "true" ||
    String(value) === "1";

  const isWildcardRal = (value) => {
    const token = normalizeToken(value);
    return (
      token === "" ||
      token === "sin especificar" ||
      token === "pendiente" ||
      token === "sistema"
    );
  };

  const hasTable = async (connection, tableName) => {
    const [rows] = await connection.query(
      `
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = DATABASE() AND table_name = ?
      LIMIT 1
      `,
      [tableName],
    );
    return rows.length > 0;
  };

  const getLastPurchasePrice = async (connection, pinturaId) => {
    const [rows] = await connection.query(
      `
      SELECT precio_kg_calculado
      FROM pintura_compras
      WHERE pintura_id = ?
      ORDER BY fecha_compra DESC, id DESC
      LIMIT 1
      `,
      [pinturaId],
    );
    if (rows.length === 0) return 0;
    return toDecimal(rows[0].precio_kg_calculado, 0);
  };

  const consumeFifoCost = async (
    connection,
    pinturaId,
    cantidadKg,
    fifoEnabled,
  ) => {
    const qty = toDecimal(cantidadKg, 0);
    if (qty <= 0) {
      return {
        costeTotal: 0,
        costeUnitario: 0,
        metodo: "LAST",
      };
    }

    if (!fifoEnabled) {
      const lastPrice = await getLastPurchasePrice(connection, pinturaId);
      const total = qty * lastPrice;
      return {
        costeTotal: total,
        costeUnitario: lastPrice,
        metodo: "LAST",
      };
    }

    const [lotes] = await connection.query(
      `
      SELECT id, cantidad_restante_kg, coste_unitario_eur_kg
      FROM pintura_stock_lotes_fifo
      WHERE pintura_id = ? AND cantidad_restante_kg > 0
      ORDER BY fecha_entrada ASC, id ASC
      FOR UPDATE
      `,
      [pinturaId],
    );

    let restante = qty;
    let costeAcumulado = 0;
    let consumido = 0;

    for (const lote of lotes) {
      if (restante <= 0) break;
      const disponible = toDecimal(lote.cantidad_restante_kg, 0);
      if (disponible <= 0) continue;

      const take = Math.min(disponible, restante);
      const unitCost = toDecimal(lote.coste_unitario_eur_kg, 0);

      const nuevoRestante = disponible - take;

      await connection.query(
        `
        UPDATE pintura_stock_lotes_fifo
        SET cantidad_restante_kg = ?, estado = ?
        WHERE id = ?
        `,
        [nuevoRestante, nuevoRestante > 0 ? "ABIERTO" : "CERRADO", lote.id],
      );

      costeAcumulado += take * unitCost;
      consumido += take;
      restante -= take;
    }

    if (restante > 0) {
      const lastPrice = await getLastPurchasePrice(connection, pinturaId);
      costeAcumulado += restante * lastPrice;
      consumido += restante;
      restante = 0;
      return {
        costeTotal: costeAcumulado,
        costeUnitario: consumido > 0 ? costeAcumulado / consumido : 0,
        metodo: "FIFO",
      };
    }

    return {
      costeTotal: costeAcumulado,
      costeUnitario: consumido > 0 ? costeAcumulado / consumido : 0,
      metodo: "FIFO",
    };
  };

  router.post("/add", async (req, res) => {
    const {
      numAlbaran,
      cliente,
      Nif,
      nif,
      tel,
      dir,
      albaran,
      firma,
      observaciones,
      ral,
      estado,
    } = req.body;
    let error;
    let clienteId;
    const nifValue = Nif ?? nif ?? null;
    let connection; // Variable para la conexión específica

    try {
      // Obtener una conexión del pool
      connection = await conexion.getConnection();

      // Iniciar la transacción
      await connection.beginTransaction();

      const queryCliente =
        "INSERT INTO cliente (id,nombre, Nif, tel, dir) VALUES (?, ?, ?, ?,?)";

      const queryCheckUser =
        "SELECT id FROM cliente WHERE nombre = ? AND Nif = ?";
      const [rows] = await connection.query(queryCheckUser, [
        cliente,
        nifValue,
      ]);

      if (rows.length <= 0) {
        clienteId =
          Date.now().toString(36) + Math.random().toString(36).substring(2);
        await connection.query(queryCliente, [
          clienteId,
          cliente,
          nifValue,
          tel,
          dir,
        ]);
      } else {
        clienteId = rows[0].id;
      }

      const queryAlbaranes =
        "INSERT INTO pedidos (id, cliente_id, estado, observaciones) VALUES (?, ?, ?, ?)";
      await connection.query(queryAlbaranes, [
        numAlbaran,
        clienteId,
        estado,
        numAlbaran,
      ]);
      // Comprobar e insertar materiales en la tabla Materiales (buscar por ID/ref)
      // Si ya existe el producto, no se modifica; las medidas específicas van en pedido_lineas
      const queryCheckMateriales = "SELECT id FROM productos WHERE id = ?";
      const queryInsertMateriales =
        "INSERT INTO productos (id, nombre, uni) VALUES (?, ?, ?)";

      for (const material of albaran) {
        const { ref, mat, unid, unidad_medida, largo, ancho, espesor, consumo } = material;
        const parseDecimalOrNull = (val) => {
          if (val === undefined || val === null || String(val).trim() === "") return null;
          const p = Number.parseFloat(String(val).replace(",", "."));
          return Number.isNaN(p) ? null : p;
        };
        const cCalculado = calcularConsumoPintura({
          unidad_medida,
          largo: parseDecimalOrNull(largo),
          ancho: parseDecimalOrNull(ancho),
          espesor: parseDecimalOrNull(espesor) ?? 1,
          consumoManual: consumo,
        });

        const [rows] = await connection.query(queryCheckMateriales, [ref]);
        if (rows.length === 0) {
          await connection.query(
            "INSERT INTO productos (id, nombre, uni, unidad_medida, consumo) VALUES (?, ?, ?, ?, ?)", 
            [ref, mat, unid ?? 1, unidad_medida || "ud", cCalculado]
          );
        } else {
          await connection.query(
            "UPDATE productos SET nombre = ?, unidad_medida = ?, consumo = ? WHERE id = ?",
            [mat || rows[0].nombre, unidad_medida || "ud", cCalculado, ref]
          );
        }
      }

      const queryAlbaranMateriales =
        "INSERT INTO pedido_lineas (pedido_id, producto_id, cantidad, ral, observaciones, refObra, unidad_medida, precio_unitario, largo, ancho, espesor, tiene_imprimacion, fabricacion_manual, fecha_fabricacion_manual, nombre_snapshot, consumo_pintura_kg) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

      for (const material of albaran) {
        const {
          ref,
          unid,
          cantidad,
          Ral,
          ral,
          consumo,
          refObra,
          unidad_medida,
          precio_unitario,
          precio_sugerido,
          precioUnitario,
          precio,
          largo,
          ancho,
          espesor,
          tiene_imprimacion,
          fabricacion_manual,
          fecha_fabricacion_manual,
          mat,
          idMaterial
        } = material;

        const ralRawValue = Ral || ral || "Sin especificar";
        const ralInfo = normalizarRalInfo(ralRawValue);
        const ralValue = ralInfo.ralCodigo || "Sin especificar";
        
        const cantidadValue = toDecimal(cantidad ?? unid ?? 1, 1);
        const precioUnitarioValue = toDecimal(precio_unitario ?? precioUnitario ?? precio_sugerido ?? precio ?? 0, 0);
        
        const largoValue = toNullableDecimal(largo);
        const anchoValue = toNullableDecimal(ancho);
        const espesorValue = toNullableDecimal(espesor) ?? 1;

        const consumoValue = calcularConsumoPintura({
          unidad_medida,
          largo: largoValue,
          ancho: anchoValue,
          espesor: espesorValue,
          consumoManual: consumo,
        });

        const tieneImprimacionValue = isTruthy(tiene_imprimacion);

        const productoIdSeguro =
          idMaterial && String(idMaterial).trim() !== "" && String(idMaterial) !== "9999"
            ? idMaterial
            : ref && String(ref).trim() !== "" && String(ref) !== "9999"
              ? ref
              : `${mat || "Producto"} ${largoValue ?? ""}x${anchoValue ?? ""}x${espesorValue ?? ""}`.trim();

        const [insResult] = await connection.query(queryAlbaranMateriales, [
          numAlbaran,
          productoIdSeguro,
          cantidadValue,
          ralValue,
          observaciones,
          refObra ?? null,
          unidad_medida ?? null,
          precioUnitarioValue,
          largoValue,
          anchoValue,
          espesorValue,
          tieneImprimacionValue ? 1 : 0,
          fabricacion_manual ?? 0,
          fecha_fabricacion_manual ?? null,
          mat ?? null,
          consumoValue
        ]);

        const pedidoLineaId = insResult?.insertId;

        // Registrar stock y movimientos usando el helper unificado
        await aplicarStockPintura(
          numAlbaran,
          pedidoLineaId,
          {
            ral: ralValue,
            consumo: consumoValue,
            cantidad: cantidadValue,
            tiene_imprimacion: tieneImprimacionValue,
          },
          connection
        );
      }


      if (firma) {
        const queryFirmas =
          "INSERT INTO Firmas (idAlbaran, firma) VALUES (?, ?)";
        await connection.query(queryFirmas, [numAlbaran, firma]);
      }

      await connection.commit();
      res.status(200).json({ message: "Albarán creado correctamente", error });
      const [pinturas] = await connection.query(
        "SELECT * FROM pintura order by stock ASC",
      );
      io.emit("Actualizar_pintura", pinturas);
    } catch (err) {
      console.error("Error durante la transacción:", err);

      // Revertir la transacción si ocurre un error
      if (connection) await connection.rollback();

      res.status(500).json({ error: "Error al crear el albarán" });
    } finally {
      if (connection) connection.release();
    }
  });

  router.post("/add-transaccional", async (req, res) => {

    const {
      numAlbaran,
      cliente,
      Nif,
      nif,
      tel,
      dir,
      albaran,
      firma,
      observaciones,
      estado,
    } = req.body || {};
    const nifValue = Nif ?? nif ?? null;
    if (
      !numAlbaran ||
      !cliente ||
      !Array.isArray(albaran) ||
      albaran.length === 0
    ) {
      return res.status(400).json({
        code: "INVALID_PAYLOAD",
        error: "Faltan campos obligatorios para crear el pedido",
      });
    }

    // Poblar lineData antes del try
    const lineData = albaran.map(material => {
      const rawRal = material?.Ral || material?.ral || "Sin especificar";
      const ralInfo = normalizarRalInfo(rawRal);
      const ralValue = ralInfo.ralCodigo || String(rawRal || "").trim() || "Sin especificar";
      return {
        ref: material?.idMaterial || material?.ref || "",
        mat: material?.mat || material?.nombreMaterial || null,
        refObra: material?.refObra ?? null,
        unidad_medida: material?.unidad_medida ?? null,
        precio_unitario: toDecimal(
          material?.precio_unitario ??
          material?.precioUnitario ??
          material?.precio_sugerido ??
          material?.precio ??
          0,
          0,
        ),
        largo: toNullableDecimal(material?.largo ?? material?.longitud),
        ancho: toNullableDecimal(material?.ancho),
        espesor: toNullableDecimal(material?.espesor) ?? 1,
        cantidadValue: toDecimal(
          material?.cantidad ?? material?.unid ?? 1,
          1,
        ),
        consumoLineaKg: calcularConsumoPintura({
          unidad_medida: material?.unidad_medida,
          largo: toNullableDecimal(material?.largo ?? material?.longitud),
          ancho: toNullableDecimal(material?.ancho),
          espesor: toNullableDecimal(material?.espesor) ?? 1,
          consumoManual: material?.consumo,
        }),
        ralValue,
        tieneImprimacionValue: isTruthy(material?.tiene_imprimacion),
        fabricacionManualValue: isTruthy(material?.fabricacion_manual),
        fechaFabricacionManual: material?.fecha_fabricacion_manual ?? null,
        parsedMarca: ralInfo.marca || "Genérica",
        deductions: [],
      };
    });

    let connection;
    try {
      connection = await conexion.getConnection();
      await connection.beginTransaction();

      const movimientosEnabled = await hasTable(
        connection,
        "pintura_stock_movimientos",
      );
      const fifoEnabled = await hasTable(
        connection,
        "pintura_stock_lotes_fifo",
      );

      const paintCacheByRal = new Map();

      const getOrCreatePaintByRal = async (
        ralKey,
        fallbackMarca = "Genérica",
      ) => {
        if (paintCacheByRal.has(ralKey)) {
          return paintCacheByRal.get(ralKey);
        }

        const [rows] = await connection.query(
          `
          SELECT id, ral, stock, marca
          FROM pintura
          WHERE UPPER(TRIM(ral)) = ?
             OR UPPER(TRIM(ral)) LIKE CONCAT(?, ' %')
          ORDER BY CASE WHEN UPPER(TRIM(ral)) = ? THEN 0 ELSE 1 END, id ASC
          LIMIT 1
          FOR UPDATE
          `,
          [ralKey, ralKey, ralKey],
        );

        if (rows.length > 0) {
          const existing = {
            id: rows[0].id,
            ral: rows[0].ral,
            marca: rows[0].marca,
            stockActual: toDecimal(rows[0].stock, 0),
          };
          paintCacheByRal.set(ralKey, existing);
          return existing;
        }

        const newId =
          Date.now().toString(36) + Math.random().toString(36).substring(2);

        await connection.query(
          "INSERT INTO pintura (id, ral, stock, marca) VALUES (?, ?, ?, ?)",
          [newId, ralKey, 0, fallbackMarca || "Genérica"],
        );

        const created = {
          id: newId,
          ral: ralKey,
          marca: fallbackMarca || "Genérica",
          stockActual: 0,
        };
        paintCacheByRal.set(ralKey, created);
        return created;
      };

      let clienteId;
      const [clienteRows] = await connection.query(
        "SELECT id FROM cliente WHERE nombre = ? AND Nif = ?",
        [cliente, nifValue],
      );

      if (clienteRows.length === 0) {
        clienteId =
          Date.now().toString(36) + Math.random().toString(36).substring(2);
        await connection.query(
          "INSERT INTO cliente (id, nombre, Nif, tel, dir) VALUES (?, ?, ?, ?, ?)",
          [clienteId, cliente, nifValue, tel ?? null, dir ?? null],
        );
      } else {
        clienteId = clienteRows[0].id;
      }

      await connection.query(
        "INSERT INTO pedidos (id, cliente_id, estado, observaciones) VALUES (?, ?, ?, ?)",
        [
          numAlbaran,
          clienteId,
          estado || "Borrador",
          observaciones || numAlbaran,
        ],
      );

      const currentStockByPaintId = new Map();

      const queryCheckMateriales = "SELECT id FROM productos WHERE id = ?";
      const queryInsertMateriales =
        "INSERT INTO productos (id, nombre, uni) VALUES (?, ?, ?)";

      const queryInsertLinea =
        "INSERT INTO pedido_lineas (pedido_id, producto_id, cantidad, ral, observaciones, refObra, unidad_medida, precio_unitario, largo, ancho, espesor, tiene_imprimacion, fabricacion_manual, fecha_fabricacion_manual, nombre_snapshot, consumo_imprimacion,consumo_pintura_kg) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

      for (const line of lineData) {
        // Generar productoIdSeguro
        const productoIdSeguro =
          line.ref && String(line.ref).trim() !== ""
            ? line.ref
            : `${line.mat || "Producto"} ${line.largo ?? ""}x${line.ancho ?? ""}x${line.espesor ?? ""}`.trim();

        // Asegurar que el producto existe en productos
        const [rowsProd] = await connection.query(queryCheckMateriales, [productoIdSeguro]);
        if (rowsProd.length === 0) {
          await connection.query(queryInsertMateriales, [
            productoIdSeguro,
            line.mat || productoIdSeguro,
            line.cantidadValue || 1,
          ]);
        }

        const [lineInsertResult] = await connection.query(queryInsertLinea, [
          numAlbaran,
          productoIdSeguro,
          line.cantidadValue,
          line.ralValue || "Sin especificar",
          observaciones || null,
          line.refObra,
          line.unidad_medida,
          line.precio_unitario,
          line.largo,
          line.ancho,
          line.espesor,
          line.tieneImprimacionValue ? 1 : 0,
          line.fabricacionManualValue ? 1 : 0,
          line.fechaFabricacionManual,
          line.mat,
          line.tieneImprimacionValue ? line.consumoLineaKg : 0,
          line.consumo ? line.consumoPinturaKg : 0,
        ]);

        const pedidoLineaId = lineInsertResult?.insertId || null;

        // Registrar stock y movimientos usando el helper unificado
        await aplicarStockPintura(
          numAlbaran,
          pedidoLineaId,
          {
            ral: line.ralValue,
            consumo: line.consumoLineaKg,
            cantidad: line.cantidadValue,
            tiene_imprimacion: line.tieneImprimacionValue,
          },
          connection
        );
      }

      if (firma) {
        await connection.query(
          "INSERT INTO Firmas (idAlbaran, firma) VALUES (?, ?)",
          [numAlbaran, firma],
        );
      }

      await connection.commit();

      const [pinturas] = await connection.query(
        "SELECT * FROM pintura ORDER BY stock ASC",
      );
      io.emit("Actualizar_pintura", pinturas);

      return res.status(200).json({
        message: "Albarán creado correctamente",
        mode: "transaccional",
      });
    } catch (err) {
      console.error("Error durante la transacción transaccional:", err);
      if (connection) await connection.rollback();
      return res.status(500).json({
        code: "INTERNAL_ERROR",
        error: "Error al crear el albarán en modo transaccional",
      });
    } finally {
      if (connection) connection.release();
    }
  });

  return router;
}
