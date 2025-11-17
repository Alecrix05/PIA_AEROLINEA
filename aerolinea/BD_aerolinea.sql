-- ==========================================================
-- BASE DE DATOS: SISTEMA DE VENTAS Y GESTIÓN DE VUELOS (AMPLIADO)
-- Incluye tablas nuevas: Impuesto, Tarifa, Asiento, Venta_Impuesto
-- Modificaciones: Pago (id_metodo_pago FK), Boleto (referencia a Asiento y Tarifa)
-- ==========================================================

DROP DATABASE IF EXISTS aerolinea;
CREATE DATABASE aerolinea CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE aerolinea;

-- ==============================
-- 1) TABLAS PRINCIPALES
-- ==============================

CREATE TABLE Cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    apellido_p VARCHAR(50),
    apellido_m VARCHAR(50),
    telefono VARCHAR(15),
    correo VARCHAR(100) UNIQUE,
    calle VARCHAR(100),
    numero VARCHAR(10),
    colonia VARCHAR(50),
    ciudad VARCHAR(50),
    estado VARCHAR(50),
    codigo_postal VARCHAR(10)
);

CREATE TABLE Reserva (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    codigo_reserva VARCHAR(20),
    fecha_reserva DATE,
    estado VARCHAR(20),
    id_cliente INT,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente)
);

-- ==============================
-- PAGO (MODIFICADA)
-- ==============================
-- Comentario: se modifica la tabla Pago para referenciar al catalogo Metodo_Pago (id_metodo_pago)
-- y a la venta (id_venta). Mantengo campos existentes (monto, fecha_pago, estatus).
CREATE TABLE Pago (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    metodo_pago VARCHAR(30), -- campo historico opcional
    id_metodo_pago INT,      -- FK al catalogo Metodo_Pago (nuevo)
    monto DECIMAL(10,2),
    fecha_pago DATE,
    estatus VARCHAR(20),
    id_venta INT
    -- FK se añade después (Metodo_Pago y Venta_Encabezado pueden definirse más abajo)
);

-- ==============================
-- VENTA ENCABEZADO (se mantiene)
-- ==============================
CREATE TABLE Venta_Encabezado (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    fecha_venta DATE,
    forma_pago VARCHAR(30),
    canal_venta VARCHAR(30),
    total DECIMAL(10,2),
    estado_venta VARCHAR(30),
    id_cliente INT,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente)
);

-- ==============================
-- PASAJERO
-- ==============================
CREATE TABLE Pasajero (
    id_pasajero INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    apellido_p VARCHAR(50),
    apellido_m VARCHAR(50),
    fecha_nacimiento DATE,
    nacionalidad VARCHAR(50),
    pasaporte VARBINARY(255), -- encriptada
    id_cliente INT,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente)
);

CREATE TABLE Ciudad (
    id_ciudad INT AUTO_INCREMENT PRIMARY KEY,
    nombre_ciudad VARCHAR(50),
    estado VARCHAR(50),
    pais VARCHAR(50)
);

CREATE TABLE Aeropuerto (
    id_aeropuerto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    codigo_IATA VARCHAR(10),
    id_ciudad INT,
    FOREIGN KEY (id_ciudad) REFERENCES Ciudad(id_ciudad)
);

CREATE TABLE Avion (
    id_avion INT AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(20),
    modelo VARCHAR(50),
    capacidad INT,
    estado_operativo VARCHAR(30)
);

CREATE TABLE Departamento (
    id_departamento INT AUTO_INCREMENT PRIMARY KEY,
    nombre_departamento VARCHAR(50),
    descripcion VARCHAR(100)
);

CREATE TABLE Empleado (
    id_empleado INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    apellido_p VARCHAR(50),
    apellido_m VARCHAR(50),
    puesto VARCHAR(50),
    salario DECIMAL(10,2),
    fecha_contratacion DATE,
    id_departamento INT,
    FOREIGN KEY (id_departamento) REFERENCES Departamento(id_departamento)
);

CREATE TABLE Tripulacion (
    id_tripulacion INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tripulacion VARCHAR(50),
    id_piloto INT,
    id_copiloto INT,
    FOREIGN KEY (id_piloto) REFERENCES Empleado(id_empleado),
    FOREIGN KEY (id_copiloto) REFERENCES Empleado(id_empleado)
);

CREATE TABLE Ruta (
    id_ruta INT AUTO_INCREMENT PRIMARY KEY,
    distancia DECIMAL(10,2),
    id_origen INT,
    id_destino INT,
    FOREIGN KEY (id_origen) REFERENCES Aeropuerto(id_aeropuerto),
    FOREIGN KEY (id_destino) REFERENCES Aeropuerto(id_aeropuerto)
);

CREATE TABLE Vuelo (
    id_vuelo INT AUTO_INCREMENT PRIMARY KEY,
    numero_vuelo VARCHAR(20),
    duracion TIME,
    id_ruta INT,
    FOREIGN KEY (id_ruta) REFERENCES Ruta(id_ruta)
);

