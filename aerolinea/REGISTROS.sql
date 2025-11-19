USE aerolinea;

-- SELECT * FROM cliente;

-- DELETE FROM cliente WHERE id_cliente = 3;

-- SELECT * FROM reserva;

-- DELETE FROM reserva WHERE id_reserva = 3;

-- SELECT * FROM pasajero;
-- ALTER TABLE pasajero AUTO_INCREMENT = 1;


-- DELETE FROM pasajero WHERE id_pasajero = 1;

-- SELECT * FROM venta_encabezado;
-- SELECT * FROM venta_detalle;
-- SELECT * FROM boleto;
-- SELECT * FROM empleado;
-- SELECT * FROM tripulacion;

-- SELECT * FROM venta_impuesto;

-- SELECT * FROM departamento;
-- SELECT * FROM metodo_pago;

-- SELECT * FROM vuelo;

-- SELECT * FROM ruta;
-- SELECT * FROM aeropuerto;

-- SELECT * FROM instancia_vuelo;







-- ============================================
-- 1. CIUDADES
-- ============================================
INSERT INTO Ciudad (nombre_ciudad, estado, pais) VALUES 
('CIUDAD DE MEXICO', 'CIUDAD DE MEXICO', 'MEXICO'),
('GUADALAJARA', 'JALISCO', 'MEXICO'),
('MONTERREY', 'NUEVO LEON', 'MEXICO'),
('CANCUN', 'QUINTANA ROO', 'MEXICO'),
('TIJUANA', 'BAJA CALIFORNIA', 'MEXICO'),
('MERIDA', 'YUCATAN', 'MEXICO');

-- ============================================
-- 2. AEROPUERTOS
-- ============================================
INSERT INTO Aeropuerto (nombre, codigo_IATA, id_ciudad) VALUES 
('AEROPUERTO INTERNACIONAL BENITO JUAREZ', 'MEX', 1),
('AEROPUERTO INTERNACIONAL DE GUADALAJARA', 'GDL', 2),
('AEROPUERTO INTERNACIONAL DE MONTERREY', 'MTY', 3),
('AEROPUERTO INTERNACIONAL DE CANCUN', 'CUN', 4),
('AEROPUERTO INTERNACIONAL DE TIJUANA', 'TIJ', 5),
('AEROPUERTO INTERNACIONAL DE MERIDA', 'MID', 6);

INSERT INTO Departamento (nombre_departamento, descripcion) VALUES 
('OPERACIONES', 'DEPARTAMENTO DE OPERACIONES DE VUELO'),
('COMERCIAL', 'DEPARTAMENTO COMERCIAL Y VENTAS'),
('MANTENIMIENTO', 'DEPARTAMENTO DE MANTENIMIENTO DE AERONAVES'),
('RECURSOS HUMANOS', 'DEPARTAMENTO DE RECURSOS HUMANOS'),
('FINANZAS', 'DEPARTAMENTO DE FINANZAS Y CONTABILIDAD');

INSERT INTO Empleado (nombre, apellido_p, apellido_m, puesto, salario, fecha_contratacion, id_departamento) VALUES 
('CARLOS', 'MARTINEZ', 'LOPEZ', 'PILOTO', 45000.00, '2020-01-15', 1),
('MARIA', 'GONZALEZ', 'RODRIGUEZ', 'COPILOTO', 35000.00, '2021-03-10', 1),
('RICARDO', 'TORRES', 'SILVA', 'PILOTO', 47000.00, '2019-08-22', 1),
('ELENA', 'MORALES', 'CASTRO', 'COPILOTO', 36000.00, '2022-01-18', 1),
('FERNANDO', 'GUTIERREZ', 'RAMOS', 'PILOTO', 46000.00, '2021-05-10', 1),
('CLAUDIA', 'RIVERA', 'MENDEZ', 'COPILOTO', 34000.00, '2023-03-15', 1);

-- ============================================
-- 5. TRIPULACIONES
-- ============================================
INSERT INTO Tripulacion (nombre_tripulacion, id_piloto, id_copiloto) VALUES 
('TRIPULACION ALPHA', 1, 2),
('TRIPULACION BETA', 3, 4),
('TRIPULACION GAMMA', 5, 6);

-- ============================================
-- 6. AVIONES
-- ============================================
INSERT INTO Avion (matricula, modelo, capacidad, estado_operativo) VALUES 
('XA-ABC', 'BOEING 737-800', 189, 'ACTIVO'),
('XA-DEF', 'AIRBUS A320', 180, 'ACTIVO'),
('XA-GHI', 'BOEING 737-700', 149, 'ACTIVO'),
('XA-JKL', 'EMBRAER E190', 100, 'MANTENIMIENTO');

