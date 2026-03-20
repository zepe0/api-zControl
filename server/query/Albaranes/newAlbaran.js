import express from "express";
import conexion from "../../conexion.js";

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
    const ralMatch = upperRaw.match(/\b(\d{4})\b/);
    const ralBase = ralMatch ? ralMatch[1] : "";

    let acabado = null;
    const marcaTokens = [];

    for (const tk of tokens) {
      const lower = tk.toLowerCase();
      if (ralBase && tk === ralBase) continue;
      if (!acabado && ACABADO_TOKENS.has(lower)) {
        acabado = ACABADO_TOKENS.get(lower);
        continue;
      }
      marcaTokens.push(tk);
    }

    const ralCodigo = ralBase
      ? `${ralBase}${acabado ? ` ${acabado}` : ""}`
      : "";
    const marcaLimpia = marcaTokens.join(" ").trim();

    return {
      ralCodigo,
      esMate: acabado === "M",
      acabado,
      esImprimacion: false,
      esNoir: false,
      marca: marcaLimpia || "Genérica",
    };
  };

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
        const { ref, mat, unid } = material;
        const [rows] = await connection.query(queryCheckMateriales, [ref]);

        if (rows.length === 0) {
          await connection.query(queryInsertMateriales, [ref, mat, unid ?? 1]);
        }
        // Si ya existe, no se toca: las medidas propias de este pedido van en pedido_lineas
      }

      // Insertar materiales en la tabla pedido_lineas
      const queryAlbaranMateriales =
        "INSERT INTO pedido_lineas (pedido_id, producto_id, cantidad, ral, observaciones, refObra, unidad_medida, precio_unitario, largo, ancho, espesor, tiene_imprimacion, fabricacion_manual, fecha_fabricacion_manual, nombre_snapshot) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

      for (const material of albaran) {
        // Snapshot por línea: usar valores calculados/confirmados por el front
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
        } = material;
        const ralRawValue = Ral || ral || "Sin especificar";
        const ralInfo = normalizarRalInfo(ralRawValue);
        const ralValue = ralInfo.ralCodigo || "Sin especificar";
        const cantidadParse = Number.parseFloat(
          String(cantidad ?? unid ?? 1).replace(",", "."),
        );
        const cantidadValue = Number.isNaN(cantidadParse) ? 1 : cantidadParse;
        const precioRaw =
          precio_unitario ?? precioUnitario ?? precio_sugerido ?? precio ?? 0;
        const precioUnitarioValue = Number.parseFloat(
          String(precioRaw).replace(",", "."),
        );
        const parseDecimalOrNull = (value) => {
          if (
            value === undefined ||
            value === null ||
            String(value).trim() === ""
          ) {
            return null;
          }
          const parsed = Number.parseFloat(String(value).replace(",", "."));
          return Number.isNaN(parsed) ? null : parsed;
        };
        const largoValue = parseDecimalOrNull(largo);
        const anchoValue = parseDecimalOrNull(ancho);
        const espesorValue = parseDecimalOrNull(espesor) ?? 1;
        const consumoValue =
          Number.parseFloat(String(consumo ?? 0).replace(",", ".")) || 0;
        const tieneImprimacionValue =
          tiene_imprimacion === true ||
          tiene_imprimacion === 1 ||
          String(tiene_imprimacion).toLowerCase() === "true" ||
          String(tiene_imprimacion) === "1";

        await connection.query(queryAlbaranMateriales, [
          numAlbaran,
          ref,
          cantidadValue,
          ralValue,
          observaciones,
          refObra ?? null,
          unidad_medida ?? null,
          Number.isNaN(precioUnitarioValue) ? 0 : precioUnitarioValue,
          largoValue,
          anchoValue,
          espesorValue,
          tieneImprimacionValue ? 1 : 0,
          fabricacion_manual ?? 0,
          fecha_fabricacion_manual ?? null,
          mat ?? null,
        ]);

        // Solo actualizamos stock cuando se proporcionó un RAL real
        if (ralValue && ralValue !== "Sin especificar") {
          // Consulta el stock y el consumo
          const [rows] = await connection.query(
            "SELECT stock FROM pintura WHERE ral = ?",
            [ralValue],
          );
          if (rows.length > 0) {
            const stockActual = parseFloat(rows[0].stock) || 0;

            const cantidadARestar = consumoValue * Number(cantidadValue);
            const stockRestante = stockActual - cantidadARestar;

            // Actualiza el stock aunque quede negativo
            await connection.query(
              "UPDATE pintura SET stock = ? WHERE ral = ?",
              [stockRestante, ralValue],
            );

            // Si el stock es negativo, notifica al usuario
            if (stockRestante < 0) {
              error = `¡Atención! El stock para RAL ${ralValue} es negativo: ${stockRestante} Kg`;
            }
          } else {
            const id =
              Date.now().toString(36) + Math.random().toString(36).substring(2);
            await connection.query(
              "INSERT INTO pintura (id,ral, stock,marca) VALUES (?,?,?, ?)",
              [
                id,
                ralValue,
                -consumoValue * Number(cantidadValue),
                ralInfo.marca,
              ],
            );
            const acabadoLabel = ralInfo.esMate ? "Mate" : "Normal/Brillo";
            error = `RAL ${ralValue} (${acabadoLabel}) no encontrado, se ha creado con marca ${ralInfo.marca} y stock negativo de ${
              -consumoValue * Number(cantidadValue)
            } Kg`;
          }
        }

        // Segunda resta de stock para imprimación cuando aplique
        if (tieneImprimacionValue) {
          const [rowsImp] = await connection.query(
            "SELECT stock FROM pintura WHERE ral = ?",
            ["IMPRIMACION"],
          );

          const cantidadARestarImp = consumoValue * Number(cantidadValue);

          if (rowsImp.length > 0) {
            const stockImpActual = parseFloat(rowsImp[0].stock) || 0;
            const stockImpRestante = stockImpActual - cantidadARestarImp;

            await connection.query(
              "UPDATE pintura SET stock = ? WHERE ral = ?",
              [stockImpRestante, "IMPRIMACION"],
            );

            if (stockImpRestante < 0) {
              error = `¡Atención! El stock de IMPRIMACION es negativo: ${stockImpRestante} Kg`;
            }
          } else {
            const idImp =
              Date.now().toString(36) + Math.random().toString(36).substring(2);
            await connection.query(
              "INSERT INTO pintura (id,ral, stock,marca) VALUES (?,?,?, ?)",
              [idImp, "IMPRIMACION", -cantidadARestarImp, "-"],
            );
            error = `IMPRIMACION no encontrada, se ha creado con un stock negativo de ${-cantidadARestarImp} Kg`;
          }
        }
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

    const nifValue = Nif ?? nif ?? null;
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

      const lineData = [];
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

      for (const material of albaran) {
        const rawRal = material?.Ral || material?.ral || "Sin especificar";
        const ralInfo = normalizarRalInfo(rawRal);
        const ralValue =
          ralInfo.ralCodigo || String(rawRal || "").trim() || "Sin especificar";

        const cantidadValue = toDecimal(
          material?.cantidad ?? material?.unid ?? 1,
          1,
        );
        const consumoLineaKg = toDecimal(material?.consumo, 0);
        const tieneImprimacionValue = isTruthy(material?.tiene_imprimacion);
        const fabricacionManualValue = isTruthy(material?.fabricacion_manual);

        const line = {
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
          cantidadValue,
          consumoLineaKg,
          ralValue,
          tieneImprimacionValue,
          fabricacionManualValue,
          fechaFabricacionManual: material?.fecha_fabricacion_manual ?? null,
          parsedMarca: ralInfo.marca || "Genérica",
          deductions: [],
        };

        if (!line.fabricacionManualValue) {
          if (!isWildcardRal(line.ralValue) && line.consumoLineaKg > 0) {
            const ralKey = String(line.ralValue).trim().toUpperCase();
            line.deductions.push({
              ralKey,
              cantidadKg: line.consumoLineaKg,
              tipo: "COLOR",
              marca: line.parsedMarca,
            });
          }

          if (line.tieneImprimacionValue && line.consumoLineaKg > 0) {
            const impKey = "IMPRIMACION";
            line.deductions.push({
              ralKey: impKey,
              cantidadKg: line.consumoLineaKg,
              tipo: "IMPRIMACION",
              marca: "-",
            });
          }
        }

        lineData.push(line);
      }

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
        "INSERT INTO pedido_lineas (pedido_id, producto_id, cantidad, ral, observaciones, refObra, unidad_medida, precio_unitario, largo, ancho, espesor, tiene_imprimacion, fabricacion_manual, fecha_fabricacion_manual, nombre_snapshot, consumo_imprimacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

      for (const line of lineData) {
        const [rowsMaterial] = await connection.query(queryCheckMateriales, [
          line.ref,
        ]);
        if (rowsMaterial.length === 0 && line.ref) {
          await connection.query(queryInsertMateriales, [
            line.ref,
            line.mat || line.ref,
            line.cantidadValue || 1,
          ]);
        }

        const [lineInsertResult] = await connection.query(queryInsertLinea, [
          numAlbaran,
          line.ref || "",
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
        ]);

        const pedidoLineaId = lineInsertResult?.insertId || null;

        for (const deduction of line.deductions) {
          const pintura = await getOrCreatePaintByRal(
            deduction.ralKey,
            deduction.marca,
          );

          const qty = toDecimal(deduction.cantidadKg, 0);
          if (qty <= 0) continue;

          const cacheStock = currentStockByPaintId.get(pintura.id);
          const stockPrev =
            cacheStock === undefined
              ? toDecimal(pintura.stockActual, 0)
              : toDecimal(cacheStock, 0);
          const stockNext = stockPrev - qty;

          const costInfo = await consumeFifoCost(
            connection,
            pintura.id,
            qty,
            fifoEnabled,
          );

          await connection.query("UPDATE pintura SET stock = ? WHERE id = ?", [
            stockNext,
            pintura.id,
          ]);
          currentStockByPaintId.set(pintura.id, stockNext);

          if (movimientosEnabled) {
            await connection.query(
              `
              INSERT INTO pintura_stock_movimientos
              (pedido_id, pedido_linea_id, pintura_id, ral_snapshot, tipo, cantidad_kg,
               stock_anterior_kg, stock_nuevo_kg, coste_unitario_eur_kg, coste_total_eur,
               origen, observaciones, usuario)
              VALUES (?, ?, ?, ?, 'SALIDA', ?, ?, ?, ?, ?, 'pedido_transaccional', ?, ?)
              `,
              [
                numAlbaran,
                pedidoLineaId,
                pintura.id,
                pintura.ral,
                qty,
                stockPrev,
                stockNext,
                costInfo.costeUnitario,
                costInfo.costeTotal,
                deduction.tipo,
                null,
              ],
            );
          }
        }
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
