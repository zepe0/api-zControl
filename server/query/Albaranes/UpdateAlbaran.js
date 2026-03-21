import express from "express";
import conexion from "../../conexion.js";
import {
  revertirStockPintura,
  aplicarStockPintura,
} from "../../utils/HelperUpdateAlbaran.js";

const router = express.Router();

const updateAlbaran = (io) => {
  router.put("/:pedido_id", async (req, res) => {
    const { pedido_id } = req.params;
    const { albaran, estado } = req.body; // refObra ya no viene suelta aquí si viene en cada línea

    const connection = await conexion.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Actualizar cabecera del pedido (solo estado y quizá fecha/observaciones generales)
      await connection.query("UPDATE pedidos SET estado = ? WHERE id = ?", [
        estado,
        pedido_id,
      ]);
     
      // 2. Detectar líneas borradas
      const [lineasDB] = await connection.query(
        "SELECT id FROM pedido_lineas WHERE pedido_id = ?",
        [pedido_id],
      );
    
      const idsEnPayload = albaran
        .map((l) => l.lineId)
        .filter((id) => id != null);

      const idsABorrar = lineasDB
        .filter((row) => !idsEnPayload.includes(row.id))
        .map((row) => row.id);

      for (const idBorrar of idsABorrar) {
        await revertirStockPintura(idBorrar, connection);
        await connection.query("DELETE FROM pedido_lineas WHERE id = ?", [
          idBorrar,
        ]);
      }

      // 3. Procesar líneas del payload
      for (const linea of albaran) {
        // Extraemos refObra de la línea actual
        const refObraLinea = linea.refObra || "";

        if (!linea.lineId) {
          // INSERTAR NUEVA (Incluimos ref_obra en la columna correspondiente)
          const [ins] = await connection.query(
            `INSERT INTO pedido_lineas (pedido_id, producto_id, cantidad, ral, consumo_pintura_kg, precio_unitario, largo, ancho, espesor, nombre_snapshot, ref_obra) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              pedido_id,
              linea.idMaterial,
              linea.cantidad,
              linea.ral,
              linea.consumo,
              linea.precio_unitario,
              linea.largo,
              linea.ancho,
              linea.espesor,
              linea.mat,
              refObraLinea, // <--- Dato de la línea
            ],
          );
          await aplicarStockPintura(pedido_id, ins.insertId, linea, connection);
        } else {
          // ACTUALIZAR SOLO SI HAY DIFERENCIAS
          const [rows] = await connection.query(
            `SELECT producto_id, cantidad, ral, consumo_pintura_kg, precio_unitario, largo, ancho, espesor, nombre_snapshot, refObra FROM pedido_lineas WHERE id = ?`,
            [linea.lineId],
          );
          const dbLinea = rows[0];
          const hayDiferencias =
            dbLinea.producto_id !== linea.idMaterial ||
            dbLinea.cantidad !== linea.cantidad ||
            dbLinea.ral !== linea.ral ||
            dbLinea.consumo_pintura_kg !== linea.consumo ||
            dbLinea.precio_unitario !== linea.precio_unitario ||
            dbLinea.largo !== linea.largo ||
            dbLinea.ancho !== linea.ancho ||
            dbLinea.espesor !== linea.espesor ||
            dbLinea.nombre_snapshot !== linea.mat ||
            dbLinea.ref_obra !== refObraLinea;

          if (hayDiferencias) {
            // Solo revertir/aplicar stock si cambia el RAL
            const ralCambiado = dbLinea.ral !== linea.ral;
            if (ralCambiado) {
              await revertirStockPintura(linea.lineId, connection);
            }
            debugger
            await connection.query(
              `UPDATE pedido_lineas SET 
                producto_id=?, cantidad=?, ral=?, consumo_pintura_kg=?, 
                precio_unitario=?, largo=?, ancho=?, espesor=?, 
                nombre_snapshot=?, refObra=? 
               WHERE id=?`,
              [
                linea.idMaterial,
                linea.cantidad,
                linea.ral,
                linea.consumo === "" ? null : linea.consumo,
                linea.precio_unitario,
                linea.largo === "" ? null : linea.largo,
                linea.ancho === "" ? null : linea.ancho,
                linea.espesor === "" ? null : linea.espesor,
                linea.mat,
                refObraLinea,
                linea.lineId,
              ],
            );
            if (ralCambiado) {
              await aplicarStockPintura(
                pedido_id,
                linea.lineId,
                linea,
                connection,
              );
            }
          }
        }
      }

      await connection.commit();

      // Socket emits...
      const [pinturas] = await connection.query("SELECT * FROM pintura");
      io.emit("Actualizar_pintura", pinturas);
      io.emit("PedidoActualizado", { pedido_id });

      res
        .status(200)
        .json({ exito: "Pedido y stock actualizados correctamente" });
    } catch (err) {
      if (connection) await connection.rollback();
      console.error("Error en updateAlbaran:", err);
      res.status(500).json({ error: "Error al actualizar albarán" });
    } finally {
      connection.release();
    }
  });

  return router;
};

export default updateAlbaran;