-- ============================================
-- 7. ASIENTOS (SOLO PARA UN AVION DE PRUEBA)
-- ============================================
-- Asientos para Boeing 737-800 (XA-ABC) - Solo algunas filas de ejemplo
INSERT INTO Asiento (id_avion, codigo_asiento, fila, columna, clase, ubicacion) VALUES 
-- Primera Clase (Filas 1-3)
(1, '1A', 1, 'A', 'Primera', 'Ventana'),
(1, '1B', 1, 'B', 'Primera', 'Pasillo'),
(1, '1C', 1, 'C', 'Primera', 'Pasillo'),
(1, '1D', 1, 'D', 'Primera', 'Ventana'),
(1, '2A', 2, 'A', 'Primera', 'Ventana'),
(1, '2B', 2, 'B', 'Primera', 'Pasillo'),
(1, '2C', 2, 'C', 'Primera', 'Pasillo'),
(1, '2D', 2, 'D', 'Primera', 'Ventana');

INSERT INTO Asiento (id_avion, codigo_asiento, fila, columna, clase, ubicacion) VALUES 
-- Ejecutiva (Filas 4-8)
(1, '4A', 4, 'A', 'Ejecutiva', 'Ventana'),
(1, '4B', 4, 'B', 'Ejecutiva', 'Centro'),
(1, '4C', 4, 'C', 'Ejecutiva', 'Centro'),
(1, '4D', 4, 'D', 'Ejecutiva', 'Centro'),
(1, '4E', 4, 'E', 'Ejecutiva', 'Centro'),
(1, '4F', 4, 'F', 'Ejecutiva', 'Ventana'),
(1, '5A', 5, 'A', 'Ejecutiva', 'Ventana'),
(1, '5B', 5, 'B', 'Ejecutiva', 'Centro'),
(1, '5C', 5, 'C', 'Ejecutiva', 'Centro'),
(1, '5D', 5, 'D', 'Ejecutiva', 'Centro'),
(1, '5E', 5, 'E', 'Ejecutiva', 'Centro'),
(1, '5F', 5, 'F', 'Ejecutiva', 'Ventana');

INSERT INTO Asiento (id_avion, codigo_asiento, fila, columna, clase, ubicacion) VALUES 
-- Económica (Filas 10-15 como ejemplo)
(1, '10A', 10, 'A', 'Económica', 'Ventana'),
(1, '10B', 10, 'B', 'Económica', 'Centro'),
(1, '10C', 10, 'C', 'Económica', 'Centro'),
(1, '10D', 10, 'D', 'Económica', 'Centro'),
(1, '10E', 10, 'E', 'Económica', 'Centro'),
(1, '10F', 10, 'F', 'Económica', 'Ventana'),
(1, '11A', 11, 'A', 'Económica', 'Ventana'),
(1, '11B', 11, 'B', 'Económica', 'Centro'),
(1, '11C', 11, 'C', 'Económica', 'Centro'),
(1, '11D', 11, 'D', 'Económica', 'Centro'),
(1, '11E', 11, 'E', 'Económica', 'Centro'),
(1, '11F', 11, 'F', 'Económica', 'Ventana'),
(1, '12A', 12, 'A', 'Económica', 'Ventana'),
(1, '12B', 12, 'B', 'Económica', 'Centro'),
(1, '12C', 12, 'C', 'Económica', 'Centro'),
(1, '12D', 12, 'D', 'Económica', 'Centro'),
(1, '12E', 12, 'E', 'Económica', 'Centro'),
(1, '12F', 12, 'F', 'Económica', 'Ventana');

-- ============================================
-- 8. RUTAS
-- ============================================
INSERT INTO Ruta (distancia, id_origen, id_destino) VALUES 
(1090.5, 1, 2), -- MEX -> GDL
(925.3, 1, 3),  -- MEX -> MTY
(1315.2, 1, 4), -- MEX -> CUN
(2485.7, 1, 5), -- MEX -> TIJ
(1245.8, 1, 6), -- MEX -> MID
(1456.2, 2, 4), -- GDL -> CUN
(890.1, 2, 3);  -- GDL -> MTY

-- ============================================
-- 9. VUELOS
-- ============================================
INSERT INTO Vuelo (numero_vuelo, duracion, id_ruta) VALUES 
('AM101', '01:45:00', 1), -- MEX -> GDL
('AM102', '01:45:00', 1), -- GDL -> MEX (ruta inversa)
('AM201', '01:30:00', 2), -- MEX -> MTY
('AM202', '01:30:00', 2), -- MTY -> MEX
('AM301', '02:15:00', 3), -- MEX -> CUN
('AM302', '02:15:00', 3), -- CUN -> MEX
('AM401', '03:30:00', 4), -- MEX -> TIJ
('AM501', '02:00:00', 5); -- MEX -> MID