CREATE TABLE Instancia_Vuelo (
    id_instancia_vuelo INT AUTO_INCREMENT PRIMARY KEY,
    fecha_salida DATETIME,
    fecha_llegada DATETIME,
    estado_vuelo VARCHAR(30),
    id_vuelo INT,
    id_avion INT,
    id_tripulacion INT,
    FOREIGN KEY (id_vuelo) REFERENCES Vuelo(id_vuelo),
    FOREIGN KEY (id_avion) REFERENCES Avion(id_avion),
    FOREIGN KEY (id_tripulacion) REFERENCES Tripulacion(id_tripulacion)
);

-- ==============================
-- ASIENTO (NUEVA)
-- ==============================
-- Comentario: tabla para modelar el mapa de asientos por avión.
--   - id_avion FK: a qué avión pertenece el asiento
--   - codigo_asiento: p.ej. "12A"
--   - fila / columna: opcionales para lógica de layout
--   - clase: Económica/Ejecutiva/Primera (coincide con clases en Boleto/Tarifa)
CREATE TABLE Asiento (
    id_asiento INT AUTO_INCREMENT PRIMARY KEY,
    id_avion INT NOT NULL,
    codigo_asiento VARCHAR(10) NOT NULL, -- ej. 12A
    fila SMALLINT,
    columna VARCHAR(5),
    clase VARCHAR(30),
    ubicacion VARCHAR(100),
    FOREIGN KEY (id_avion) REFERENCES Avion(id_avion)
);

-- ==============================
-- TARIFA (NUEVA)
-- ==============================
-- Comentario: catálogo de tarifas por clase/segmento. Puedes ampliarlo después
-- para tarifas por ruta o promos; por ahora sirve como referencia para calcular precio.
CREATE TABLE Tarifa (
    id_tarifa INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    clase ENUM('Económica','Ejecutiva','Primera') DEFAULT 'Económica',
    precio_base DECIMAL(12,2) NOT NULL,
    descripcion VARCHAR(255),
    activo TINYINT(1) DEFAULT 1
);

-- ==============================
-- BOLETO (MODIFICADA)
-- ==============================
-- Comentario: reemplacé el campo 'asiento VARCHAR' por id_asiento FK a Asiento.
-- También agregué id_tarifa FK para relacionar el boleto con una tarifa (opcional).
CREATE TABLE Boleto (
    id_boleto INT AUTO_INCREMENT PRIMARY KEY,
    numero_boleto VARCHAR(30),
    fecha_emision DATE,
    precio DECIMAL(10,2),
    clase VARCHAR(20),
    -- asiento VARCHAR(10),  -- (ANTIGUO) sustituido por la referencia a Asiento
    id_asiento INT,           -- FK a Asiento (puede ser NULL si no se asignó asiento)
    id_tarifa INT,            -- FK a Tarifa (opcional, para indicar tarifa aplicada)
    estado VARCHAR(20),
    id_pasajero INT,
    id_reserva INT,
    id_instancia_vuelo INT,
    FOREIGN KEY (id_pasajero) REFERENCES Pasajero(id_pasajero),
    FOREIGN KEY (id_reserva) REFERENCES Reserva(id_reserva),
    FOREIGN KEY (id_instancia_vuelo) REFERENCES Instancia_Vuelo(id_instancia_vuelo),
    FOREIGN KEY (id_asiento) REFERENCES Asiento(id_asiento),
    FOREIGN KEY (id_tarifa) REFERENCES Tarifa(id_tarifa)
);

-- ==============================
-- VENTA_DETALLE (se mantiene)
-- ==============================
CREATE TABLE Venta_Detalle (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    precio_unitario DECIMAL(10,2),
    impuestos DECIMAL(10,2),
    subtotal DECIMAL(10,2),
    id_venta INT,
    id_boleto INT,
    FOREIGN KEY (id_venta) REFERENCES Venta_Encabezado(id_venta),
    FOREIGN KEY (id_boleto) REFERENCES Boleto(id_boleto)
);

-- ==============================
-- METODO_PAGO (EXISTENTE — lo dejamos)
-- ==============================
CREATE TABLE Metodo_Pago (
    id_metodo_pago INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    descripcion VARCHAR(100)
);

-- ==============================
-- IMPUESTO (NUEVA)
-- ==============================
-- Comentario: catálogo de impuestos (IVA, tasas aeroportuarias, etc.)
CREATE TABLE Impuesto (
    id_impuesto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    porcentaje DECIMAL(5,2) NOT NULL, -- ej. 16.00 -> 16%
    descripcion VARCHAR(255)
);

