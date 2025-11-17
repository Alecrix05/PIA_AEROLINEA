# ANÁLISIS Y PLAN DE MEJORAS - Sistema de Venta de Boletos de Avión

## 📋 RESUMEN EJECUTIVO

Este documento analiza el estado actual del proyecto y propone mejoras estructuradas para convertirlo en una aplicación web profesional lista para producción.

---

## 🔍 ANÁLISIS DEL ESTADO ACTUAL

### ✅ Fortalezas
1. **Modelo de datos completo**: Incluye todas las entidades necesarias (22 modelos)
2. **Estructura bien organizada**: Separación clara en capas (model, repository, service, controller)
3. **Base de datos robusta**: Script SQL con triggers, procedimientos y vistas
4. **Relaciones bien definidas**: Foreign keys y relaciones Many-to-One correctas (en su mayoría)

### ⚠️ Problemas Identificados

#### 1. INCONSISTENCIAS EN MODELOS

**Asiento.java**
```java
// ACTUAL (Incorrecto)
@Column(name = "id_avion", nullable = false)
private Integer idAvion;

// DEBERÍA SER
@ManyToOne
@JoinColumn(name = "id_avion")
private Avion avion;
```

**VentaImpuesto.java**
```java
// ACTUAL (Sin relaciones)
private Integer idDetalle;
private Integer idImpuesto;

// DEBERÍA TENER
@ManyToOne
@JoinColumn(name = "id_detalle")
private VentaDetalle detalle;

@ManyToOne
@JoinColumn(name = "id_impuesto")
private Impuesto impuesto;
```

**Pasajero.java**
- Campo `pasaporte` como `byte[]` sin manejo de encriptación
- En BD usa AES_ENCRYPT pero no se usa desde Java

**Tarifa.java**
- En BD es ENUM pero en Java es String

#### 2. ARQUITECTURA

**❌ Falta:**
- DTOs (Data Transfer Objects)
- Manejo global de excepciones
- Configuración de CORS para frontend
- Validaciones con Bean Validation (@NotNull, @Email, @Size, etc.)
- Paginación en listados
- Spring Security

**⚠️ Consecuencias:**
- Las entidades JPA se exponen directamente al frontend (problema de seguridad)
- No hay control sobre qué datos se envían/reciben
- Problemas de lazy loading en relaciones
- Sin validación de datos de entrada
- Mensajes de error inconsistentes

#### 3. LÓGICA DE NEGOCIO FALTANTE

**Crítico:**
- ❌ No valida disponibilidad de asientos
- ❌ No controla capacidad del avión vs boletos vendidos
- ❌ No previene overbooking
- ❌ No genera códigos automáticos (boletos, reservas)
- ❌ No calcula precios con impuestos automáticamente
- ❌ No valida fechas (permite vender boletos pasados)
- ❌ No hay flujo de compra (carrito → pago → confirmación)

**Importante:**
- ⚠️ No valida que un cliente no compre el mismo asiento 2 veces
- ⚠️ No verifica horarios de vuelos (que no se solapen)
- ⚠️ No valida edad de pasajeros (menores, mayores)
- ⚠️ No hay cancelaciones con políticas

#### 4. API REST

**Endpoints faltantes para una app web:**
```
✅ TIENE:
- CRUD básico de todas las entidades

❌ FALTA:
- POST /api/vuelos/buscar (origen, destino, fecha)
- GET /api/vuelos/{id}/asientos-disponibles
- POST /api/compra/iniciar (crear carrito)
- POST /api/compra/confirmar (procesar pago)
- GET /api/clientes/{id}/mis-boletos
- PUT /api/reservas/{id}/cancelar
- GET /api/vuelos/proximos
- POST /api/auth/login
- POST /api/auth/register
```

#### 5. PARA FRONTEND WEB

**Necesidades:**
1. **Autenticación**: Login, registro, recuperar contraseña
2. **Sesiones**: Manejo de usuario logueado
3. **Flujo de compra**: Carrito, pago, confirmación
4. **Consultas**: Mis reservas, mis boletos, historial
5. **CORS**: Permitir peticiones desde React/Angular/Vue
6. **File Upload**: Para documentos de pasajeros