INSERT INTO Instancia_Vuelo (fecha_salida, fecha_llegada, estado_vuelo, id_vuelo, id_avion, id_tripulacion) VALUES 
-- Vuelos de mañana
('2025-11-21 08:00:00', '2025-11-21 09:45:00', 'PROGRAMADO', 1, 1, 1),
('2025-11-21 10:30:00', '2025-11-21 12:00:00', 'PROGRAMADO', 3, 2, 2),
('2025-11-21 14:00:00', '2025-11-21 16:15:00', 'PROGRAMADO', 5, 1, 3),
('2025-11-21 18:30:00', '2025-11-21 22:00:00', 'PROGRAMADO', 7, 3, 1),

-- Vuelos de pasado mañana
('2025-11-22 07:30:00', '2025-11-22 09:15:00', 'PROGRAMADO', 1, 2, 1),
('2025-11-22 11:00:00', '2025-11-22 12:30:00', 'PROGRAMADO', 3, 1, 2),
('2025-11-22 15:30:00', '2025-11-22 17:45:00', 'PROGRAMADO', 5, 3, 3),

-- Vuelos de la próxima semana
('2025-11-25 09:00:00', '2025-11-25 10:45:00', 'PROGRAMADO', 1, 1, 3),
('2025-11-25 13:00:00', '2025-11-25 14:30:00', 'PROGRAMADO', 3, 2, 1);

-- ============================================
-- 11. CLIENTES DE PRUEBA
-- ============================================
INSERT INTO Cliente (nombre, apellido_p, apellido_m, telefono, correo, calle, numero, colonia, ciudad, estado, codigo_postal) VALUES 
('JUAN', 'PEREZ', 'LOPEZ', '5551234567', 'JUAN.PEREZ@EMAIL.COM', 'REFORMA', '123', 'CENTRO', 'CIUDAD DE MEXICO', 'CDMX', '06000'),
('MARIA', 'GONZALEZ', 'MARTINEZ', '5559876543', 'MARIA.GONZALEZ@EMAIL.COM', 'INSURGENTES', '456', 'ROMA', 'CIUDAD DE MEXICO', 'CDMX', '06700'),
('CARLOS', 'RODRIGUEZ', 'SANCHEZ', '3331234567', 'CARLOS.RODRIGUEZ@EMAIL.COM', 'VALLARTA', '789', 'CENTRO', 'GUADALAJARA', 'JALISCO', '44100'),
('ANA', 'MARTINEZ', 'GARCIA', '8181234567', 'ANA.MARTINEZ@EMAIL.COM', 'HIDALGO', '321', 'CENTRO', 'MONTERREY', 'NUEVO LEON', '64000');

-- ============================================
-- 12. MÉTODOS DE PAGO
-- ============================================
INSERT INTO Metodo_Pago (nombre, descripcion) VALUES 
('TARJETA DE CREDITO', 'PAGO CON TARJETA DE CREDITO'),
('TARJETA DE DEBITO', 'PAGO CON TARJETA DE DEBITO'),
('EFECTIVO', 'PAGO EN EFECTIVO'),
('TRANSFERENCIA', 'TRANSFERENCIA BANCARIA'),
('PAYPAL', 'PAGO CON PAYPAL');

-- ============================================
-- 13. TARIFAS
-- ============================================
INSERT INTO Tarifa (nombre, clase, precio_base, descripcion, activo) VALUES 
('TARIFA ECONOMICA NACIONAL', 'ECONOMICA', 1500.00, 'TARIFA BASICA PARA VUELOS NACIONALES', 1),
('TARIFA EJECUTIVA NACIONAL', 'EJECUTIVA', 2500.00, 'TARIFA EJECUTIVA PARA VUELOS NACIONALES', 1),
('TARIFA PRIMERA CLASE', 'PRIMERA', 4000.00, 'TARIFA PRIMERA CLASE PARA VUELOS NACIONALES', 1),
('TARIFA ECONOMICA PROMOCIONAL', 'Económica', 1200.00, 'TARIFA PROMOCIONAL ECONOMICA', 1);

-- ============================================
-- 14. IMPUESTOS
-- ============================================
INSERT INTO Impuesto (nombre, porcentaje, descripcion) VALUES 
('IVA', 16.00, 'IMPUESTO AL VALOR AGREGADO'),
('TUA', 5.00, 'TARIFA DE USO DE AEROPUERTO'),
('SEGURIDAD', 2.50, 'TASA DE SEGURIDAD AEROPORTUARIA');

