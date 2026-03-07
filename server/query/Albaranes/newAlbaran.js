import express from "express";
import conexion from "../../conexion.js";

export default function newAlbaran(io) {
  const router = express.Router();

  router.post("/add", async (req, res) => {
    const {
      numAlbaran,
      cliente,
      Nif,
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
      const [rows] = await connection.query(queryCheckUser, [cliente, Nif]);

      if (rows.length <= 0) {
        clienteId =
          Date.now().toString(36) + Math.random().toString(36).substring(2);
        await connection.query(queryCliente, [
          clienteId,
          
          Nif,
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
      // Comprobar e insertar materiales en la tabla Materiales
      const queryCheckMateriales =
        "SELECT nombre FROM productos WHERE nombre = ?";
      const queryInsertMateriales =
        "INSERT INTO productos (id, nombre, uni, refObra) VALUES (?, ?, ?, ?)";
      for (const material of albaran) {
        const { ref, mat, unid, refObra } = material;
        const [rows] = await connection.query(queryCheckMateriales, [mat]);

        if (rows.length === 0) {
          await connection.query(queryInsertMateriales, [
            ref,
            mat,
            unid,
            refObra,
          ]);
        }
      }

      // Insertar materiales en la tabla pedido_lineas
      const queryAlbaranMateriales =
        "INSERT INTO pedido_lineas (pedido_id, producto_id, cantidad,ral,observaciones) VALUES (?, ?, ?,?,?)";


      for (const material of albaran) {
        // si falta referencia de pintura, usar valor por defecto
        const { ref, unid, Ral, consumo } = material;
        const ralValue = Ral || "Sin especificar";

        await connection.query(queryAlbaranMateriales, [
          numAlbaran,
          ref,
          unid,
          ralValue,
          observaciones,
        ]);

        // Solo actualizamos stock cuando se proporcionó un RAL real
        if (Ral) {
          // Consulta el stock y el consumo
          const [rows] = await connection.query(
            "SELECT stock FROM pintura WHERE ral = ?",
            [Ral],
          );
          if (rows.length > 0) {
            const stockActual = parseFloat(rows[0].stock) || 0;

            const cantidadARestar = consumo * unid;
            const stockRestante = stockActual - cantidadARestar;

            // Actualiza el stock aunque quede negativo
            await connection.query(
              "UPDATE pintura SET stock = ? WHERE ral = ?",
              [stockRestante, Ral],
            );

            // Si el stock es negativo, notifica al usuario
            if (stockRestante < 0) {
              error = `¡Atención! El stock para RAL ${Ral} es negativo: ${stockRestante} Kg`;
            }
          } else {
            const id =
              Date.now().toString(36) + Math.random().toString(36).substring(2);
            await connection.query(
              "INSERT INTO pintura (id,ral, stock,marca) VALUES (?,?,?, ?)",
              [id, Ral, -consumo * unid, "-"],
            );
            error = `RAL ${Ral} no encontrado, se ha creado con un stock negativo de ${
              -consumo * unid
            } Kg`;
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
  return router;
}