---

## 🎯 PLAN DE MEJORAS (FASES)

### 📦 FASE 1 - CORRECCIONES CRÍTICAS (PRIORIDAD ALTA)

#### 1.1 Corregir Modelos
- [x] Asiento: Cambiar Integer idAvion → @ManyToOne Avion
- [ ] VentaImpuesto: Agregar relaciones @ManyToOne
- [ ] Pasajero: Mejorar manejo de pasaporte (String + validación)
- [ ] Tarifa: Usar Enum para clase

#### 1.2 Crear DTOs
```
dto/
  ├── ClienteDTO.java
  ├── BoletoDTO.java
  ├── VueloDTO.java
  ├── ReservaDTO.java
  ├── CompraRequestDTO.java
  └── ResponseDTO.java (genérico)
```

#### 1.3 Configuraciones Globales
- [ ] GlobalExceptionHandler (manejo de errores)
- [ ] CorsConfiguration (permitir frontend)
- [ ] ResponseEntityBuilder (respuestas estándar)

#### 1.4 Validaciones
- [ ] Agregar @Valid en controllers
- [ ] Bean Validation en DTOs (@NotNull, @Email, @Size, @Min, @Max)
- [ ] Validaciones custom (@FechaFutura, @EdadMinima)

#### 1.5 Paginación
```java
@GetMapping
public Page<ClienteDTO> listar(Pageable pageable) {
    return service.listar(pageable);
}
```

### 🔧 FASE 2 - LÓGICA DE NEGOCIO (PRIORIDAD ALTA)

#### 2.1 Servicio de Búsqueda de Vuelos
```java
@Service
public class BusquedaVueloService {
    List<VueloDisponibleDTO> buscarVuelos(
        Integer idOrigen, 
        Integer idDestino, 
        LocalDate fecha,
        Integer pasajeros
    );
    
    Map<String, Boolean> obtenerAsientosDisponibles(Integer idInstanciaVuelo);
}
```

#### 2.2 Servicio de Compra
```java
@Service
public class CompraService {
    CompraDTO iniciarCompra(CompraRequestDTO request);
    CompraDTO agregarPasajero(Integer idCompra, PasajeroDTO pasajero);
    CompraDTO seleccionarAsiento(Integer idCompra, String codigoAsiento);
    PagoDTO procesarPago(Integer idCompra, PagoRequestDTO pago);
    BoletoDTO confirmarCompra(Integer idCompra);
}
```

#### 2.3 Validaciones de Negocio
- [ ] Disponibilidad de asientos
- [ ] Capacidad del avión
- [ ] Fechas futuras
- [ ] Duplicados (mismo pasajero, mismo vuelo)
- [ ] Stock de boletos

#### 2.4 Generadores Automáticos
```java
@Service
public class CodigoGeneratorService {
    String generarCodigoBoleto(); // BLT-2025-001234
    String generarCodigoReserva(); // RES-2025-001234
}
```

#### 2.5 Calculadora de Precios
```java
@Service
public class PrecioCalculatorService {
    BigDecimal calcularPrecioTotal(
        Integer idTarifa,
        List<Integer> idsImpuestos,
        Integer cantidad
    );
}
```

### 🔐 FASE 3 - SEGURIDAD Y AUTENTICACIÓN (PRIORIDAD MEDIA)

#### 3.1 Spring Security + JWT
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
</dependency>
```

#### 3.2 Modelo de Usuario
```java
@Entity
public class Usuario {
    private String username;
    private String password; // BCrypt
    private String email;
    private Set<Role> roles; // ADMIN, EMPLEADO, CLIENTE
    @OneToOne
    private Cliente cliente; // Si es cliente
}
```

#### 3.3 Endpoints de Autenticación
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
GET /api/auth/me
```

#### 3.4 Seguridad por Roles
```java
@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/{id}")
public void eliminar(@PathVariable Integer id)

@PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO')")
@GetMapping("/admin/reportes")
public void reportes()
```

### 🚀 FASE 4 - FEATURES AVANZADAS (PRIORIDAD BAJA)

