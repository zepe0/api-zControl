-- 1. Tabla de Clientes
CREATE TABLE IF NOT EXISTS cliente (
    id VARCHAR(255) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tel VARCHAR(20),
    dir TEXT,
    nif VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabla de Pinturas (Control de Stock y Rendimiento)
CREATE TABLE IF NOT EXISTS pintura (
    id VARCHAR(255) PRIMARY KEY,
    ral VARCHAR(100) NOT NULL,
    stock DECIMAL(10,2) DEFAULT 0.00,
    marca VARCHAR(255),
    refPintura VARCHAR(255),
    rendimiento_kg_m2 DECIMAL(10,3) DEFAULT 0.150 COMMENT 'Consumo teórico por m2'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabla de Productos Maestros (Catálogo limpio)
CREATE TABLE IF NOT EXISTS productos (
    id VARCHAR(255) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(10,2) DEFAULT 0.00,
    uni INT DEFAULT 1,
    unidad_medida ENUM('Ud', 'ml', 'm2') DEFAULT 'Ud',
    consumo DECIMAL(10,3) DEFAULT 0.000 COMMENT 'Consumo estimado base'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabla de Pedidos (Cabecera)
CREATE TABLE IF NOT EXISTS pedidos (
    id VARCHAR(32) PRIMARY KEY,
    cliente_id VARCHAR(255),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Borrador', 'Confirmado', 'EnProceso', 'Completado', 'Cancelado', 'En Almacén') DEFAULT 'Borrador',
    observaciones TEXT,
    tipo_iva INT DEFAULT 21,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Tabla de Líneas de Pedido (El motor de cálculo)
CREATE TABLE IF NOT EXISTS pedido_lineas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pedido_id VARCHAR(32),
    producto_id VARCHAR(255),
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    ral VARCHAR(100),
    refObra VARCHAR(255) COMMENT 'Guardado por línea para evitar duplicar productos',
    observaciones VARCHAR(255),
    largo DECIMAL(10,2) DEFAULT NULL,
    ancho DECIMAL(10,2) DEFAULT NULL,
    espesor DECIMAL(10,2) DEFAULT 1.00,
    total_unidades_calculadas DECIMAL(10,2) DEFAULT NULL COMMENT 'Resultado de m2 o ml finales',
    precio_pintura_extra DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Tabla de Albaranes (Corregida para que coincida con pedidos.id)
CREATE TABLE IF NOT EXISTS albaranes (
    id VARCHAR(255) PRIMARY KEY,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    cliente_id VARCHAR(255),
    nCliente VARCHAR(255),
    total DECIMAL(10,2),
    proceso TEXT,
    pedido_id VARCHAR(32), -- Cambiado de 255 a 32 para que coincida exactamente
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE SET NULL,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

