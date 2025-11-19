# Guía de Pruebas - Sistema Aerolínea

## Inicio Rápido

1. **Ejecutar aplicación**: `mvnw spring-boot:run`
2. **Abrir navegador**: `http://localhost:8080`

## Secuencia de Pruebas

### 1️**CONFIGURACIÓN** (Datos base)
```
Dashboard → Configuración
```
- **Ciudades**: Crear 2-3 ciudades (ej: Ciudad de México, Guadalajara)
- **Aeropuertos**: Crear 2-3 aeropuertos vinculados a ciudades (ej: MEX, GDL)
- **Departamentos**: Crear departamentos (ej: Operaciones, Comercial)
- **Métodos de Pago**: Crear métodos (ej: Tarjeta Crédito, Efectivo)
- **Impuestos**: Crear IVA 16%
- **Tarifas**: Crear tarifa económica $1500

### 2️**AERONAVES** (Flota)
```
Dashboard → Aeronaves
```
- **Aviones**: Crear avión (ej: Boeing 737, capacidad 180)
- **Asientos**: Crear asientos para el avión (ej: 1A, 1B, 2A, 2B)

### 3️**PERSONAL** (Recursos humanos)
```
Dashboard → Personal
```
- **Empleados**: Crear empleados con departamentos
- **Tripulaciones**: Crear tripulación con piloto y copiloto

### 4️**COMERCIAL** (Clientes)
```
Dashboard → Comercial
```
- **Clientes**: Crear cliente de prueba
- **Pasajeros**: Crear pasajero vinculado al cliente

### 5️**OPERACIONES** (Vuelos)
```
Dashboard → Operaciones
```
- **Rutas**: Crear ruta MEX → GDL
- **Vuelos**: Crear vuelo AM123 con duración 01:30:00
- **Instancias**: Crear instancia con fecha futura, avión y tripulación

### 6️**BÚSQUEDA Y VENTA** (Proceso completo)
```
Dashboard → Búsqueda
```
- **Buscar vuelos**: Seleccionar origen, destino, fecha
- **Seleccionar vuelo**: Elegir vuelo disponible
- **Registrar cliente**: Completar datos del cliente
- **Procesar compra**: Confirmar compra y generar boleto

## **Verificaciones**

### Dashboard
- Contadores actualizados (clientes, aviones, rutas, ventas)
- Próximos vuelos listados
- Personal activo por departamento

### Gestión de Ventas
- Estadísticas de ventas actualizadas
- Últimos boletos vendidos

## 🔧 **Solución de Problemas**

### Error común: "No hay vuelos disponibles"
- Verificar que la instancia de vuelo tenga fecha futura
- Verificar que el avión tenga asientos creados
- Verificar que el estado del vuelo sea "PROGRAMADO"

### Error: "Cliente no se puede registrar"
- Verificar formato de email válido
- Verificar campos obligatorios (nombre, apellido paterno, email)

### Error: "No se puede procesar compra"
- Verificar que hay métodos de pago creados
- Verificar que el vuelo seleccionado existe
- Verificar que hay asientos disponibles

## **Datos de Prueba Sugeridos**

```
Ciudad: Ciudad de México, CDMX, México
Aeropuerto: Aeropuerto Internacional Benito Juárez, MEX
Avión: Boeing 737, XA-ABC, 180 pasajeros
Vuelo: AM123, 01:30:00
Cliente: Juan Pérez, juan@email.com
Fecha vuelo: Mañana + 1 día
```

## **Tiempo estimado**: 15-20 minutos para prueba completa