#### 4.1 Búsqueda y Filtros
- Vuelos por rango de fechas
- Vuelos por rango de precios
- Búsqueda por ciudad
- Ordenamiento (precio, duración, horario)

#### 4.2 Reportes
- Ventas por período
- Vuelos más vendidos
- Ocupación de vuelos
- Ingresos por ruta

#### 4.3 Notificaciones
- Email de confirmación de compra
- Email de recordatorio de vuelo
- SMS con código de boleto

#### 4.4 File Upload
- Subir documento de pasajero
- Foto de perfil de cliente
- Comprobante de pago

---

## 📝 ESTRUCTURA DE CARPETAS PROPUESTA

```
src/main/java/com/aerolinea/
├── config/
│   ├── CorsConfig.java
│   ├── SecurityConfig.java
│   └── SwaggerConfig.java
├── controller/
│   ├── api/            (REST endpoints)
│   └── advice/         (Global exception handler)
├── dto/
│   ├── request/        (DTOs para peticiones)
│   ├── response/       (DTOs para respuestas)
│   └── mapper/         (Entity ↔ DTO)
├── exception/
│   ├── BusinessException.java
│   ├── NotFoundException.java
│   └── ValidationException.java
├── model/              (Entidades JPA)
├── repository/         (JPA Repositories)
├── service/
│   ├── impl/           (Implementaciones)
│   └── business/       (Lógica de negocio)
├── security/
│   ├── jwt/
│   └── UserDetailsServiceImpl.java
├── util/
│   ├── DateUtils.java
│   └── Constants.java
└── validation/         (Validadores custom)
```

---

## 🛠️ DEPENDENCIAS ADICIONALES RECOMENDADAS

```xml
<!-- Validación -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

<!-- MapStruct para mapeo DTO -->
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.5.5.Final</version>
</dependency>

<!-- Lombok (reducir boilerplate) -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>

<!-- Documentación API (Swagger) -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.0.4</version>
</dependency>

<!-- Email -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

---

## 📊 ENDPOINTS PARA FRONTEND WEB

### Flujo de Usuario Cliente

```
1. BUSCAR VUELOS
   POST /api/vuelos/buscar
   {
     "origen": 1,
     "destino": 2,
     "fecha": "2025-06-15",
     "pasajeros": 2
   }

2. VER DETALLES DE VUELO
   GET /api/vuelos/{id}
   GET /api/instancias-vuelo/{id}/asientos-disponibles

3. INICIAR COMPRA
   POST /api/compra/iniciar
   {
     "idInstanciaVuelo": 1,
     "pasajeros": [...]
   }

4. SELECCIONAR ASIENTOS
   POST /api/compra/{id}/asientos
   {
     "asientos": ["1A", "1B"]
   }

5. PROCESAR PAGO
   POST /api/compra/{id}/pagar
   {
     "metodoPago": 1,
     "datosPago": {...}
   }

6. CONFIRMAR Y OBTENER BOLETO
   GET /api/compra/{id}/confirmar
```

---

## ⏰ TIMELINE ESTIMADO

| Fase | Duración | Esfuerzo |
|------|----------|----------|
| Fase 1 - Correcciones | 2-3 días | Alto |
| Fase 2 - Lógica Negocio | 4-5 días | Alto |
| Fase 3 - Seguridad | 2-3 días | Medio |
| Fase 4 - Features | 3-4 días | Bajo |
| **TOTAL** | **11-15 días** | - |

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

1. ✅ Revisar este análisis
2. ⬜ Corregir modelo Asiento
3. ⬜ Crear estructura de DTOs
4. ⬜ Implementar GlobalExceptionHandler
5. ⬜ Configurar CORS
6. ⬜ Agregar validaciones básicas
7. ⬜ Crear servicio de búsqueda de vuelos
8. ⬜ Implementar flujo de compra

---

## 📞 NOTAS FINALES

- Este proyecto tiene excelente potencial
- La base de datos está bien diseñada
- Se necesita reforzar la capa de lógica de negocio
- Priorizar seguridad antes de producción
- Documentar la API con Swagger

---

**Fecha de análisis:** 16 de Noviembre, 2025  
**Versión:** 1.0  
**Estado:** Pendiente de implementación
