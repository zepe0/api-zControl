-- phpMyAdmin SQL Dump
-- version 5.2.3-1.el8.remi
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 31-03-2026 a las 10:44:18
-- Versión del servidor: 8.0.44
-- Versión de PHP: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `qalz943`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `AlbaranMateriales`
--

CREATE TABLE `AlbaranMateriales` (
  `id` int UNSIGNED NOT NULL,
  `idAlbaran` varchar(255) COLLATE latin1_spanish_ci NOT NULL,
  `idMaterial` varchar(255) COLLATE latin1_spanish_ci NOT NULL,
  `cantidad` int NOT NULL,
  `ral` varchar(100) COLLATE latin1_spanish_ci NOT NULL,
  `observaciones` varchar(255) COLLATE latin1_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `AlbaranMateriales`
--

INSERT INTO `AlbaranMateriales` (`id`, `idAlbaran`, `idMaterial`, `cantidad`, `ral`, `observaciones`) VALUES
(1, '28032025234910', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '3005', 'nuevos'),
(2, '29032025142114', '1', 1, '1', ''),
(3, '29032025191702', '3ee937af-6889-4ec1-b4eb-77a3b891ac7d', 3, '5005', ''),
(4, '12042025180659', 'PU-ZE1', 5, '5005', ''),
(6, '12042025180858', '1', 34, '8008', ''),
(7, '06052025131521', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '9005 mate', ''),
(8, '06052025132225', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '8005', ''),
(9, '06052025132634', '4f9d2294-a2d8-4241-a65f-af3785f13b34', 6, '8008', ''),
(10, '09052025203113', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 1, '9001', ''),
(15, '02062025113749', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 8, '5005', ''),
(16, '02062025113749', '12ae9577-a6a8-4c7f-9b07-51529d7d19ab', 5, '8005', ''),
(17, '02062025113749', '4f9d2294-a2d8-4241-a65f-af3785f13b34', 8, '3001', ''),
(19, '02062025120451', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '8005', ''),
(20, '02062025120740', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '505', ''),
(21, '02062025121015', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '5005', ''),
(23, '02062025121122', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '505', ''),
(24, '02062025121523', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '1001', ''),
(25, '02062025121717', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '1001', ''),
(26, '02062025121833', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '1001', ''),
(28, '02062025121942', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '1001', ''),
(30, '02062025122118', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '1001', ''),
(31, '02062025122310', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '1001', ''),
(32, '02062025122542', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '1001', ''),
(33, '02062025122655', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '1001', ''),
(34, '02062025122846', '12ae9577-a6a8-4c7f-9b07-51529d7d19ab', 5, '1001', ''),
(35, '02062025123039', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '1000', ''),
(37, '02062025123141', 'b09c4b41-0a86-4832-9741-2674b6c83d05', 5, '1000', ''),
(38, '02062025124119', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '1001', ''),
(39, '02062025124244', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 7, '1001', ''),
(40, '02062025124352', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '1001', ''),
(43, '02062025124913', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '1001', ''),
(44, '02062025125108', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '1001', ''),
(45, '02062025125254', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '1001', ''),
(46, '02062025125410', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 7, '1001', ''),
(47, '02062025132501', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '1001', ''),
(48, '02062025132636', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '1001', ''),
(49, '02062025133116', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '1001', ''),
(50, '02062025133223', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 54, '1000', ''),
(51, '02062025133223', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 8, '1001', ''),
(52, '02062025133428', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 3, '1001', ''),
(53, '02062025133529', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '1001', ''),
(54, '02062025133927', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '1001', ''),
(55, '02062025134017', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '1001', ''),
(56, '02062025134453', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '1001', ''),
(60, '04062025111502', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 8, '5005', ''),
(61, '04062025112446', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 3, '1003', ''),
(62, '04062025112446', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 2, '1101', ''),
(63, '04062025112804', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 3, '4009', ''),
(64, '04062025112944', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '7005', ''),
(65, '04062025113054', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '7008', ''),
(66, '04062025114524', '4f9d2294-a2d8-4241-a65f-af3785f13b34', 25, '8007', ''),
(67, '04062025114833', '7b55b34e-552f-4d46-a4ea-2fbbe7d278f3', 8, '9001', ''),
(68, '04062025115045', '4f9d2294-a2d8-4241-a65f-af3785f13b34', 8, '5006', ''),
(69, '04062025115211', '4f9d2294-a2d8-4241-a65f-af3785f13b34', 2, '4003', ''),
(70, '04062025115329', '7b55b34e-552f-4d46-a4ea-2fbbe7d278f3', 8, '5005', ''),
(71, '04062025130839', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 54, '1009', ''),
(72, '05062025204226', '91ebf295-eec7-4fb8-8ac7-50ebe001c600', 5, '2001', ''),
(73, '05062025204746', '4f9d2294-a2d8-4241-a65f-af3785f13b34', 3, '1001', ''),
(74, '02032026193734', '4f9d2294-a2d8-4241-a65f-af3785f13b34', 5, '1015', ''),
(75, '02032026193734', '12ae9577-a6a8-4c7f-9b07-51529d7d19ab', 8, '1015', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `id` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `tel` varchar(20) DEFAULT NULL,
  `dir` text,
  `nif` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`id`, `nombre`, `tel`, `dir`, `nif`) VALUES
('06ca1491-0c77-47c5-aa2f-86963ded96b4', 'manusa', '6000887954', 'Calle del Bosque 22, Granadaqww', '98376452R'),
('1219d345-ab99-44a7-a14b-d5b74759db8c', 'Yulen', '600000000', 'Calle del Bosque 22, Granadaqww', '4763152r'),
('282305aa-6c1e-477a-8f15-68fe34bff272', 'copisa milos', '975624768', 'Jacinto Benedicto 543, Badalona', '98376452x'),
('976b8f5c-b191-414f-a731-f802aed69277', 'paco', '6000887954', 'Jacinto Benedicto 543, Badalona', '98376452E'),
('a905b208-c9dc-402f-97ca-cfbefa580373', 'Beta Conckret', '12312312312', 'Calle del Bosque 22, Granadaqww', '98376452Y'),
('bc1fb546-d9a9-423a-90a7-3bef4b908d2d', 'Juan Carlos', '975624768', 'Calle del Bosque 22, Granadaqww', '98376452o'),
('CLI-001', 'Talleres San José', '933445566', 'Calle Mallorca, Barcelona', 'B12345678'),
('df2f6204-cb71-4ef8-a7d1-b3a6abeccb2a', 'Aitor', '6000887954', 'Jacinto Benedicto 543, Badalona', '4763152s'),
('test-uuid-123', 'CLIENTE PRUEBAS PROFESIONAL', '910000000', 'Polígono Industrial Norte, Nave 4', '12345678X');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estanteria`
--

CREATE TABLE `estanteria` (
  `id` varchar(255) COLLATE latin1_spanish_ci NOT NULL,
  `numAlturas` int NOT NULL,
  `numEstantes` int NOT NULL,
  `matriz` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `estanteria`
--

INSERT INTO `estanteria` (`id`, `numAlturas`, `numEstantes`, `matriz`) VALUES
('1754051462545', 2, 2, '[[null, null], [null, null]]'),
('1754086663565', 5, 5, '[[null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null]]');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` varchar(32) NOT NULL,
  `cliente_id` varchar(255) DEFAULT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('Borrador','Confirmado','EnProceso','Completado','Cancelado','Almacén','Pendiente') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'Borrador',
  `observaciones` text,
  `tipo_iva` int DEFAULT '21',
  `created_by` varchar(100) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id`, `cliente_id`, `fecha`, `estado`, `observaciones`, `tipo_iva`, `created_by`, `updated_by`) VALUES
('16032026132831', '06ca1491-0c77-47c5-aa2f-86963ded96b4', '2026-03-16 13:34:25', 'Borrador', '16032026132831', 21, NULL, NULL),
('16032026161805', '06ca1491-0c77-47c5-aa2f-86963ded96b4', '2026-03-16 16:25:10', 'EnProceso', '16032026161805', 21, NULL, NULL),
('16032026162617', '282305aa-6c1e-477a-8f15-68fe34bff272', '2026-03-16 16:29:34', 'Pendiente', '16032026162617', 21, NULL, NULL),
('16032026195959', '282305aa-6c1e-477a-8f15-68fe34bff272', '2026-03-16 20:01:47', 'Confirmado', '16032026195959', 21, NULL, NULL),
('18032026145059', '282305aa-6c1e-477a-8f15-68fe34bff272', '2026-03-18 15:18:27', 'Borrador', '18032026145059', 21, NULL, NULL),
('18032026152025', '06ca1491-0c77-47c5-aa2f-86963ded96b4', '2026-03-18 15:21:07', 'Completado', '18032026152025', 21, NULL, NULL),
('18032026152916', '1219d345-ab99-44a7-a14b-d5b74759db8c', '2026-03-18 15:32:43', 'EnProceso', '18032026152916', 21, NULL, NULL),
('19032026135140', 'a905b208-c9dc-402f-97ca-cfbefa580373', '2026-03-19 13:54:51', 'EnProceso', '19032026135140', 21, NULL, NULL),
('20032026120931', 'bc1fb546-d9a9-423a-90a7-3bef4b908d2d', '2026-03-20 12:16:34', 'Borrador', '20032026120931', 21, NULL, NULL),
('20032026121854', '282305aa-6c1e-477a-8f15-68fe34bff272', '2026-03-20 12:19:19', 'Borrador', '20032026121854', 21, NULL, NULL),
('20032026191857', '282305aa-6c1e-477a-8f15-68fe34bff272', '2026-03-20 19:20:36', 'Borrador', '20032026191857', 21, NULL, NULL),
('20032026193744', '282305aa-6c1e-477a-8f15-68fe34bff272', '2026-03-20 19:38:14', 'Borrador', '20032026193744', 21, NULL, NULL),
('20032026214339', '06ca1491-0c77-47c5-aa2f-86963ded96b4', '2026-03-20 21:47:49', 'Borrador', '20032026214339', 21, NULL, NULL),
('20032026214956', '282305aa-6c1e-477a-8f15-68fe34bff272', '2026-03-20 21:50:53', 'Borrador', '20032026214956', 21, NULL, NULL),
('20032026225245', '1219d345-ab99-44a7-a14b-d5b74759db8c', '2026-03-20 22:53:28', 'Borrador', '20032026225245', 21, NULL, NULL),
('ORDEN-TEST-2024', '282305aa-6c1e-477a-8f15-68fe34bff272', '2026-03-17 12:18:34', 'Pendiente', 'TEST PROFESIONAL: RAL+IMP y Stock', 21, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido_lineas`
--

CREATE TABLE `pedido_lineas` (
  `id` bigint UNSIGNED NOT NULL,
  `pedido_id` varchar(32) DEFAULT NULL,
  `producto_id` varchar(255) DEFAULT NULL,
  `cantidad` int NOT NULL DEFAULT '1',
  `unidad_medida` varchar(10) DEFAULT 'ud',
  `precio_unitario` decimal(10,2) NOT NULL DEFAULT '0.00',
  `ral` varchar(100) DEFAULT NULL,
  `refObra` varchar(255) DEFAULT NULL,
  `observaciones` varchar(255) DEFAULT NULL,
  `largo` decimal(10,2) DEFAULT NULL,
  `ancho` decimal(10,2) DEFAULT NULL,
  `espesor` decimal(10,2) DEFAULT '1.00',
  `total_unidades_calculadas` decimal(10,2) DEFAULT NULL,
  `precio_pintura_extra` decimal(10,2) DEFAULT '0.00',
  `fabricacion_manual` tinyint(1) DEFAULT '0',
  `fecha_fabricacion_manual` timestamp NULL DEFAULT NULL,
  `nombre_snapshot` varchar(255) DEFAULT NULL,
  `tiene_imprimacion` tinyint(1) DEFAULT '0',
  `consumo_imprimacion` decimal(10,3) DEFAULT '0.000',
  `consumo_pintura_kg` decimal(12,3) DEFAULT NULL,
  `coste_unitario_pintura_eur_kg` decimal(12,4) DEFAULT NULL,
  `coste_total_pintura_eur` decimal(12,4) DEFAULT NULL,
  `coste_metodo` enum('FIFO','LAST','WAC') DEFAULT NULL,
  `fecha_costeo` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `pedido_lineas`
--

INSERT INTO `pedido_lineas` (`id`, `pedido_id`, `producto_id`, `cantidad`, `unidad_medida`, `precio_unitario`, `ral`, `refObra`, `observaciones`, `largo`, `ancho`, `espesor`, `total_unidades_calculadas`, `precio_pintura_extra`, `fabricacion_manual`, `fecha_fabricacion_manual`, `nombre_snapshot`, `tiene_imprimacion`, `consumo_imprimacion`, `consumo_pintura_kg`, `coste_unitario_pintura_eur_kg`, `coste_total_pintura_eur`, `coste_metodo`, `fecha_costeo`) VALUES
(42, '16032026132831', '', 4, 'm2', 23.26, '1015 Axalta', '-', '', 1000.00, 1000.00, 1.00, NULL, 0.00, 0, NULL, NULL, 0, 0.000, NULL, NULL, NULL, NULL, NULL),
(43, '16032026132831', '', 1, 'm2', 28.35, '1015 Axalta', '-', '', 2000.00, 1000.00, 1.00, NULL, 0.00, 0, NULL, NULL, 0, 0.000, NULL, NULL, NULL, NULL, NULL),
(44, '16032026161805', '', 1, 'ml', 20.00, '7016', '36/26', '', 3000.00, NULL, 1.00, NULL, 0.00, 1, NULL, 'reja', 1, 0.000, NULL, NULL, NULL, NULL, NULL),
(45, '16032026162617', '', 8, 'ml', 19.12, '9001', 'L658/26', '', 2000.00, NULL, 1.00, NULL, 0.00, 0, NULL, 'Balconera', 1, 0.000, NULL, NULL, NULL, NULL, NULL),
(46, '16032026195959', '', 1, 'm2', 28.35, '1009 M', '55', '', 1000.00, 1000.00, 1.00, NULL, 0.00, 0, NULL, 'Chapa Galvanizada 1*1*1', 1, 0.000, NULL, NULL, NULL, NULL, NULL),
(91, 'ORDEN-TEST-2024', 'mmtjv610viwjo28eeuo', 10, 'ud', 28.35, '7016', 'OBRA TEST', NULL, 2000.00, 1000.00, 1.50, NULL, 0.00, 1, NULL, 'CHAPA GALVANIZADA PRUEBA', 1, 0.000, NULL, NULL, NULL, NULL, NULL),
(93, 'ORDEN-TEST-2024', 'mmtjv610viwjo28eeuo', 2, 'ud', 23.26, '9010', 'OBRA TEST', NULL, 3000.00, 150.00, 0.80, NULL, 0.00, 1, NULL, 'CHAPA GALVANIZADA PRUEBA', 0, 0.000, NULL, NULL, NULL, NULL, NULL),
(94, 'ORDEN-TEST-2024', 'mmtjv610viwjo28eeuo', 1, 'ud', 23.26, '9005', 'RELLENO', NULL, 100.00, 100.00, 1.00, NULL, 0.00, 1, NULL, 'CHAPA GALVANIZADA PRUEBA', 0, 0.000, NULL, NULL, NULL, NULL, NULL),
(95, 'ORDEN-TEST-2024', 'mmtjv610viwjo28eeuo', 4, 'ud', 23.26, '9006', 'RELLENO', NULL, 1200.00, 400.00, 1.00, NULL, 0.00, 1, NULL, 'CHAPA GALVANIZADA PRUEBA', 0, 0.000, NULL, NULL, NULL, NULL, NULL),
(96, 'ORDEN-TEST-2024', 'mmtjv610viwjo28eeuo', 8, 'ud', 23.26, '7035', 'RELLENO', NULL, 800.00, 800.00, 1.00, NULL, 0.00, 1, NULL, 'CHAPA GALVANIZADA PRUEBA', 0, 0.000, NULL, NULL, NULL, NULL, NULL),
(98, 'ORDEN-TEST-2024', 'mmtjv610viwjo28eeuo', 6, 'ud', 23.26, '9003', 'RELLENO', NULL, 400.00, 400.00, 0.60, NULL, 0.00, 0, NULL, 'CHAPA GALVANIZADA PRUEBA', 0, 0.000, NULL, NULL, NULL, NULL, NULL),
(99, 'ORDEN-TEST-2024', 'mmtjv610viwjo28eeuo', 2, 'ud', 23.26, '5010', 'RELLENO', NULL, 1800.00, 200.00, 3.00, NULL, 0.00, 0, NULL, 'CHAPA GALVANIZADA PRUEBA', 0, 0.000, NULL, NULL, NULL, NULL, NULL),
(100, 'ORDEN-TEST-2024', 'mmtjv610viwjo28eeuo', 10, 'ud', 28.35, '9005', 'RELLENO', NULL, 1000.00, 50000.00, 1.50, NULL, 0.00, 0, NULL, 'CHAPA GALVANIZADA PRUEBA', 1, 0.000, NULL, NULL, NULL, NULL, NULL),
(101, 'ORDEN-TEST-2024', 'mmtjv610viwjo28eeuo', 3, 'ud', 28.35, '8019', 'FACHADA NORTE', NULL, 4500.00, 200.00, 1.20, NULL, 0.00, 0, NULL, 'CHAPA GALVANIZADA PRUEBA', 1, 0.000, NULL, NULL, NULL, NULL, NULL),
(102, 'ORDEN-TEST-2024', 'mmtjv610viwjo28eeuo', 25, 'ud', 23.26, '1009', 'ANCLAJES', NULL, 100.00, 100.00, 2.00, NULL, 0.00, 0, NULL, 'CHAPA GALVANIZADA PRUEBA', 0, 0.000, NULL, NULL, NULL, NULL, NULL),
(103, 'ORDEN-TEST-2024', 'mmtjv610viwjo28eeuo', 1, 'ud', 23.26, '9010', 'CUMBRERA', NULL, 6000.00, 1200.00, 1.00, NULL, 0.00, 1, NULL, 'CHAPA GALVANIZADA PRUEBA', 0, 0.000, NULL, NULL, NULL, NULL, NULL),
(104, 'ORDEN-TEST-2024', 'mmtjv610viwjo28eeuo', 12, 'ud', 23.26, '7035', 'PANELES SOLARES', NULL, 1500.00, 500.00, 1.50, NULL, 0.00, 0, NULL, 'CHAPA GALVANIZADA PRUEBA', 0, 0.000, NULL, NULL, NULL, NULL, NULL),
(105, 'ORDEN-TEST-2024', 'mmtjv610viwjo28eeuo', 5, 'ud', 28.35, '6005', 'CERRAMIENTO', NULL, 2200.00, 1100.00, 0.80, NULL, 0.00, 0, NULL, 'CHAPA GALVANIZADA PRUEBA', 1, 0.000, NULL, NULL, NULL, NULL, NULL),
(106, '18032026145059', '', 1, 'ml', 19.12, '1021', '-', NULL, 1000.00, NULL, 1.00, NULL, 0.00, 0, NULL, 'Chapa Galvanizada 1*1*1', 1, 0.300, NULL, NULL, NULL, NULL, NULL),
(107, '18032026145059', 'mmtjv610viwjo28eeuo-VAR-1', 1, 'ud', 12.00, '1050 M', '-', NULL, 100.00, 1000.00, 1.00, NULL, 0.00, 0, NULL, 'CHAPA GALVANIZADA PRUEBA', 0, 0.000, NULL, NULL, NULL, NULL, NULL),
(108, '18032026145059', 'mmtjv610viwjo28eeuo-VAR-2', 5, 'm2', 28.35, '8050 GOF', '-', NULL, 1000.00, 2000.00, 3.00, NULL, 0.00, 0, NULL, 'CHAPA GALVANIZADA PRUEBA', 1, 2.400, NULL, NULL, NULL, NULL, NULL),
(109, '18032026145059', 'mmtjv610viwjo28eeuo-VAR-3', 1, 'm2', 23.26, '9050 TXT', '-', NULL, 1000.00, 1000.00, 1.00, NULL, 0.00, 0, NULL, 'CHAPA GALVANIZADA PRUEBA', 0, 0.000, NULL, NULL, NULL, NULL, NULL),
(110, '18032026145059', 'mmtjv610viwjo28eeuo-VAR-4', 1, 'ml', 15.38, 'NOIR', '-', NULL, 4000.00, NULL, 4.00, NULL, 0.00, 0, NULL, 'CHAPA GALVANIZADA PRUEBA', 0, 0.000, NULL, NULL, NULL, NULL, NULL),
(111, '18032026152025', '', 1, 'm2', 28.35, '1021', '-', NULL, 1000.00, 1000.00, 5.00, NULL, 0.00, 1, NULL, 'Chapa Galvanizada 1*1*1', 1, 0.240, NULL, NULL, NULL, NULL, NULL),
(112, '18032026152916', '', 1, 'ml', 15.38, 'NOIR 200', '-', NULL, 1000.00, NULL, 1.00, NULL, 0.00, 0, NULL, 'Chapa Galvanizada 1*1*1', 0, 0.000, NULL, NULL, NULL, NULL, NULL),
(113, '19032026135140', '', 1, 'ml', 19.12, '9003', '-', NULL, 1000.00, NULL, 1.00, NULL, 0.00, 0, NULL, 'Chapa Galvanizada 1*1*1', 1, 0.300, NULL, NULL, NULL, NULL, NULL),
(114, '20032026120931', NULL, 1, 'ud', 12.00, '1015 M', '-', NULL, NULL, NULL, 1.00, NULL, 0.00, 0, NULL, 'Chapa Galvanizada 1*1*1', 0, 0.000, NULL, NULL, NULL, NULL, NULL),
(115, '20032026121854', 'mmtjv610viwjo28eeuo-VAR-5', 1, 'ud', 12.00, '8014', '-', NULL, 0.00, 0.00, 1.00, NULL, 0.00, 0, NULL, 'CHAPA GALVANIZADA PRUEBA', 0, 0.000, NULL, NULL, NULL, NULL, NULL),
(116, '20032026191857', 'mmtjv610viwjo28eeuo-VAR-6', 2, 'ud', 28.35, '1015', '-', NULL, 10000.00, 1212.00, 5.00, NULL, 0.00, 0, NULL, 'CHAPA GALVANIZADA PRUEBA', 1, 5.818, NULL, NULL, NULL, NULL, NULL),
(118, '20032026193744', 'mmtjv610viwjo28eeuo-VAR-8', 1, 'ud', 23.26, '1015', 'Obra test', NULL, 1000.00, 1000.00, 0.01, NULL, 0.00, 0, NULL, 'CHAPA GALVANIZADA PRUEBA', 0, 0.000, NULL, NULL, NULL, NULL, NULL),
(119, '20032026214339', NULL, 5, 'ud', 12.00, '1015 GOF Genérica', '-', NULL, NULL, NULL, 1.00, NULL, 0.00, 0, NULL, 'Chapa Galvanizada 1*1*1', 0, 0.000, 0.600, NULL, NULL, NULL, NULL),
(120, '20032026214956', NULL, 2, 'ud', 12.00, '1015 Axalta -', '2', NULL, NULL, NULL, 1.00, NULL, 0.00, 0, NULL, 'Chapa Galvanizada 1*1*1', 0, 0.000, 0.240, NULL, NULL, NULL, NULL),
(124, '20032026225245', NULL, 1, 'ud', 12.00, 'SIN COLOR SISTEMA', '-', NULL, 1000.00, 100.00, 1.00, NULL, 0.00, 0, NULL, 'Chapa Galvanizada 1*1*1', 0, 0.000, 0.024, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pintura`
--

CREATE TABLE `pintura` (
  `id` varchar(255) NOT NULL,
  `ral` varchar(100) NOT NULL,
  `stock` decimal(10,2) DEFAULT '0.00',
  `marca` varchar(255) DEFAULT NULL,
  `rendimiento_kg_m2` decimal(10,3) DEFAULT '0.150'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `pintura`
--

INSERT INTO `pintura` (`id`, `ral`, `stock`, `marca`, `rendimiento_kg_m2`) VALUES
('9001', '9002', 30.00, 'AXALTA', 0.150),
('9002', '9002', 22.00, 'VALSPAR', 0.150),
('9003', '9003', 2.00, 'BESA', 0.150),
('9004', '9004', 50.00, 'PPG', 0.150),
('9011', '9011', 3.00, 'TIGER', 0.150),
('9012', '9012', 10.00, 'JOTUN', 0.150),
('9013', '9013', 2.00, 'VALSPAR', 0.150),
('9014', '9014', 40.00, 'BESA', 0.150),
('9999', 'Sin Especificar', 999999.00, 'SISTEMA', 0.150),
('IMP', 'Imprimacion', 40.94, 'Titan', 0.150),
('mmt610hs93efem0gxa', '1015 Axalta', NULL, '-', 0.150),
('mmtjv610viwjo28eeuo', '2005 M', NULL, 'titan', 0.150),
('mmuv3tftcdwuo', '1015 GOFRADO', 50.00, 'Titan', 0.150),
('mmw4miwx7k35kkj8tlv', '6003 M', -0.02, 'Genérica', 0.150),
('mmw4mj1vklu7j1nzb7', '1015 GOF', -2.40, 'Genérica', 0.150),
('mmw4mj91djdq6aot5t8', '9001 TXT', 49.76, 'Genérica', 0.150),
('mmw4mjdzi0avxjhwfoq', 'NOIR 100', 53.80, '-', 0.150),
('mmw54v9tnmkix3r0rqp', 'NOIR 200', 49.70, 'Adapta', 0.150),
('mmzfrdcrsf2vtxnleb', '8005 M', NULL, 'azkonoble', 0.150),
('p01', '7016', 49.10, 'AkzoNobel', 0.150),
('p02', '9010', 120.50, 'Axalta', 0.150),
('p03', '9005', 15.00, 'Tiger', 0.150),
('p04', '7035', 8.25, 'AkzoNobel', 0.150),
('p05', '6005', 45.00, 'Jotun', 0.150),
('p06', '3000', 3.50, 'Axalta', 0.150),
('p07', '5010 sat', 25.00, 'Tiger', 0.150),
('p08', '8014', -0.12, 'AkzoNobel', 0.150),
('p09', '7015 mate', 60.00, 'Jotun', 0.150),
('p10', '1015 m', 11.88, 'Axalta', 0.150),
('p11', '9006', 100.00, 'AkzoNobel', 0.150),
('p12', '9007', 35.00, 'Tiger', 0.150),
('p13', '7021 txt', 30.75, 'Jotun', 0.150),
('p14', '1021', 25.66, 'Axalta', 0.150),
('p15', '7040 TXT', NULL, 'Tiger', 0.150),
('PI-9010', '9010', 50.00, 'Axalta', 0.120),
('PI-PEND', 'PENDIENTE', 999.99, 'SISTEMA', 0.000),
('PI-SIN-COLOR', 'SIN COLOR', 999.99, 'SISTEMA', 0.000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pintura_compras`
--

CREATE TABLE `pintura_compras` (
  `id` int NOT NULL,
  `pintura_id` varchar(255) CHARACTER SET latin1 COLLATE latin1_spanish_ci NOT NULL,
  `fecha_compra` datetime DEFAULT CURRENT_TIMESTAMP,
  `formato_kg` decimal(10,2) DEFAULT NULL,
  `cantidad_cajas` int DEFAULT '1',
  `precio_total` decimal(10,2) DEFAULT NULL,
  `precio_total_caja` decimal(10,2) DEFAULT NULL,
  `precio_kg_calculado` decimal(10,2) DEFAULT NULL,
  `proveedor` varchar(255) CHARACTER SET latin1 COLLATE latin1_spanish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `pintura_compras`
--

INSERT INTO `pintura_compras` (`id`, `pintura_id`, `fecha_compra`, `formato_kg`, `cantidad_cajas`, `precio_total`, `precio_total_caja`, `precio_kg_calculado`, `proveedor`) VALUES
(1, 'p01', '2026-01-01 09:00:00', 25.00, 1, NULL, 250.00, 10.00, 'Antiguo'),
(2, 'p01', '2026-02-10 10:00:00', 25.00, 1, NULL, 300.00, 12.00, 'Axalta'),
(3, 'p01', '2026-02-25 11:30:00', 25.00, 1, NULL, 312.50, 12.50, 'Titan'),
(4, 'p01', '2026-03-05 08:45:00', 25.00, 1, NULL, 325.00, 13.00, 'Jotun'),
(5, 'p01', '2026-03-12 14:00:00', 25.00, 1, NULL, 337.50, 13.50, 'AkzoNobel'),
(6, 'p01', '2026-03-17 16:30:00', 20.00, 1, NULL, 290.00, 14.50, 'Ultima Compra'),
(7, 'p02', '2026-02-01 08:00:00', 20.00, 1, NULL, 180.00, 9.00, 'Jotun'),
(8, 'p02', '2026-03-01 09:00:00', 20.00, 1, NULL, 190.00, 9.50, 'Jotun'),
(9, 'p02', '2026-03-15 12:00:00', 20.00, 1, NULL, 200.00, 10.00, 'Axalta'),
(10, 'p03', '2026-01-15 10:00:00', 25.00, 1, NULL, 375.00, 15.00, 'Axalta'),
(11, 'p03', '2026-03-10 11:00:00', 25.00, 1, NULL, 350.00, 14.00, 'Titan'),
(12, 'p04', '2026-03-16 09:30:00', 20.00, 1, NULL, 240.00, 12.00, 'AkzoNobel'),
(13, 'p14', '2026-03-17 18:16:21', NULL, 1, NULL, 240.00, 9.60, 'AkzoNobel'),
(14, 'p01', '2026-02-01 09:00:00', 25.00, 1, NULL, 225.00, 9.00, 'Jotun'),
(15, 'p01', '2026-03-01 10:00:00', 25.00, 1, NULL, 237.50, 9.50, 'Jotun'),
(16, 'p01', '2026-03-15 11:30:00', 25.00, 1, NULL, 250.00, 10.00, 'Axalta'),
(17, 'p01', '2026-03-10 00:00:00', 25.00, 1, NULL, 257.38, 10.15, 'Titan'),
(18, 'p01', '2026-03-03 00:00:00', 25.00, 1, NULL, 322.07, 11.95, 'Axalta'),
(19, 'p01', '2026-02-24 00:00:00', 25.00, 1, NULL, 277.90, 12.72, 'Titan'),
(20, 'p01', '2026-02-17 00:00:00', 25.00, 1, NULL, 281.56, 11.15, 'Axalta'),
(21, 'p01', '2026-02-10 00:00:00', 25.00, 1, NULL, 298.59, 10.28, 'Titan'),
(22, 'p01', '2026-02-03 00:00:00', 25.00, 1, NULL, 289.19, 11.00, 'Axalta'),
(23, 'p01', '2026-01-27 00:00:00', 25.00, 1, NULL, 257.26, 11.46, 'Titan'),
(24, 'p01', '2026-01-20 00:00:00', 25.00, 1, NULL, 260.29, 10.69, 'Axalta'),
(25, 'p01', '2026-01-13 00:00:00', 25.00, 1, NULL, 305.10, 12.96, 'Titan'),
(26, 'p01', '2026-01-06 00:00:00', 25.00, 1, NULL, 304.30, 11.99, 'Axalta'),
(27, 'p01', '2025-12-30 00:00:00', 25.00, 1, NULL, 260.73, 12.18, 'Titan'),
(28, 'p01', '2025-12-23 00:00:00', 25.00, 1, NULL, 265.29, 12.52, 'Axalta'),
(29, 'p01', '2025-12-16 00:00:00', 25.00, 1, NULL, 293.86, 11.22, 'Titan'),
(30, 'p01', '2025-12-09 00:00:00', 25.00, 1, NULL, 270.70, 10.48, 'Axalta'),
(31, 'p01', '2025-12-02 00:00:00', 25.00, 1, NULL, 323.49, 11.24, 'Titan'),
(32, 'p01', '2025-11-25 00:00:00', 25.00, 1, NULL, 260.12, 11.29, 'Axalta'),
(33, 'p01', '2025-11-18 00:00:00', 25.00, 1, NULL, 305.80, 11.29, 'Titan'),
(34, 'p01', '2025-11-11 00:00:00', 25.00, 1, NULL, 319.17, 10.96, 'Axalta'),
(35, 'p01', '2025-11-04 00:00:00', 25.00, 1, NULL, 312.03, 10.54, 'Titan'),
(36, 'p01', '2025-10-28 00:00:00', 25.00, 1, NULL, 281.07, 11.60, 'Axalta'),
(37, 'p01', '2025-10-21 00:00:00', 25.00, 1, NULL, 282.04, 11.60, 'Titan'),
(38, 'p01', '2025-10-14 00:00:00', 25.00, 1, NULL, 279.17, 11.03, 'Axalta'),
(39, 'p01', '2025-10-07 00:00:00', 25.00, 1, NULL, 290.94, 12.11, 'Titan'),
(40, 'p01', '2025-09-30 00:00:00', 25.00, 1, NULL, 315.31, 10.75, 'Axalta'),
(41, 'p01', '2025-09-23 00:00:00', 25.00, 1, NULL, 297.39, 11.24, 'Titan'),
(42, 'p01', '2025-09-16 00:00:00', 25.00, 1, NULL, 262.57, 11.80, 'Axalta'),
(43, 'p01', '2025-09-09 00:00:00', 25.00, 1, NULL, 287.33, 12.06, 'Titan'),
(44, 'p01', '2025-09-02 00:00:00', 25.00, 1, NULL, 321.09, 12.02, 'Axalta'),
(45, 'p01', '2025-08-26 00:00:00', 25.00, 1, NULL, 289.81, 11.89, 'Titan'),
(46, 'p01', '2025-08-19 00:00:00', 25.00, 1, NULL, 291.50, 12.64, 'Axalta'),
(47, 'p01', '2025-08-12 00:00:00', 25.00, 1, NULL, 305.18, 10.12, 'Titan'),
(48, 'p01', '2025-08-05 00:00:00', 25.00, 1, NULL, 324.89, 12.61, 'Axalta'),
(49, 'p01', '2025-07-29 00:00:00', 25.00, 1, NULL, 276.27, 10.43, 'Titan'),
(50, 'p01', '2025-07-22 00:00:00', 25.00, 1, NULL, 300.10, 12.73, 'Axalta'),
(51, 'p01', '2025-07-15 00:00:00', 25.00, 1, NULL, 290.56, 12.93, 'Titan'),
(52, 'p01', '2025-07-08 00:00:00', 25.00, 1, NULL, 269.64, 11.14, 'Axalta'),
(53, 'p01', '2025-07-01 00:00:00', 25.00, 1, NULL, 258.17, 11.22, 'Titan'),
(54, 'p01', '2025-06-24 00:00:00', 25.00, 1, NULL, 303.40, 11.01, 'Axalta'),
(55, 'p01', '2025-06-17 00:00:00', 25.00, 1, NULL, 291.17, 12.20, 'Titan'),
(56, 'p01', '2025-06-10 00:00:00', 25.00, 1, NULL, 251.60, 12.72, 'Axalta'),
(57, 'p01', '2025-06-03 00:00:00', 25.00, 1, NULL, 284.86, 11.82, 'Titan'),
(58, 'p01', '2025-05-27 00:00:00', 25.00, 1, NULL, 297.99, 11.14, 'Axalta'),
(59, 'p01', '2025-05-20 00:00:00', 25.00, 1, NULL, 323.04, 12.20, 'Titan'),
(60, 'p01', '2025-05-13 00:00:00', 25.00, 1, NULL, 305.86, 11.57, 'Axalta'),
(61, 'p01', '2025-05-06 00:00:00', 25.00, 1, NULL, 278.98, 11.08, 'Titan'),
(62, 'p01', '2025-04-29 00:00:00', 25.00, 1, NULL, 297.87, 10.34, 'Axalta'),
(63, 'p01', '2025-04-22 00:00:00', 25.00, 1, NULL, 298.68, 12.72, 'Titan'),
(64, 'p01', '2025-04-15 00:00:00', 25.00, 1, NULL, 294.12, 10.66, 'Axalta'),
(65, 'p01', '2025-04-08 00:00:00', 25.00, 1, NULL, 275.18, 10.06, 'Titan'),
(66, 'p01', '2025-04-01 00:00:00', 25.00, 1, NULL, 256.38, 11.11, 'Axalta'),
(67, '', '2026-03-10 00:00:00', 25.00, 1, NULL, 261.04, 12.40, 'Titan'),
(68, '', '2026-03-03 00:00:00', 25.00, 1, NULL, 291.67, 11.14, 'Axalta'),
(69, '', '2026-02-24 00:00:00', 25.00, 1, NULL, 267.39, 10.06, 'Titan'),
(70, '', '2026-02-17 00:00:00', 25.00, 1, NULL, 280.39, 12.90, 'Axalta'),
(71, '', '2026-02-10 00:00:00', 25.00, 1, NULL, 295.82, 10.48, 'Titan'),
(72, '', '2026-02-03 00:00:00', 25.00, 1, NULL, 322.12, 10.99, 'Axalta'),
(73, '', '2026-01-27 00:00:00', 25.00, 1, NULL, 307.97, 12.61, 'Titan'),
(74, '', '2026-01-20 00:00:00', 25.00, 1, NULL, 252.38, 11.64, 'Axalta'),
(75, '', '2026-01-13 00:00:00', 25.00, 1, NULL, 298.38, 11.74, 'Titan'),
(76, '', '2026-01-06 00:00:00', 25.00, 1, NULL, 322.92, 10.35, 'Axalta'),
(77, '', '2025-12-30 00:00:00', 25.00, 1, NULL, 300.06, 12.96, 'Titan'),
(78, '', '2025-12-23 00:00:00', 25.00, 1, NULL, 319.86, 12.09, 'Axalta'),
(79, '', '2025-12-16 00:00:00', 25.00, 1, NULL, 301.73, 11.07, 'Titan'),
(80, '', '2025-12-09 00:00:00', 25.00, 1, NULL, 304.13, 11.60, 'Axalta'),
(81, '', '2025-12-02 00:00:00', 25.00, 1, NULL, 287.96, 12.78, 'Titan'),
(82, '', '2025-11-25 00:00:00', 25.00, 1, NULL, 259.13, 12.47, 'Axalta'),
(83, '', '2025-11-18 00:00:00', 25.00, 1, NULL, 306.80, 10.94, 'Titan'),
(84, '', '2025-11-11 00:00:00', 25.00, 1, NULL, 272.09, 11.60, 'Axalta'),
(85, '', '2025-11-04 00:00:00', 25.00, 1, NULL, 308.46, 10.90, 'Titan'),
(86, '', '2025-10-28 00:00:00', 25.00, 1, NULL, 261.93, 12.69, 'Axalta'),
(87, '', '2025-10-21 00:00:00', 25.00, 1, NULL, 250.56, 11.04, 'Titan'),
(88, '', '2025-10-14 00:00:00', 25.00, 1, NULL, 303.29, 11.54, 'Axalta'),
(89, '', '2025-10-07 00:00:00', 25.00, 1, NULL, 282.38, 11.86, 'Titan'),
(90, '', '2025-09-30 00:00:00', 25.00, 1, NULL, 310.71, 10.55, 'Axalta'),
(91, '', '2025-09-23 00:00:00', 25.00, 1, NULL, 287.05, 12.75, 'Titan'),
(92, '', '2025-09-16 00:00:00', 25.00, 1, NULL, 257.63, 12.27, 'Axalta'),
(93, '', '2025-09-09 00:00:00', 25.00, 1, NULL, 286.45, 10.47, 'Titan'),
(94, '', '2025-09-02 00:00:00', 25.00, 1, NULL, 273.98, 10.40, 'Axalta'),
(95, '', '2025-08-26 00:00:00', 25.00, 1, NULL, 302.46, 10.31, 'Titan'),
(96, '', '2025-08-19 00:00:00', 25.00, 1, NULL, 281.02, 12.28, 'Axalta'),
(97, '', '2025-08-12 00:00:00', 25.00, 1, NULL, 292.16, 11.59, 'Titan'),
(98, '', '2025-08-05 00:00:00', 25.00, 1, NULL, 321.91, 10.62, 'Axalta'),
(99, '', '2025-07-29 00:00:00', 25.00, 1, NULL, 261.78, 10.50, 'Titan'),
(100, '', '2025-07-22 00:00:00', 25.00, 1, NULL, 276.67, 10.85, 'Axalta'),
(101, '', '2025-07-15 00:00:00', 25.00, 1, NULL, 275.78, 12.62, 'Titan'),
(102, '', '2025-07-08 00:00:00', 25.00, 1, NULL, 274.75, 10.10, 'Axalta'),
(103, '', '2025-07-01 00:00:00', 25.00, 1, NULL, 263.23, 12.35, 'Titan'),
(104, '', '2025-06-24 00:00:00', 25.00, 1, NULL, 278.53, 11.67, 'Axalta'),
(105, '', '2025-06-17 00:00:00', 25.00, 1, NULL, 298.03, 11.60, 'Titan'),
(106, '', '2025-06-10 00:00:00', 25.00, 1, NULL, 305.88, 10.38, 'Axalta'),
(107, '', '2025-06-03 00:00:00', 25.00, 1, NULL, 279.37, 11.75, 'Titan'),
(108, '', '2025-05-27 00:00:00', 25.00, 1, NULL, 305.10, 12.78, 'Axalta'),
(109, '', '2025-05-20 00:00:00', 25.00, 1, NULL, 282.62, 11.17, 'Titan'),
(110, '', '2025-05-13 00:00:00', 25.00, 1, NULL, 298.92, 10.26, 'Axalta'),
(111, '', '2025-05-06 00:00:00', 25.00, 1, NULL, 285.92, 10.40, 'Titan'),
(112, '', '2025-04-29 00:00:00', 25.00, 1, NULL, 267.17, 12.24, 'Axalta'),
(113, '', '2025-04-22 00:00:00', 25.00, 1, NULL, 252.90, 12.87, 'Titan'),
(114, '', '2025-04-15 00:00:00', 25.00, 1, NULL, 300.54, 11.49, 'Axalta'),
(115, '', '2025-04-08 00:00:00', 25.00, 1, NULL, 284.14, 12.37, 'Titan'),
(116, '', '2025-04-01 00:00:00', 25.00, 1, NULL, 293.80, 11.65, 'Axalta'),
(200, 'p01', '2026-01-05 08:00:00', 25.00, 2, NULL, 250.00, 10.00, 'AkzoNobel'),
(201, 'p02', '2026-01-08 09:00:00', 20.00, 2, NULL, 180.00, 9.00, 'Axalta'),
(202, 'IMP', '2026-01-10 10:00:00', 25.00, 2, NULL, 125.00, 5.00, 'Titan'),
(203, 'p03', '2026-01-15 08:00:00', 25.00, 1, NULL, 350.00, 14.00, 'Tiger'),
(204, 'p05', '2026-01-18 09:00:00', 25.00, 1, NULL, 275.00, 11.00, 'Jotun'),
(205, 'p11', '2026-01-20 08:00:00', 25.00, 2, NULL, 175.00, 7.00, 'AkzoNobel'),
(210, 'p01', '2026-02-03 08:00:00', 25.00, 2, NULL, 275.00, 11.00, 'AkzoNobel'),
(211, 'IMP', '2026-02-08 10:00:00', 25.00, 2, NULL, 130.00, 5.20, 'Titan'),
(212, 'p02', '2026-02-10 09:00:00', 20.00, 2, NULL, 190.00, 9.50, 'Axalta'),
(213, 'p04', '2026-02-15 09:00:00', 20.00, 2, NULL, 230.00, 11.50, 'AkzoNobel'),
(214, 'p11', '2026-02-18 08:00:00', 25.00, 2, NULL, 180.00, 7.20, 'AkzoNobel'),
(215, 'p14', '2026-02-20 08:00:00', 25.00, 2, NULL, 240.00, 9.60, 'Axalta'),
(220, 'IMP', '2026-03-02 08:00:00', 25.00, 2, NULL, 132.00, 5.28, 'Titan'),
(221, 'p05', '2026-03-08 09:00:00', 25.00, 1, NULL, 286.00, 11.44, 'Jotun'),
(222, 'p11', '2026-03-10 08:00:00', 25.00, 2, NULL, 185.00, 7.40, 'AkzoNobel'),
(223, 'p12', '2026-03-19 12:46:00', NULL, 2, NULL, 240.18, 16.01, 'Tiger'),
(224, 'mmw4mj91djdq6aot5t8', '2026-03-19 13:12:03', NULL, 1, NULL, 0.01, 0.00, 'Generica'),
(225, 'mmw4mj91djdq6aot5t8', '2026-03-19 13:13:06', NULL, 1, NULL, 254.00, 10.16, 'Generico'),
(226, 'mmw4mjdzi0avxjhwfoq', '2026-03-19 13:13:06', NULL, 2, NULL, 143.18, 9.54, 'Tiger'),
(227, 'mmw54v9tnmkix3r0rqp', '2026-03-19 13:13:35', NULL, 1, NULL, 350.85, 14.03, 'Tiger'),
(228, 'mmw54v9tnmkix3r0rqp', '2026-03-19 13:15:06', NULL, 1, NULL, 356.35, 14.25, 'Azkonoble'),
(229, 'mmw4mjdzi0avxjhwfoq', '2026-03-19 13:17:55', NULL, 1, NULL, 298.65, 11.95, 'Titan'),
(20001, '9002', '2025-11-28 00:00:00', 25.00, 2, 1000.00, NULL, 20.00, 'ProveedorA'),
(20002, '9002', '2025-12-05 00:00:00', 25.00, 2, 1100.00, NULL, 22.00, 'ProveedorA'),
(20003, '9002', '2025-12-12 00:00:00', 25.00, 2, 1200.00, NULL, 24.00, 'ProveedorA'),
(20004, '9002', '2025-12-19 00:00:00', 25.00, 2, 1300.00, NULL, 26.00, 'ProveedorA'),
(20005, '9003', '2025-12-01 00:00:00', 25.00, 1, 500.00, NULL, 20.00, 'ProveedorB'),
(20006, '9004', '2025-12-05 00:00:00', 25.00, 1, 400.00, NULL, 16.00, 'ProveedorC'),
(30001, '9001', '2025-11-25 00:00:00', 25.00, 2, 500.00, NULL, 10.00, 'ProveedorA'),
(30002, '9002', '2025-12-05 00:00:00', 25.00, 2, 1100.00, NULL, 22.00, 'ProveedorA'),
(30003, '9002', '2025-12-12 00:00:00', 25.00, 2, 1200.00, NULL, 24.00, 'ProveedorA'),
(30004, '9002', '2025-12-19 00:00:00', 25.00, 2, 1300.00, NULL, 26.00, 'ProveedorA'),
(30005, '9003', '2025-12-01 00:00:00', 25.00, 1, 500.00, NULL, 20.00, 'ProveedorB'),
(30006, '9004', '2025-12-05 00:00:00', 25.00, 1, 400.00, NULL, 16.00, 'ProveedorC'),
(130001, '9001', '2025-11-25 00:00:00', 25.00, 2, 500.00, NULL, 10.00, 'ProveedorA'),
(130002, '9002', '2025-12-05 00:00:00', 25.00, 2, 1100.00, NULL, 22.00, 'ProveedorA'),
(130003, '9002', '2025-12-12 00:00:00', 25.00, 2, 1200.00, NULL, 24.00, 'ProveedorA'),
(130004, '9002', '2025-12-19 00:00:00', 25.00, 2, 1300.00, NULL, 26.00, 'ProveedorA'),
(130005, '9003', '2025-12-01 00:00:00', 25.00, 1, 500.00, NULL, 20.00, 'ProveedorB'),
(130006, '9004', '2025-12-05 00:00:00', 25.00, 1, 400.00, NULL, 16.00, 'ProveedorC'),
(130011, '9011', '2025-11-20 00:00:00', 20.00, 1, 300.00, NULL, 15.00, 'ProveedorB'),
(130012, '9012', '2025-12-03 00:00:00', 10.00, 1, 100.00, NULL, 10.00, 'ProveedorC'),
(130013, '9012', '2025-12-10 00:00:00', 10.00, 1, 120.00, NULL, 12.00, 'ProveedorC'),
(130014, '9012', '2025-12-17 00:00:00', 10.00, 1, 140.00, NULL, 14.00, 'ProveedorC'),
(130015, '9013', '2025-12-02 00:00:00', 15.00, 1, 180.00, NULL, 12.00, 'ProveedorD'),
(130016, '9014', '2025-12-06 00:00:00', 20.00, 2, 320.00, NULL, 8.00, 'ProveedorE'),
(130017, '9001', '2026-03-20 11:06:39', NULL, 1, NULL, 250.85, 10.03, 'Axalta'),
(130018, '9003', '2026-03-20 22:36:17', NULL, 1, NULL, 235.00, 235.00, 'Axalta');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pintura_stock_lotes_fifo`
--

CREATE TABLE `pintura_stock_lotes_fifo` (
  `id` bigint UNSIGNED NOT NULL,
  `pintura_id` varchar(255) NOT NULL,
  `compra_id` int DEFAULT NULL,
  `fecha_entrada` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `proveedor` varchar(255) DEFAULT NULL,
  `cantidad_inicial_kg` decimal(12,3) NOT NULL,
  `cantidad_restante_kg` decimal(12,3) NOT NULL,
  `coste_unitario_eur_kg` decimal(12,4) NOT NULL,
  `estado` enum('ABIERTO','CERRADO') NOT NULL DEFAULT 'ABIERTO',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `pintura_stock_lotes_fifo`
--

INSERT INTO `pintura_stock_lotes_fifo` (`id`, `pintura_id`, `compra_id`, `fecha_entrada`, `proveedor`, `cantidad_inicial_kg`, `cantidad_restante_kg`, `coste_unitario_eur_kg`, `estado`, `created_at`, `updated_at`) VALUES
(1, 'p12', 223, '2026-03-19 12:46:00', 'Tiger', 30.000, 30.000, 16.0100, 'ABIERTO', '2026-03-19 11:46:00', '2026-03-19 11:46:00'),
(2, 'mmw4mj91djdq6aot5t8', 224, '2026-03-19 13:12:03', 'Generica', 25.000, 25.000, 0.0000, 'ABIERTO', '2026-03-19 12:12:02', '2026-03-19 12:12:02'),
(3, 'mmw4mj91djdq6aot5t8', 225, '2026-03-19 13:13:06', 'Generico', 25.000, 25.000, 10.1600, 'ABIERTO', '2026-03-19 12:13:06', '2026-03-19 12:13:06'),
(4, 'mmw4mjdzi0avxjhwfoq', 226, '2026-03-19 13:13:06', 'Tiger', 30.000, 30.000, 9.5400, 'ABIERTO', '2026-03-19 12:13:06', '2026-03-19 12:13:06'),
(5, 'mmw54v9tnmkix3r0rqp', 227, '2026-03-19 13:13:35', 'Tiger', 25.000, 25.000, 14.0300, 'ABIERTO', '2026-03-19 12:13:34', '2026-03-19 12:13:34'),
(6, 'mmw54v9tnmkix3r0rqp', 228, '2026-03-19 13:15:06', 'Azkonoble', 25.000, 25.000, 14.2500, 'ABIERTO', '2026-03-19 12:15:06', '2026-03-19 12:15:06'),
(7, 'mmw4mjdzi0avxjhwfoq', 229, '2026-03-19 13:17:55', 'Titan', 25.000, 25.000, 11.9500, 'ABIERTO', '2026-03-19 12:17:54', '2026-03-19 12:17:54'),
(8, '9001', 130017, '2026-03-20 11:06:39', 'Axalta', 25.000, 25.000, 10.0300, 'ABIERTO', '2026-03-20 10:06:39', '2026-03-20 10:06:39'),
(9, '9003', 130018, '2026-03-20 22:36:17', 'Axalta', 1.000, 1.000, 235.0000, 'ABIERTO', '2026-03-20 21:36:17', '2026-03-20 21:36:17');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pintura_stock_movimientos`
--

CREATE TABLE `pintura_stock_movimientos` (
  `id` bigint UNSIGNED NOT NULL,
  `pedido_id` varchar(32) DEFAULT NULL,
  `pedido_linea_id` bigint UNSIGNED DEFAULT NULL,
  `pintura_id` varchar(255) NOT NULL,
  `ral_snapshot` varchar(120) DEFAULT NULL,
  `tipo` enum('ENTRADA','SALIDA','AJUSTE') NOT NULL,
  `cantidad_kg` decimal(12,3) NOT NULL,
  `stock_anterior_kg` decimal(12,3) NOT NULL,
  `stock_nuevo_kg` decimal(12,3) NOT NULL,
  `coste_unitario_eur_kg` decimal(12,4) DEFAULT NULL,
  `coste_total_eur` decimal(12,4) DEFAULT NULL,
  `origen` varchar(50) DEFAULT 'pedido',
  `observaciones` varchar(255) DEFAULT NULL,
  `usuario` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `pintura_stock_movimientos`
--

INSERT INTO `pintura_stock_movimientos` (`id`, `pedido_id`, `pedido_linea_id`, `pintura_id`, `ral_snapshot`, `tipo`, `cantidad_kg`, `stock_anterior_kg`, `stock_nuevo_kg`, `coste_unitario_eur_kg`, `coste_total_eur`, `origen`, `observaciones`, `usuario`, `created_at`) VALUES
(1, '18032026145059', 106, 'p14', '1021', 'SALIDA', 0.300, 26.200, 25.900, 9.6000, 2.8800, 'pedido_transaccional', 'COLOR', NULL, '2026-03-18 14:18:27'),
(2, '18032026145059', 106, 'IMP', 'Imprimacion', 'SALIDA', 0.300, 50.000, 49.700, 0.0000, 0.0000, 'pedido_transaccional', 'IMPRIMACION', NULL, '2026-03-18 14:18:27'),
(3, '18032026145059', 107, 'mmw4miwx7k35kkj8tlv', '1050 M', 'SALIDA', 0.024, 0.000, -0.024, 0.0000, 0.0000, 'pedido_transaccional', 'COLOR', NULL, '2026-03-18 14:18:27'),
(4, '18032026145059', 108, 'mmw4mj1vklu7j1nzb7', '8050 GOF', 'SALIDA', 2.400, 0.000, -2.400, 0.0000, 0.0000, 'pedido_transaccional', 'COLOR', NULL, '2026-03-18 14:18:27'),
(5, '18032026145059', 108, 'IMP', 'Imprimacion', 'SALIDA', 2.400, 49.700, 47.300, 0.0000, 0.0000, 'pedido_transaccional', 'IMPRIMACION', NULL, '2026-03-18 14:18:27'),
(6, '18032026145059', 109, 'mmw4mj91djdq6aot5t8', '9050 TXT', 'SALIDA', 0.240, 0.000, -0.240, 0.0000, 0.0000, 'pedido_transaccional', 'COLOR', NULL, '2026-03-18 14:18:27'),
(7, '18032026145059', 110, 'mmw4mjdzi0avxjhwfoq', 'NOIR', 'SALIDA', 1.200, 0.000, -1.200, 0.0000, 0.0000, 'pedido_transaccional', 'COLOR', NULL, '2026-03-18 14:18:28'),
(8, '18032026152025', 111, 'p14', '1021', 'SALIDA', 0.240, 25.900, 25.660, 9.6000, 2.3040, 'pedido_transaccional', 'COLOR', NULL, '2026-03-18 14:21:07'),
(9, '18032026152025', 111, 'IMP', 'Imprimacion', 'SALIDA', 0.240, 47.300, 47.060, 0.0000, 0.0000, 'pedido_transaccional', 'IMPRIMACION', NULL, '2026-03-18 14:21:07'),
(10, '18032026152916', 112, 'mmw54v9tnmkix3r0rqp', 'NOIR 200', 'SALIDA', 0.300, 0.000, -0.300, 0.0000, 0.0000, 'pedido_transaccional', 'COLOR', NULL, '2026-03-18 14:32:43'),
(300, NULL, NULL, 'p01', '7016', 'ENTRADA', 50.000, 200.000, 250.000, 10.0000, 500.0000, 'COMPRA', 'Seed ene', NULL, '2026-01-05 07:00:00'),
(301, NULL, NULL, 'p02', '9010', 'ENTRADA', 40.000, 200.000, 240.000, 9.0000, 360.0000, 'COMPRA', 'Seed ene', NULL, '2026-01-08 08:00:00'),
(302, NULL, NULL, 'IMP', 'Imprimacion', 'ENTRADA', 50.000, 200.000, 250.000, 5.0000, 250.0000, 'COMPRA', 'Seed ene', NULL, '2026-01-10 09:00:00'),
(303, NULL, NULL, 'p03', '9005', 'ENTRADA', 25.000, 100.000, 125.000, 14.0000, 350.0000, 'COMPRA', 'Seed ene', NULL, '2026-01-15 07:00:00'),
(304, NULL, NULL, 'p05', '6005', 'ENTRADA', 25.000, 100.000, 125.000, 11.0000, 275.0000, 'COMPRA', 'Seed ene', NULL, '2026-01-18 08:00:00'),
(305, NULL, NULL, 'p11', '9006', 'ENTRADA', 50.000, 100.000, 150.000, 7.0000, 350.0000, 'COMPRA', 'Seed ene', NULL, '2026-01-20 07:00:00'),
(306, NULL, NULL, 'p01', '7016', 'SALIDA', 8.000, 250.000, 242.000, 10.0000, 80.0000, 'PEDIDO', 'Seed ene', NULL, '2026-01-07 08:00:00'),
(307, NULL, NULL, 'p02', '9010', 'SALIDA', 6.000, 240.000, 234.000, 9.0000, 54.0000, 'PEDIDO', 'Seed ene', NULL, '2026-01-07 08:10:00'),
(308, NULL, NULL, 'IMP', 'Imprimacion', 'SALIDA', 5.000, 250.000, 245.000, 5.0000, 25.0000, 'PEDIDO', 'Seed ene', NULL, '2026-01-09 09:00:00'),
(309, NULL, NULL, 'p01', '7016', 'SALIDA', 6.000, 242.000, 236.000, 10.0000, 60.0000, 'PEDIDO', 'Seed ene', NULL, '2026-01-12 08:00:00'),
(310, NULL, NULL, 'p03', '9005', 'SALIDA', 4.000, 125.000, 121.000, 14.0000, 56.0000, 'PEDIDO', 'Seed ene', NULL, '2026-01-12 08:10:00'),
(311, NULL, NULL, 'p02', '9010', 'SALIDA', 8.000, 234.000, 226.000, 9.0000, 72.0000, 'PEDIDO', 'Seed ene', NULL, '2026-01-14 09:00:00'),
(312, NULL, NULL, 'IMP', 'Imprimacion', 'SALIDA', 6.000, 245.000, 239.000, 5.0000, 30.0000, 'PEDIDO', 'Seed ene', NULL, '2026-01-14 09:10:00'),
(313, NULL, NULL, 'p01', '7016', 'SALIDA', 10.000, 236.000, 226.000, 10.0000, 100.0000, 'PEDIDO', 'Seed ene', NULL, '2026-01-16 08:00:00'),
(314, NULL, NULL, 'p05', '6005', 'SALIDA', 5.000, 125.000, 120.000, 11.0000, 55.0000, 'PEDIDO', 'Seed ene', NULL, '2026-01-21 08:00:00'),
(315, NULL, NULL, 'p11', '9006', 'SALIDA', 6.000, 150.000, 144.000, 7.0000, 42.0000, 'PEDIDO', 'Seed ene', NULL, '2026-01-21 08:10:00'),
(316, NULL, NULL, 'p01', '7016', 'SALIDA', 8.000, 226.000, 218.000, 10.0000, 80.0000, 'PEDIDO', 'Seed ene', NULL, '2026-01-21 08:20:00'),
(317, NULL, NULL, 'p02', '9010', 'SALIDA', 8.000, 226.000, 218.000, 9.0000, 72.0000, 'PEDIDO', 'Seed ene', NULL, '2026-01-21 09:00:00'),
(318, NULL, NULL, 'IMP', 'Imprimacion', 'SALIDA', 5.000, 239.000, 234.000, 5.0000, 25.0000, 'PEDIDO', 'Seed ene', NULL, '2026-01-21 09:10:00'),
(319, NULL, NULL, 'p03', '9005', 'SALIDA', 7.000, 121.000, 114.000, 14.0000, 98.0000, 'PEDIDO', 'Seed ene', NULL, '2026-01-23 08:00:00'),
(320, NULL, NULL, 'p05', '6005', 'SALIDA', 3.000, 120.000, 117.000, 11.0000, 33.0000, 'PEDIDO', 'Seed ene', NULL, '2026-01-23 08:10:00'),
(321, NULL, NULL, 'p01', '7016', 'SALIDA', 5.000, 218.000, 213.000, 10.0000, 50.0000, 'PEDIDO', 'Seed ene', NULL, '2026-01-26 08:00:00'),
(322, NULL, NULL, 'p11', '9006', 'SALIDA', 6.000, 144.000, 138.000, 7.0000, 42.0000, 'PEDIDO', 'Seed ene', NULL, '2026-01-26 08:10:00'),
(323, NULL, NULL, 'p02', '9010', 'SALIDA', 6.000, 218.000, 212.000, 9.0000, 54.0000, 'PEDIDO', 'Seed ene', NULL, '2026-01-28 09:00:00'),
(324, NULL, NULL, 'IMP', 'Imprimacion', 'SALIDA', 4.000, 234.000, 230.000, 5.0000, 20.0000, 'PEDIDO', 'Seed ene', NULL, '2026-01-28 09:10:00'),
(325, NULL, NULL, 'p01', '7016', 'SALIDA', 8.000, 213.000, 205.000, 10.0000, 80.0000, 'PEDIDO', 'Seed ene', NULL, '2026-01-30 08:00:00'),
(326, NULL, NULL, 'p05', '6005', 'SALIDA', 3.000, 117.000, 114.000, 11.0000, 33.0000, 'PEDIDO', 'Seed ene', NULL, '2026-01-30 08:10:00'),
(327, NULL, NULL, 'p11', '9006', 'SALIDA', 4.000, 138.000, 134.000, 7.0000, 28.0000, 'PEDIDO', 'Seed ene', NULL, '2026-01-30 08:20:00'),
(330, NULL, NULL, 'p01', '7016', 'ENTRADA', 50.000, 205.000, 255.000, 11.0000, 550.0000, 'COMPRA', 'Seed feb', NULL, '2026-02-03 07:00:00'),
(331, NULL, NULL, 'IMP', 'Imprimacion', 'ENTRADA', 50.000, 230.000, 280.000, 5.2000, 260.0000, 'COMPRA', 'Seed feb', NULL, '2026-02-08 09:00:00'),
(332, NULL, NULL, 'p02', '9010', 'ENTRADA', 40.000, 212.000, 252.000, 9.5000, 380.0000, 'COMPRA', 'Seed feb', NULL, '2026-02-10 08:00:00'),
(333, NULL, NULL, 'p04', '7035', 'ENTRADA', 40.000, 100.000, 140.000, 11.5000, 460.0000, 'COMPRA', 'Seed feb', NULL, '2026-02-15 08:00:00'),
(334, NULL, NULL, 'p11', '9006', 'ENTRADA', 50.000, 134.000, 184.000, 7.2000, 360.0000, 'COMPRA', 'Seed feb', NULL, '2026-02-18 07:00:00'),
(335, NULL, NULL, 'p14', '1021', 'ENTRADA', 50.000, 100.000, 150.000, 9.6000, 480.0000, 'COMPRA', 'Seed feb', NULL, '2026-02-20 07:00:00'),
(336, NULL, NULL, 'p01', '7016', 'SALIDA', 5.000, 255.000, 250.000, 10.5000, 52.5000, 'PEDIDO', 'Seed feb', NULL, '2026-02-04 08:00:00'),
(337, NULL, NULL, 'p02', '9010', 'SALIDA', 8.000, 252.000, 244.000, 9.0000, 72.0000, 'PEDIDO', 'Seed feb', NULL, '2026-02-04 08:10:00'),
(338, NULL, NULL, 'IMP', 'Imprimacion', 'SALIDA', 5.000, 280.000, 275.000, 5.0000, 25.0000, 'PEDIDO', 'Seed feb', NULL, '2026-02-06 09:00:00'),
(339, NULL, NULL, 'p01', '7016', 'SALIDA', 5.000, 250.000, 245.000, 10.5000, 52.5000, 'PEDIDO', 'Seed feb', NULL, '2026-02-07 08:00:00'),
(340, NULL, NULL, 'p01', '7016', 'SALIDA', 6.000, 245.000, 239.000, 12.0000, 72.0000, 'PEDIDO', 'Seed feb', NULL, '2026-02-10 08:00:00'),
(341, NULL, NULL, 'p11', '9006', 'SALIDA', 8.000, 184.000, 176.000, 7.0000, 56.0000, 'PEDIDO', 'Seed feb', NULL, '2026-02-10 08:10:00'),
(342, NULL, NULL, 'IMP', 'Imprimacion', 'SALIDA', 8.000, 275.000, 267.000, 5.2000, 41.6000, 'PEDIDO', 'Seed feb', NULL, '2026-02-12 09:00:00'),
(343, NULL, NULL, 'p02', '9010', 'SALIDA', 8.000, 244.000, 236.000, 9.5000, 76.0000, 'PEDIDO', 'Seed feb', NULL, '2026-02-12 09:10:00'),
(344, NULL, NULL, 'p01', '7016', 'SALIDA', 6.000, 239.000, 233.000, 12.0000, 72.0000, 'PEDIDO', 'Seed feb', NULL, '2026-02-13 08:00:00'),
(345, NULL, NULL, 'p01', '7016', 'SALIDA', 8.000, 233.000, 225.000, 11.0000, 88.0000, 'PEDIDO', 'Seed feb', NULL, '2026-02-16 08:00:00'),
(346, NULL, NULL, 'p04', '7035', 'SALIDA', 5.000, 140.000, 135.000, 11.5000, 57.5000, 'PEDIDO', 'Seed feb', NULL, '2026-02-17 08:00:00'),
(347, NULL, NULL, 'IMP', 'Imprimacion', 'SALIDA', 5.000, 267.000, 262.000, 5.2000, 26.0000, 'PEDIDO', 'Seed feb', NULL, '2026-02-18 09:00:00'),
(348, NULL, NULL, 'p11', '9006', 'SALIDA', 8.000, 176.000, 168.000, 7.2000, 57.6000, 'PEDIDO', 'Seed feb', NULL, '2026-02-19 08:10:00'),
(349, NULL, NULL, 'p01', '7016', 'SALIDA', 8.000, 225.000, 217.000, 11.0000, 88.0000, 'PEDIDO', 'Seed feb', NULL, '2026-02-23 08:00:00'),
(350, NULL, NULL, 'p11', '9006', 'SALIDA', 8.000, 168.000, 160.000, 7.2000, 57.6000, 'PEDIDO', 'Seed feb', NULL, '2026-02-23 08:10:00'),
(351, NULL, NULL, 'p14', '1021', 'SALIDA', 8.000, 150.000, 142.000, 9.6000, 76.8000, 'PEDIDO', 'Seed feb', NULL, '2026-02-24 08:00:00'),
(352, NULL, NULL, 'p02', '9010', 'SALIDA', 8.000, 236.000, 228.000, 9.5000, 76.0000, 'PEDIDO', 'Seed feb', NULL, '2026-02-24 08:10:00'),
(353, NULL, NULL, 'IMP', 'Imprimacion', 'SALIDA', 8.000, 262.000, 254.000, 6.0000, 48.0000, 'PEDIDO', 'Seed feb', NULL, '2026-02-26 09:00:00'),
(354, NULL, NULL, 'p04', '7035', 'SALIDA', 5.000, 135.000, 130.000, 11.5000, 57.5000, 'PEDIDO', 'Seed feb', NULL, '2026-02-26 09:10:00'),
(355, NULL, NULL, 'p01', '7016', 'SALIDA', 8.000, 217.000, 209.000, 11.0000, 88.0000, 'PEDIDO', 'Seed feb', NULL, '2026-02-27 08:00:00'),
(356, NULL, NULL, 'p11', '9006', 'SALIDA', 7.000, 160.000, 153.000, 7.2000, 50.4000, 'PEDIDO', 'Seed feb', NULL, '2026-02-27 08:10:00'),
(357, NULL, NULL, 'p14', '1021', 'SALIDA', 8.000, 142.000, 134.000, 9.6000, 76.8000, 'PEDIDO', 'Seed feb', NULL, '2026-02-28 08:00:00'),
(360, NULL, NULL, 'IMP', 'Imprimacion', 'ENTRADA', 50.000, 254.000, 304.000, 5.2800, 264.0000, 'COMPRA', 'Seed mar', NULL, '2026-03-02 07:00:00'),
(361, NULL, NULL, 'p05', '6005', 'ENTRADA', 25.000, 114.000, 139.000, 11.4400, 286.0000, 'COMPRA', 'Seed mar', NULL, '2026-03-08 08:00:00'),
(362, NULL, NULL, 'p11', '9006', 'ENTRADA', 50.000, 153.000, 203.000, 7.4000, 370.0000, 'COMPRA', 'Seed mar', NULL, '2026-03-10 07:00:00'),
(363, NULL, NULL, 'p02', '9010', 'SALIDA', 8.000, 228.000, 220.000, 9.5000, 76.0000, 'PEDIDO', 'Seed mar', NULL, '2026-03-02 08:00:00'),
(364, NULL, NULL, 'p01', '7016', 'SALIDA', 6.000, 209.000, 203.000, 11.9500, 71.7000, 'PEDIDO', 'Seed mar', NULL, '2026-03-03 08:00:00'),
(365, NULL, NULL, 'IMP', 'Imprimacion', 'SALIDA', 4.000, 304.000, 300.000, 5.0000, 20.0000, 'PEDIDO', 'Seed mar', NULL, '2026-03-04 09:00:00'),
(366, NULL, NULL, 'p02', '9010', 'SALIDA', 6.000, 220.000, 214.000, 9.5000, 57.0000, 'PEDIDO', 'Seed mar', NULL, '2026-03-05 08:00:00'),
(367, NULL, NULL, 'p01', '7016', 'SALIDA', 5.000, 203.000, 198.000, 11.9500, 59.7500, 'PEDIDO', 'Seed mar', NULL, '2026-03-06 08:00:00'),
(368, NULL, NULL, 'IMP', 'Imprimacion', 'SALIDA', 6.000, 300.000, 294.000, 5.2800, 31.6800, 'PEDIDO', 'Seed mar', NULL, '2026-03-09 09:00:00'),
(369, NULL, NULL, 'p05', '6005', 'SALIDA', 4.000, 139.000, 135.000, 11.4400, 45.7600, 'PEDIDO', 'Seed mar', NULL, '2026-03-11 08:00:00'),
(370, NULL, NULL, 'p11', '9006', 'SALIDA', 8.000, 203.000, 195.000, 7.4000, 59.2000, 'PEDIDO', 'Seed mar', NULL, '2026-03-11 08:10:00'),
(371, NULL, NULL, 'p01', '7016', 'SALIDA', 6.000, 198.000, 192.000, 13.5000, 81.0000, 'PEDIDO', 'Seed mar', NULL, '2026-03-13 08:00:00'),
(372, NULL, NULL, 'IMP', 'Imprimacion', 'SALIDA', 6.000, 294.000, 288.000, 5.2800, 31.6800, 'PEDIDO', 'Seed mar', NULL, '2026-03-14 09:00:00'),
(373, NULL, NULL, 'p02', '9010', 'SALIDA', 5.000, 214.000, 209.000, 10.0000, 50.0000, 'PEDIDO', 'Seed mar', NULL, '2026-03-17 08:00:00'),
(374, NULL, NULL, 'p11', '9006', 'SALIDA', 10.000, 195.000, 185.000, 7.4000, 74.0000, 'PEDIDO', 'Seed mar', NULL, '2026-03-17 08:10:00'),
(375, NULL, NULL, 'p12', '9007', 'ENTRADA', 30.000, 5.000, 35.000, 16.0100, 480.3500, 'entrada_mercancia', 'Tiger', NULL, '2026-03-19 11:46:00'),
(376, NULL, NULL, 'mmw4mj91djdq6aot5t8', '9001 TXT', 'ENTRADA', 25.000, -0.240, 24.760, 0.0000, 0.0100, 'entrada_mercancia', 'Generica', NULL, '2026-03-19 12:12:02'),
(377, NULL, NULL, 'mmw4mj91djdq6aot5t8', '9001 TXT', 'ENTRADA', 25.000, 24.760, 49.760, 10.1600, 254.0000, 'entrada_mercancia', 'Generico', NULL, '2026-03-19 12:13:06'),
(378, NULL, NULL, 'mmw4mjdzi0avxjhwfoq', 'NOIR 100', 'ENTRADA', 30.000, -1.200, 28.800, 9.5400, 286.3500, 'entrada_mercancia', 'Tiger', NULL, '2026-03-19 12:13:06'),
(379, NULL, NULL, 'mmw54v9tnmkix3r0rqp', 'NOIR 200', 'ENTRADA', 25.000, -0.300, 24.700, 14.0300, 350.8500, 'entrada_mercancia', 'Tiger', NULL, '2026-03-19 12:13:34'),
(380, NULL, NULL, 'mmw54v9tnmkix3r0rqp', 'NOIR 200', 'ENTRADA', 25.000, 24.700, 49.700, 14.2500, 356.3500, 'entrada_mercancia', 'Azkonoble', NULL, '2026-03-19 12:15:06'),
(381, NULL, NULL, 'mmw4mjdzi0avxjhwfoq', 'NOIR 100', 'ENTRADA', 25.000, 28.800, 53.800, 11.9500, 298.6500, 'entrada_mercancia', 'Titan', NULL, '2026-03-19 12:17:54'),
(10001, NULL, NULL, '9001', NULL, 'SALIDA', 12.000, 27.000, 15.000, 10.0000, 120.0000, 'demo', 'Consumo demo', NULL, '2025-12-10 09:00:00'),
(10002, NULL, NULL, '9001', NULL, 'SALIDA', 10.000, 15.000, 5.000, 10.0000, 100.0000, 'demo', 'Consumo demo', NULL, '2025-12-15 09:00:00'),
(10003, NULL, NULL, '9002', NULL, 'SALIDA', 10.000, 40.000, 30.000, 22.0000, 220.0000, 'demo', 'Consumo demo', NULL, '2025-12-10 09:00:00'),
(10004, NULL, NULL, '9002', NULL, 'SALIDA', 8.000, 30.000, 22.000, 24.0000, 192.0000, 'demo', 'Consumo demo', NULL, '2025-12-17 09:00:00'),
(10005, NULL, NULL, '9003', NULL, 'SALIDA', 7.000, 14.000, 7.000, 20.0000, 140.0000, 'demo', 'Consumo demo', NULL, '2025-12-03 09:00:00'),
(10006, NULL, NULL, '9003', NULL, 'SALIDA', 6.000, 7.000, 1.000, 20.0000, 120.0000, 'demo', 'Consumo demo', NULL, '2025-12-20 09:00:00'),
(10007, NULL, NULL, '9004', NULL, 'SALIDA', 2.000, 52.000, 50.000, 16.0000, 32.0000, 'demo', 'Consumo demo', NULL, '2025-12-10 09:00:00'),
(10008, '19032026135140', 113, '9003', '9003', 'SALIDA', 0.300, 7.000, 6.700, 20.0000, 6.0000, 'pedido_transaccional', 'COLOR', NULL, '2026-03-19 12:54:51'),
(10009, '19032026135140', 113, 'IMP', 'Imprimacion', 'SALIDA', 0.300, 47.060, 46.760, 5.2800, 1.5840, 'pedido_transaccional', 'IMPRIMACION', NULL, '2026-03-19 12:54:51'),
(11001, NULL, NULL, '9001', NULL, 'SALIDA', 12.000, 27.000, 15.000, 10.0000, 120.0000, 'demo', 'Consumo demo', NULL, '2025-12-10 09:00:00'),
(11002, NULL, NULL, '9001', NULL, 'SALIDA', 10.000, 15.000, 5.000, 10.0000, 100.0000, 'demo', 'Consumo demo', NULL, '2025-12-15 09:00:00'),
(12001, NULL, NULL, '9002', NULL, 'ENTRADA', 25.000, 0.000, 25.000, 22.0000, 550.0000, 'compra', 'Compra 1', NULL, '2025-12-05 08:00:00'),
(12002, NULL, NULL, '9002', NULL, 'ENTRADA', 25.000, 25.000, 50.000, 24.0000, 600.0000, 'compra', 'Compra 2', NULL, '2025-12-12 08:00:00'),
(12003, NULL, NULL, '9002', NULL, 'ENTRADA', 25.000, 50.000, 75.000, 26.0000, 650.0000, 'compra', 'Compra 3', NULL, '2025-12-19 08:00:00'),
(12004, NULL, NULL, '9002', NULL, 'SALIDA', 10.000, 75.000, 65.000, 22.0000, 220.0000, 'demo', 'Consumo demo', NULL, '2025-12-10 09:00:00'),
(12005, NULL, NULL, '9002', NULL, 'SALIDA', 8.000, 65.000, 57.000, 24.0000, 192.0000, 'demo', 'Consumo demo', NULL, '2025-12-17 09:00:00'),
(12006, NULL, NULL, '9002', NULL, 'SALIDA', 5.000, 57.000, 52.000, 26.0000, 130.0000, 'demo', 'Consumo demo', NULL, '2025-12-22 09:00:00'),
(12007, NULL, NULL, '9002', NULL, 'SALIDA', 30.000, 52.000, 22.000, 24.0000, 720.0000, 'demo', 'Consumo demo', NULL, '2025-12-28 09:00:00'),
(13001, NULL, NULL, '9003', NULL, 'ENTRADA', 25.000, 0.000, 25.000, 20.0000, 500.0000, 'compra', 'Compra', NULL, '2025-12-01 08:00:00'),
(13002, NULL, NULL, '9003', NULL, 'SALIDA', 7.000, 25.000, 18.000, 20.0000, 140.0000, 'demo', 'Consumo demo', NULL, '2025-12-03 09:00:00'),
(13003, NULL, NULL, '9003', NULL, 'SALIDA', 10.000, 18.000, 8.000, 20.0000, 200.0000, 'demo', 'Consumo demo', NULL, '2025-12-15 09:00:00'),
(13004, NULL, NULL, '9003', NULL, 'SALIDA', 7.000, 8.000, 1.000, 20.0000, 140.0000, 'demo', 'Consumo demo', NULL, '2025-12-20 09:00:00'),
(14001, NULL, NULL, '9004', NULL, 'ENTRADA', 25.000, 25.000, 50.000, 16.0000, 400.0000, 'compra', 'Compra', NULL, '2025-12-05 08:00:00'),
(14002, NULL, NULL, '9004', NULL, 'SALIDA', 2.000, 50.000, 48.000, 16.0000, 32.0000, 'demo', 'Consumo demo', NULL, '2025-12-10 09:00:00'),
(111001, NULL, NULL, '9001', NULL, 'SALIDA', 12.000, 27.000, 15.000, 10.0000, 120.0000, 'demo', 'Consumo demo', NULL, '2025-12-10 09:00:00'),
(111002, NULL, NULL, '9001', NULL, 'SALIDA', 10.000, 15.000, 5.000, 10.0000, 100.0000, 'demo', 'Consumo demo', NULL, '2025-12-15 09:00:00'),
(111011, NULL, NULL, '9011', NULL, 'SALIDA', 8.000, 11.000, 3.000, 15.0000, 120.0000, 'demo', 'Consumo demo', NULL, '2025-12-12 09:00:00'),
(111012, NULL, NULL, '9011', NULL, 'SALIDA', 5.000, 3.000, -2.000, 15.0000, 75.0000, 'demo', 'Consumo demo', NULL, '2025-12-18 09:00:00'),
(112001, NULL, NULL, '9002', NULL, 'ENTRADA', 25.000, 0.000, 25.000, 22.0000, 550.0000, 'compra', 'Compra 1', NULL, '2025-12-05 08:00:00'),
(112002, NULL, NULL, '9002', NULL, 'ENTRADA', 25.000, 25.000, 50.000, 24.0000, 600.0000, 'compra', 'Compra 2', NULL, '2025-12-12 08:00:00'),
(112003, NULL, NULL, '9002', NULL, 'ENTRADA', 25.000, 50.000, 75.000, 26.0000, 650.0000, 'compra', 'Compra 3', NULL, '2025-12-19 08:00:00'),
(112004, NULL, NULL, '9002', NULL, 'SALIDA', 10.000, 75.000, 65.000, 22.0000, 220.0000, 'demo', 'Consumo demo', NULL, '2025-12-10 09:00:00'),
(112005, NULL, NULL, '9002', NULL, 'SALIDA', 8.000, 65.000, 57.000, 24.0000, 192.0000, 'demo', 'Consumo demo', NULL, '2025-12-17 09:00:00'),
(112006, NULL, NULL, '9002', NULL, 'SALIDA', 5.000, 57.000, 52.000, 26.0000, 130.0000, 'demo', 'Consumo demo', NULL, '2025-12-22 09:00:00'),
(112007, NULL, NULL, '9002', NULL, 'SALIDA', 30.000, 52.000, 22.000, 24.0000, 720.0000, 'demo', 'Consumo demo', NULL, '2025-12-28 09:00:00'),
(112011, NULL, NULL, '9012', NULL, 'ENTRADA', 10.000, 0.000, 10.000, 10.0000, 100.0000, 'compra', 'Compra 1', NULL, '2025-12-03 08:00:00'),
(112012, NULL, NULL, '9012', NULL, 'ENTRADA', 10.000, 10.000, 20.000, 12.0000, 120.0000, 'compra', 'Compra 2', NULL, '2025-12-10 08:00:00'),
(112013, NULL, NULL, '9012', NULL, 'ENTRADA', 10.000, 20.000, 30.000, 14.0000, 140.0000, 'compra', 'Compra 3', NULL, '2025-12-17 08:00:00'),
(112014, NULL, NULL, '9012', NULL, 'SALIDA', 5.000, 30.000, 25.000, 10.0000, 50.0000, 'demo', 'Consumo demo', NULL, '2025-12-05 09:00:00'),
(112015, NULL, NULL, '9012', NULL, 'SALIDA', 7.000, 25.000, 18.000, 12.0000, 84.0000, 'demo', 'Consumo demo', NULL, '2025-12-12 09:00:00'),
(112016, NULL, NULL, '9012', NULL, 'SALIDA', 8.000, 18.000, 10.000, 14.0000, 112.0000, 'demo', 'Consumo demo', NULL, '2025-12-19 09:00:00'),
(113001, NULL, NULL, '9003', NULL, 'ENTRADA', 25.000, 0.000, 25.000, 20.0000, 500.0000, 'compra', 'Compra', NULL, '2025-12-01 08:00:00'),
(113002, NULL, NULL, '9003', NULL, 'SALIDA', 7.000, 25.000, 18.000, 20.0000, 140.0000, 'demo', 'Consumo demo', NULL, '2025-12-03 09:00:00'),
(113003, NULL, NULL, '9003', NULL, 'SALIDA', 10.000, 18.000, 8.000, 20.0000, 200.0000, 'demo', 'Consumo demo', NULL, '2025-12-15 09:00:00'),
(113004, NULL, NULL, '9003', NULL, 'SALIDA', 7.000, 8.000, 1.000, 20.0000, 140.0000, 'demo', 'Consumo demo', NULL, '2025-12-20 09:00:00'),
(113011, NULL, NULL, '9013', NULL, 'ENTRADA', 15.000, 0.000, 15.000, 12.0000, 180.0000, 'compra', 'Compra', NULL, '2025-12-02 08:00:00'),
(113012, NULL, NULL, '9013', NULL, 'SALIDA', 6.000, 15.000, 9.000, 12.0000, 72.0000, 'demo', 'Consumo demo', NULL, '2025-12-10 09:00:00'),
(113013, NULL, NULL, '9013', NULL, 'SALIDA', 7.000, 9.000, 2.000, 12.0000, 84.0000, 'demo', 'Consumo demo', NULL, '2025-12-18 09:00:00'),
(114001, NULL, NULL, '9004', NULL, 'ENTRADA', 25.000, 25.000, 50.000, 16.0000, 400.0000, 'compra', 'Compra', NULL, '2025-12-05 08:00:00'),
(114002, NULL, NULL, '9004', NULL, 'SALIDA', 2.000, 50.000, 48.000, 16.0000, 32.0000, 'demo', 'Consumo demo', NULL, '2025-12-10 09:00:00'),
(114011, NULL, NULL, '9014', NULL, 'ENTRADA', 20.000, 20.000, 40.000, 8.0000, 160.0000, 'compra', 'Compra', NULL, '2025-12-06 08:00:00'),
(114012, NULL, NULL, '9014', NULL, 'SALIDA', 3.000, 40.000, 37.000, 8.0000, 24.0000, 'demo', 'Consumo demo', NULL, '2025-12-12 09:00:00'),
(114013, NULL, NULL, '9001', '9001', 'ENTRADA', 25.000, 5.000, 30.000, 10.0300, 250.8500, 'entrada_mercancia', 'Axalta', NULL, '2026-03-20 10:06:39'),
(114014, '20032026120931', 114, 'p10', '1015 m', 'SALIDA', 0.120, 12.000, 11.880, 0.0000, 0.0000, 'pedido_transaccional', 'COLOR', NULL, '2026-03-20 11:16:34'),
(114015, '20032026121854', 115, 'p08', '8014', 'SALIDA', 0.120, 0.000, -0.120, 0.0000, 0.0000, 'pedido_transaccional', 'COLOR', NULL, '2026-03-20 11:19:19'),
(114016, '20032026191857', 116, 'mmt610hs93efem0gxa', '1015 Axalta', 'SALIDA', 5.818, -4.320, -10.138, 0.0000, 0.0000, 'pedido_transaccional', 'COLOR', NULL, '2026-03-20 18:20:36'),
(114017, '20032026191857', 116, 'IMP', 'Imprimacion', 'SALIDA', 5.818, 46.760, 40.942, 5.2800, 30.7169, 'pedido_transaccional', 'IMPRIMACION', NULL, '2026-03-20 18:20:36'),
(114019, '20032026193744', 118, 'mmt610hs93efem0gxa', '1015 Axalta', 'SALIDA', 0.000, -10.140, -10.140, 0.0000, 0.0000, 'pedido_transaccional', 'COLOR', NULL, '2026-03-20 18:38:14'),
(114022, NULL, NULL, '9003', '9003', 'ENTRADA', 1.000, 1.000, 2.000, 235.0000, 235.0000, 'entrada_mercancia', 'Axalta', NULL, '2026-03-20 21:36:17');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `precio` decimal(10,2) DEFAULT '0.00',
  `uni` int DEFAULT '1',
  `unidad_medida` enum('Ud','ml','m2') DEFAULT 'Ud',
  `consumo` decimal(10,3) DEFAULT '0.000'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `precio`, `uni`, `unidad_medida`, `consumo`) VALUES
('', 'Chapa Galvanizada 1*1*1', 0.00, 4, 'Ud', 0.000),
('mmtjv610viwjo28eeuo', 'CHAPA GALVANIZADA PRUEBA', 25.50, 1, 'Ud', 0.000),
('mmtjv610viwjo28eeuo-VAR-1', 'CHAPA GALVANIZADA PRUEBA', 0.00, 1, 'Ud', 0.000),
('mmtjv610viwjo28eeuo-VAR-2', 'CHAPA GALVANIZADA PRUEBA', 0.00, 5, 'Ud', 0.000),
('mmtjv610viwjo28eeuo-VAR-3', 'CHAPA GALVANIZADA PRUEBA', 0.00, 1, 'Ud', 0.000),
('mmtjv610viwjo28eeuo-VAR-4', 'CHAPA GALVANIZADA PRUEBA', 0.00, 1, 'Ud', 0.000),
('mmtjv610viwjo28eeuo-VAR-5', 'CHAPA GALVANIZADA PRUEBA', 0.00, 1, 'Ud', 0.000),
('mmtjv610viwjo28eeuo-VAR-6', 'CHAPA GALVANIZADA PRUEBA', 0.00, 2, 'Ud', 0.000),
('mmtjv610viwjo28eeuo-VAR-7', 'CHAPA GALVANIZADA PRUEBA', 0.00, 1, 'Ud', 0.000),
('mmtjv610viwjo28eeuo-VAR-8', 'CHAPA GALVANIZADA PRUEBA', 0.00, 1, 'Ud', 0.000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarifas_estandar`
--

CREATE TABLE `tarifas_estandar` (
  `id` int NOT NULL,
  `unidad` enum('ud','ml','m2') COLLATE latin1_spanish_ci DEFAULT NULL,
  `precio_color` decimal(10,2) DEFAULT NULL,
  `precio_color_mas_imp` decimal(10,2) DEFAULT NULL,
  `precio_imprimacion` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `tarifas_estandar`
--

INSERT INTO `tarifas_estandar` (`id`, `unidad`, `precio_color`, `precio_color_mas_imp`, `precio_imprimacion`) VALUES
(1, 'ud', 12.00, 15.00, 11.00),
(2, 'ml', 15.38, 19.12, 10.00),
(3, 'm2', 23.26, 28.35, 10.00);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_pintura_gasto_mensual`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vw_pintura_gasto_mensual` (
`compras` bigint
,`coste_medio_eur_kg` decimal(48,6)
,`gasto_total_eur` decimal(42,2)
,`marca` varchar(255)
,`periodo` varchar(7)
,`pintura_id` varchar(255)
,`ral` varchar(100)
,`total_cajas` decimal(32,0)
,`total_kg_comprados` decimal(42,2)
);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `AlbaranMateriales`
--
ALTER TABLE `AlbaranMateriales`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estanteria`
--
ALTER TABLE `estanteria`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cliente_id` (`cliente_id`);

--
-- Indices de la tabla `pedido_lineas`
--
ALTER TABLE `pedido_lineas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pedido_id` (`pedido_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `pintura`
--
ALTER TABLE `pintura`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pintura_compras`
--
ALTER TABLE `pintura_compras`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pintura_compra` (`pintura_id`);

--
-- Indices de la tabla `pintura_stock_lotes_fifo`
--
ALTER TABLE `pintura_stock_lotes_fifo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_fifo_pintura_estado_fecha` (`pintura_id`,`estado`,`fecha_entrada`),
  ADD KEY `idx_fifo_compra_id` (`compra_id`);

--
-- Indices de la tabla `pintura_stock_movimientos`
--
ALTER TABLE `pintura_stock_movimientos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_mov_pintura_fecha` (`pintura_id`,`created_at`),
  ADD KEY `idx_mov_pedido` (`pedido_id`),
  ADD KEY `idx_mov_tipo_fecha` (`tipo`,`created_at`),
  ADD KEY `fk_mov_linea` (`pedido_linea_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tarifas_estandar`
--
ALTER TABLE `tarifas_estandar`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `AlbaranMateriales`
--
ALTER TABLE `AlbaranMateriales`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT de la tabla `pedido_lineas`
--
ALTER TABLE `pedido_lineas`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

--
-- AUTO_INCREMENT de la tabla `pintura_compras`
--
ALTER TABLE `pintura_compras`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=130019;

--
-- AUTO_INCREMENT de la tabla `pintura_stock_lotes_fifo`
--
ALTER TABLE `pintura_stock_lotes_fifo`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `pintura_stock_movimientos`
--
ALTER TABLE `pintura_stock_movimientos`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114024;

--
-- AUTO_INCREMENT de la tabla `tarifas_estandar`
--
ALTER TABLE `tarifas_estandar`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_pintura_gasto_mensual`
--
DROP TABLE IF EXISTS `vw_pintura_gasto_mensual`;

CREATE ALGORITHM=UNDEFINED DEFINER=`qalz943`@`localhost` SQL SECURITY DEFINER VIEW `vw_pintura_gasto_mensual`  AS SELECT date_format(`pc`.`fecha_compra`,'%Y-%m') AS `periodo`, `p`.`id` AS `pintura_id`, `p`.`ral` AS `ral`, `p`.`marca` AS `marca`, count(`pc`.`id`) AS `compras`, sum(coalesce(`pc`.`cantidad_cajas`,0)) AS `total_cajas`, sum((coalesce(`pc`.`formato_kg`,0) * coalesce(`pc`.`cantidad_cajas`,0))) AS `total_kg_comprados`, sum((coalesce(`pc`.`precio_total_caja`,0) * coalesce(`pc`.`cantidad_cajas`,0))) AS `gasto_total_eur`, (case when (sum((coalesce(`pc`.`formato_kg`,0) * coalesce(`pc`.`cantidad_cajas`,0))) > 0) then (sum((coalesce(`pc`.`precio_total_caja`,0) * coalesce(`pc`.`cantidad_cajas`,0))) / sum((coalesce(`pc`.`formato_kg`,0) * coalesce(`pc`.`cantidad_cajas`,0)))) else 0 end) AS `coste_medio_eur_kg` FROM (`pintura_compras` `pc` join `pintura` `p` on((`p`.`id` = `pc`.`pintura_id`))) GROUP BY date_format(`pc`.`fecha_compra`,'%Y-%m'), `p`.`id`, `p`.`ral`, `p`.`marca` ;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `cliente` (`id`) ON DELETE RESTRICT;

--
-- Filtros para la tabla `pedido_lineas`
--
ALTER TABLE `pedido_lineas`
  ADD CONSTRAINT `pedido_lineas_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pedido_lineas_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE RESTRICT;

--
-- Filtros para la tabla `pintura_stock_lotes_fifo`
--
ALTER TABLE `pintura_stock_lotes_fifo`
  ADD CONSTRAINT `fk_fifo_compra` FOREIGN KEY (`compra_id`) REFERENCES `pintura_compras` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_fifo_pintura` FOREIGN KEY (`pintura_id`) REFERENCES `pintura` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Filtros para la tabla `pintura_stock_movimientos`
--
ALTER TABLE `pintura_stock_movimientos`
  ADD CONSTRAINT `fk_mov_linea` FOREIGN KEY (`pedido_linea_id`) REFERENCES `pedido_lineas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_mov_pedido` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_mov_pintura` FOREIGN KEY (`pintura_id`) REFERENCES `pintura` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