-- ==============================
-- VENTA_IMPUESTO (NUEVA)
-- ==============================
-- Comentario: relación entre Venta_Detalle y los impuestos aplicados.
-- Permite almacenar monto de impuesto aplicado por detalle (por si varía).
CREATE TABLE Venta_Impuesto (
    id_venta_impuesto INT AUTO_INCREMENT PRIMARY KEY,
    id_detalle INT NOT NULL,
    id_impuesto INT NOT NULL,
    monto_impuesto DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_detalle) REFERENCES Venta_Detalle(id_detalle),
    FOREIGN KEY (id_impuesto) REFERENCES Impuesto(id_impuesto)
);

-- ==============================
-- ENLAZAR PAGOS (FKs que faltaban)
-- ==============================
-- Comentario: agrego las FK que referencian a Metodo_Pago y Venta_Encabezado
ALTER TABLE Pago
    ADD CONSTRAINT fk_pago_metodo_pago FOREIGN KEY (id_metodo_pago) REFERENCES Metodo_Pago(id_metodo_pago),
    ADD CONSTRAINT fk_pago_venta FOREIGN KEY (id_venta) REFERENCES Venta_Encabezado(id_venta);

-- ==============================
-- 3️⃣ FUNCIONES, PROCEDIMIENTOS, VISTAS Y TRIGGERS
-- ==============================
DELIMITER $$

CREATE FUNCTION calcular_total_venta(p_id_venta INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE total DECIMAL(10,2);
    SELECT SUM(subtotal) INTO total FROM Venta_Detalle WHERE id_venta = p_id_venta;
    RETURN IFNULL(total, 0);
END$$

CREATE PROCEDURE listar_boletos_cliente(IN p_id_cliente INT)
BEGIN
    SELECT b.numero_boleto, b.precio, v.fecha_venta,
           pa.nombre AS pasajero_nombre, pa.apellido_p AS pasajero_apellido
    FROM Boleto b
    JOIN Venta_Detalle vd ON b.id_boleto = vd.id_boleto
    JOIN Venta_Encabezado v ON vd.id_venta = v.id_venta
    JOIN Pasajero pa ON b.id_pasajero = pa.id_pasajero
    WHERE v.id_cliente = p_id_cliente;
END$$

CREATE TRIGGER after_insert_venta_detalle
AFTER INSERT ON Venta_Detalle
FOR EACH ROW
BEGIN
    UPDATE Venta_Encabezado
    SET total = calcular_total_venta(NEW.id_venta)
    WHERE id_venta = NEW.id_venta;
END$$

CREATE VIEW vista_resumen_ventas AS
SELECT v.id_venta, c.nombre AS cliente, v.fecha_venta, v.total, v.estado_venta
FROM Venta_Encabezado v
JOIN Cliente c ON v.id_cliente = c.id_cliente;
$$
DELIMITER ;

-- ==============================
-- 4️⃣ ROLES Y USUARIOS
-- ==============================
DROP ROLE IF EXISTS 'rol_admin', 'rol_empleado', 'rol_consulta';
CREATE ROLE 'rol_admin';
CREATE ROLE 'rol_empleado';
CREATE ROLE 'rol_consulta';

DROP USER IF EXISTS 'admin_aero'@'localhost', 'empleado_aero'@'localhost', 'consulta_aero'@'localhost';
CREATE USER 'admin_aero'@'localhost' IDENTIFIED BY 'Admin123!';
CREATE USER 'empleado_aero'@'localhost' IDENTIFIED BY 'Empleado123!';
CREATE USER 'consulta_aero'@'localhost' IDENTIFIED BY 'Consulta123!';

GRANT 'rol_admin' TO 'admin_aero'@'localhost';
GRANT 'rol_empleado' TO 'empleado_aero'@'localhost';
GRANT 'rol_consulta' TO 'consulta_aero'@'localhost';

GRANT ALL PRIVILEGES ON aerolinea.* TO 'rol_admin';
GRANT SELECT, INSERT, UPDATE ON aerolinea.* TO 'rol_empleado';
GRANT SELECT ON aerolinea.* TO 'rol_consulta';

SET DEFAULT ROLE ALL TO 'admin_aero'@'localhost', 'empleado_aero'@'localhost', 'consulta_aero'@'localhost';

-- ==============================
-- 5️⃣ EJEMPLO DE ENCRIPTACIÓN DE COLUMNA
-- ==============================
-- Ejemplo de insertar un pasajero con pasaporte encriptado
INSERT INTO Pasajero (nombre, apellido_p, apellido_m, fecha_nacimiento, nacionalidad, pasaporte, id_cliente)
VALUES (
    'Luis', 'Pérez', 'Gómez', '1990-05-12', 'Mexicana',
    AES_ENCRYPT('X1234567', 'claveSegura123'),
    NULL
);

-- Para desencriptar:
-- SELECT AES_DECRYPT(pasaporte, 'claveSegura123') FROM Pasajero;

-- ==========================================================
-- FIN DEL SCRIPT
-- ==========================================================
