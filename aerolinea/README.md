# 🛫 Sistema de Venta de Boletos de Avión - API REST

Sistema completo de gestión y venta de boletos de avión desarrollado con Spring Boot.

## 📋 Descripción

API REST para la gestión completa de una aerolínea, incluyendo:
- ✈️ Gestión de vuelos, rutas y horarios
- 🎫 Venta de boletos en línea
- 👥 Administración de clientes y pasajeros
- 💺 Gestión de asientos y disponibilidad
- 💳 Procesamiento de pagos
- 📊 Consultas y reportes

## 🚀 Características Principales

### ✅ Implementadas (FASE 1 & 2)

- **Búsqueda de Vuelos**: Buscar vuelos por origen, destino y fecha
- **Mapa de Asientos**: Ver asientos disponibles y ocupados en tiempo real
- **Proceso de Compra Completo**: 
  - Validación de disponibilidad
  - Selección de asientos
  - Creación de reservas
  - Generación de boletos
  - Procesamiento de pagos
- **Consultas de Cliente**:
  - Mis boletos
  - Mis reservas
  - Historial de compras
- **Gestión CRUD** de todas las entidades
- **Manejo Global de Excepciones**
- **CORS habilitado** para frontend
- **Validación de negocio**:
  - Prevención de overbooking
  - Validación de asientos duplicados
  - Control de capacidad de aviones
- **Generación automática de códigos** (boletos y reservas)

## 🛠️ Tecnologías

- **Java 17**
- **Spring Boot 3.5.7**
- **Spring Data JPA**
- **MySQL 8**
- **Maven**

## 📦 Instalación

### Prerrequisitos

- JDK 17 o superior
- MySQL 8
- Maven

### Pasos

1. **Clonar el repositorio**
```bash
cd aerolinea
```

2. **Configurar la base de datos**

Ejecutar el script SQL:
```bash
mysql -u root -p < BD_aerolinea.sql
```

3. **Configurar application.properties**

Editar `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/aerolinea
spring.datasource.username=root
spring.datasource.password=TU_CONTRASEÑA
```

4. **Compilar y ejecutar**
```bash
mvnw clean install
mvnw spring-boot:run
```

La API estará disponible en: `http://localhost:8080`

## 📚 Endpoints de la API

### 🔍 Búsqueda de Vuelos

#### Buscar vuelos disponibles
```http
GET /api/busqueda/vuelos?origen=1&destino=2&fecha=2025-06-15&pasajeros=2
```

**Respuesta:**
```json
[
  {
    "idInstanciaVuelo": 1,
    "numeroVuelo": "AM101",
    "fechaSalida": "2025-06-15T08:00:00",
    "fechaLlegada": "2025-06-15T09:45:00",
    "duracion": "01:45:00",
    "origen": "Aeropuerto Internacional Benito Juárez",
    "destino": "Aeropuerto Internacional de Monterrey",
    "asientosDisponibles": 150,
    "capacidad": 189
  }
]
```

#### Ver mapa de asientos
```http
GET /api/busqueda/vuelos/1/asientos
```

**Respuesta:**
```json
{
  "asientos": [
    {
      "idAsiento": 1,
      "codigo": "1A",
      "fila": 1,
      "columna": "A",
      "clase": "Ejecutiva",
      "ubicacion": "Ventana",
      "disponible": true
    }
  ],
  "totalAsientos": 189,
  "asientosDisponibles": 150,
  "asientosOcupados": 39
}
```

### 🛒 Proceso de Compra

#### Procesar compra completa
```http
POST /api/compra/procesar
Content-Type: application/json

{
  "idCliente": 1,
  "idInstanciaVuelo": 1,
  "idMetodoPago": 1,
  "pasajeros": [
    {
      "nombre": "Juan",
      "apellidoP": "Pérez",
      "apellidoM": "González",
      "clase": "Económica",
      "asiento": "12A"
    },
    {
      "idPasajero": 2,
      "clase": "Económica",
      "asiento": "12B"
    }
  ]
}
```

**Respuesta:**
```json
{
  "success": true,
  "mensaje": "Compra procesada exitosamente",
  "reserva": "RES-20251116-000001",
  "idVenta": 1,
  "total": 3000.00,
  "boletos": [
    {
      "numeroBoleto": "BLT-20251116-000001",
      "pasajero": "Juan Pérez",
      "asiento": "12A",
      "clase": "Económica",
      "precio": 1500.00
    }
  ]
}
```

### 👤 Consultas de Cliente

#### Mis boletos
```http
GET /api/consulta/clientes/1/boletos
```

#### Mis reservas
```http
GET /api/consulta/clientes/1/reservas
```

#### Historial de compras
```http
GET /api/consulta/clientes/1/historial
```

#### Detalle de un boleto
```http
GET /api/consulta/boletos/1
```

**Respuesta:**
```json
{
  "idBoleto": 1,
  "numeroBoleto": "BLT-20251116-000001",
  "fechaEmision": "2025-11-16",
  "precio": 1500.00,
  "clase": "Económica",
  "estado": "ACTIVO",
  "pasajero": {
    "nombre": "Juan",
    "apellidoP": "Pérez",
    "apellidoM": "González"
  },
  "asiento": "12A",
  "ubicacion": "Ventana",
  "vuelo": {
    "numeroVuelo": "AM101",
    "duracion": "01:45:00",
    "origen": "Aeropuerto Internacional Benito Juárez",
    "codigoOrigen": "MEX",
    "destino": "Aeropuerto Internacional de Monterrey",
    "codigoDestino": "MTY",
    "fechaSalida": "2025-06-15T08:00:00",
    "fechaLlegada": "2025-06-15T09:45:00",
    "estadoVuelo": "PROGRAMADO"
  },
  "codigoReserva": "RES-20251116-000001"
}
```

### 📋 CRUD Básico

Todos los endpoints CRUD están disponibles para:

- `/api/clientes`
- `/api/pasajeros`
- `/api/reservas`
- `/api/boletos`
- `/api/ciudades`
- `/api/aeropuertos`
- `/api/rutas`
- `/api/vuelos`
- `/api/instancias-vuelo`
- `/api/aviones`
- `/api/asientos`
- `/api/tarifas`
- `/api/departamentos`
- `/api/empleados`
- `/api/tripulaciones`
- `/api/ventas`
- `/api/venta-detalle`
- `/api/pagos`
- `/api/metodos-pago`
- `/api/impuestos`

Operaciones disponibles: GET (all), GET (by id), POST, PUT, DELETE

## 📁 Estructura del Proyecto

```
src/main/java/com/aerolinea/
├── controller/          # Controladores REST
│   ├── BusquedaVueloController.java
│   ├── CompraController.java
│   ├── ConsultaController.java
│   ├── CorsConfig.java
│   ├── GlobalExceptionHandler.java
│   └── [otros controladores CRUD]
├── model/              # Entidades JPA
│   ├── Cliente.java
│   ├── Boleto.java
│   ├── Vuelo.java
│   └── [22 entidades en total]
├── repository/         # Repositorios JPA
├── service/           # Lógica de negocio
│   ├── BusquedaVueloService.java
│   ├── CompraService.java
│   ├── ConsultaService.java
│   └── CodigoGeneratorService.java
└── AerolineaApplication.java
```

## 🔧 Configuración

### CORS
CORS está configurado para permitir cualquier origen en desarrollo. Para producción, modificar:
```java
// CorsConfig.java
config.setAllowedOriginPatterns(Arrays.asList("https://tu-dominio.com"));
```

### Base de Datos
La aplicación usa `spring.jpa.hibernate.ddl-auto=none` para no modificar el esquema automáticamente.

## 🧪 Pruebas

### Archivo de pruebas HTTP
Se incluye `api-tests.http` con ejemplos de todas las peticiones. 

Usar con extensiones como:
- REST Client (VS Code)
- HTTP Client (IntelliJ IDEA)

## 📊 Modelo de Datos

### Entidades Principales

- **Cliente**: Información de clientes
- **Pasajero**: Datos de pasajeros (puede haber varios por cliente)
- **Reserva**: Reservaciones de vuelos
- **Boleto**: Boletos emitidos
- **Vuelo**: Información de vuelos (número, duración)
- **InstanciaVuelo**: Instancias específicas de vuelos (con fecha/hora)
- **Ruta**: Rutas entre aeropuertos
- **Aeropuerto**: Aeropuertos
- **Ciudad**: Ciudades
- **Avion**: Aviones de la flota
- **Asiento**: Asientos de los aviones
- **Tarifa**: Tarifas por clase
- **VentaEncabezado**: Encabezados de ventas
- **VentaDetalle**: Detalles de ventas
- **Pago**: Pagos realizados
- **MetodoPago**: Métodos de pago disponibles
- **Impuesto**: Impuestos aplicables
- **Empleado**: Empleados de la aerolínea
- **Departamento**: Departamentos
- **Tripulacion**: Tripulaciones de vuelos

## 🎯 Funcionalidades de Negocio

### Validaciones Implementadas

✅ **Disponibilidad de Asientos**: Verifica que haya asientos disponibles antes de vender  
✅ **Prevención de Overbooking**: No permite vender más boletos que la capacidad del avión  
✅ **Asientos Duplicados**: Evita que se venda el mismo asiento dos veces  
✅ **Vuelos Disponibles**: Solo permite comprar vuelos en estado "PROGRAMADO"  
✅ **Generación de Códigos**: Códigos únicos para boletos y reservas  

### Cálculos Automáticos

- Total de venta
- Impuestos (16%)
- Subtotales por boleto
- Conteo de asientos disponibles

## 🔜 Próximas Funcionalidades (FASE 3)

- [ ] Autenticación con JWT
- [ ] Spring Security
- [ ] Roles de usuario (Admin, Empleado, Cliente)
- [ ] Endpoints protegidos por rol

## 🐛 Manejo de Errores

La API retorna respuestas consistentes para errores:

### Recurso no encontrado (404)
```json
{
  "timestamp": "2025-11-16T23:00:00",
  "status": 404,
  "error": "Recurso no encontrado",
  "message": "Cliente no encontrado con id: '99'",
  "path": "/api/clientes/99"
}
```

### Error de negocio (400)
```json
{
  "timestamp": "2025-11-16T23:00:00",
  "status": 400,
  "error": "Error de negocio",
  "message": "No hay suficientes asientos disponibles",
  "path": "/api/compra/procesar"
}
```

## 📝 Changelog

### v1.1.0 (2025-11-16) - FASE 1 & 2 Completadas
- ✅ Corregido modelo Asiento (ahora usa relación con Avion)
- ✅ Corregido modelo VentaImpuesto (ahora usa relaciones)
- ✅ Agregado CORS para frontend
- ✅ Implementado manejo global de excepciones
- ✅ Creado servicio de búsqueda de vuelos
- ✅ Creado servicio de compra completo
- ✅ Creado servicio de consultas
- ✅ Agregado generador de códigos
- ✅ Validaciones de negocio
- ✅ Endpoints nuevos para frontend

### v1.0.0 - Versión Inicial
- CRUD básico de todas las entidades
- Base de datos configurada
- Estructura de proyecto

## 👥 Contribución

Este es un proyecto académico para la materia de Base de Datos.

## 📄 Licencia

Proyecto académico - Universidad

---

**Desarrollado con ❤️ usando Spring Boot**
