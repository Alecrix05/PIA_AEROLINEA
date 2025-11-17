# ⚠️ Escenarios Críticos de Falla - Sistema Aerolínea

## 🚨 ANÁLISIS DE VULNERABILIDADES Y PUNTOS DE FALLA

---

## 🔴 CRÍTICO - Errores que Rompen el Sistema

### 1. Error de Foreign Key al Eliminar (ALTA PROBABILIDAD)

**Escenario:**
```
1. Usuario crea Cliente "Juan Pérez" (ID: 1)
2. Usuario crea Reserva con Cliente 1
3. Usuario intenta eliminar Cliente 1
```

**Qué pasa:**
```
❌ ERROR: FK constraint violation
❌ Backend retorna 500 Internal Server Error
❌ Frontend muestra error genérico
❌ Usuario confundido, no sabe qué hacer
```

**Código Actual (Vulnerable):**
```java
// ClienteController.java
@DeleteMapping("/{id}")
public void eliminar(@PathVariable Integer id) {
    clienteService.delete(id); // ⚠️ BOOM si tiene reservas
}
```

**Cómo Reproducir:**
1. Ir a Clientes, crear uno nuevo
2. Ir a Reservas, crear una con ese cliente
3. Volver a Clientes, eliminar el cliente
4. Ver error en consola

**Solución Inmediata:**
```java
@DeleteMapping("/{id}")
public ResponseEntity<?> eliminar(@PathVariable Integer id) {
    try {
        // Verificar si tiene reservas
        long reservasCount = reservaRepository.countByClienteId(id);
        if (reservasCount > 0) {
            return ResponseEntity
                .badRequest()
                .body(Map.of("error", "No se puede eliminar. El cliente tiene " + 
                      reservasCount + " reserva(s) asociada(s)"));
        }
        
        clienteService.delete(id);
        return ResponseEntity.ok().build();
        
    } catch (Exception e) {
        return ResponseEntity
            .status(500)
            .body(Map.of("error", "Error al eliminar: " + e.getMessage()));
    }
}
```

**Módulos Afectados:**
- ❌ Clientes (con Reservas, Pasajeros)
- ❌ Pasajeros (con Boletos)
- ❌ Vuelos (con Instancias)
- ❌ InstanciasVuelo (con Boletos)
- ❌ Reservas (con Boletos)

---

### 2. Selectores Vacíos Bloquean Funcionalidad (ALTA PROBABILIDAD)

**Escenario A: Sin Clientes - No puede crear Reservas**
```
Estado Inicial: Base de datos vacía

Usuario:
1. Va a Reservas
2. Ve select de clientes vacío
3. No puede crear reserva
4. No hay mensaje que indique qué hacer
```

**Qué pasa:**
```
❌ Formulario habilitado pero inútil
❌ Usuario no sabe que debe crear clientes primero
❌ Intenta enviar → Error "Debe seleccionar cliente"
❌ Usuario frustrado
```

**Solución Frontend:**
```javascript
// reservas.js
function cargarClientesSelect() {
    const select = document.getElementById('reservaCliente');
    
    if (clientesDisponibles.length === 0) {
        // Deshabilitar formulario
        document.getElementById('formReserva')
            .querySelectorAll('input, select, button')
            .forEach(el => el.disabled = true);
        
        // Mostrar mensaje claro
        const alerta = document.createElement('div');
        alerta.className = 'alert alert-warning';
        alerta.innerHTML = `
            <strong>⚠️ No hay clientes disponibles</strong><br>
            Debe <a href="#" onclick="showSection('clientes')">crear clientes</a> 
            antes de crear reservas.
        `;
        document.getElementById('formReserva').before(alerta);
        return;
    }
    
    // Código normal...
}
```

**Escenario B: Sin Vuelos - No puede crear Instancias**
```
Similar al anterior, pero más crítico porque:
- Instancias requieren Vuelos Y Aviones
- Si falta cualquiera, está bloqueado
```

**Módulos Afectados:**
- ⚠️ Reservas (necesita Clientes)
- ⚠️ Boletos (necesita Pasajeros - crítico)
- ⚠️ Boletos (necesita Reservas, Instancias - opcional)
- ⚠️ Instancias (necesita Vuelos Y Aviones - crítico)
- ⚠️ Vuelos (necesita Rutas - opcional pero recomendado)

---

### 3. Duplicado de Códigos por Concurrencia (MEDIA PROBABILIDAD)

**Escenario:**
```
Tiempo: 2025-11-17 10:30:45.123
Usuario A: Crea reserva → Código: RES-20251117-123456
Usuario B: Crea reserva → Código: RES-20251117-123456 (MISMO!)
```

**Qué pasa:**
```
✅ Frontend genera código único (Math.random diferente)
❌ PERO si dos usuarios hacen click exactamente al mismo millisegundo...
❌ Posible duplicado
❌ Error de unique constraint si existe en BD
```

**Código Actual (Vulnerable):**
```javascript
function generarCodigoReserva() {
    const fecha = new Date();
    const numero = `RES-${fecha.getFullYear()}${
        String(fecha.getMonth() + 1).padStart(2, '0')}${
        String(fecha.getDate()).padStart(2, '0')}-${
        Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    return numero;
}
```

**Probabilidad:** Baja en uso normal, pero existe

**Solución:**
```javascript
// Opción 1: Timestamp más granular
function generarCodigoReserva() {
    const timestamp = Date.now(); // milliseconds
    const random = Math.floor(Math.random() * 10000);
    return `RES-${timestamp}-${random}`;
}

// Opción 2: UUID (mejor)
function generarCodigoReserva() {
    const timestamp = Date.now();
    return `RES-${timestamp}-${crypto.randomUUID().slice(0, 8)}`;
}

// Opción 3: Dejar que backend genere (mejor aún)
// Backend usa secuencia de BD o UUID
```

**Backend Solución:**
```java
@PrePersist
public void generarCodigo() {
    if (this.codigoReserva == null) {
        LocalDate fecha = LocalDate.now();
        String random = UUID.randomUUID().toString().substring(0, 6);
        this.codigoReserva = String.format("RES-%s-%s",
            fecha.format(DateTimeFormatter.BASIC_ISO_DATE),
            random);
    }
}
```

---

### 4. Precio Negativo o Cero en Boletos (MEDIA-ALTA)

**Escenario:**
```
Usuario malicioso o error:
1. Inspecciona elemento en navegador
2. Cambia min="0" a min="-100"
3. Ingresa precio: -50
4. Envía formulario
```

**Qué pasa:**
```
✅ Frontend valida precio > 0
❌ PERO usuario puede manipular HTML
❌ Si elimina validación frontend...
❌ Backend podría aceptar precio negativo
```

**Código Backend (Vulnerable si no tiene validación):**
```java
// Boleto.java
@NotNull(message = "El precio es requerido")
@Column(name = "precio")
private Double precio;  // ⚠️ Acepta negativos!
```

**Solución:**
```java
@NotNull(message = "El precio es requerido")
@DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
@Column(name = "precio")
private Double precio;
```

**Validar SIEMPRE en Backend, no confiar en Frontend**

---

### 5. Fecha de Llegada Antes de Salida (ALTA PROBABILIDAD)

**Escenario:**
```
InstanciaVuelo:
- Fecha Salida: 2025-11-20 12:00
- Fecha Llegada: 2025-11-20 10:00
```

**Qué pasa:**
```
✅ Frontend valida: llegada > salida
❌ Usuario puede manipular formulario
❌ O error de usuario al editar
```

**Solución Backend:**
```java
// InstanciaVuelo.java
@PrePersist
@PreUpdate
public void validarFechas() {
    if (fechaLlegada != null && fechaSalida != null) {
        if (fechaLlegada.isBefore(fechaSalida) || 
            fechaLlegada.isEqual(fechaSalida)) {
            throw new IllegalArgumentException(
                "Fecha de llegada debe ser posterior a fecha de salida"
            );
        }
    }
}
```

---

### 6. Email Duplicado - Race Condition (BAJA PROBABILIDAD)

**Escenario:**
```
Tiempo 0ms: Usuario A envía cliente@email.com
Tiempo 5ms: Usuario B envía cliente@email.com

Backend:
Thread 1: Valida → No existe → Procede a guardar
Thread 2: Valida → No existe → Procede a guardar
Ambos: Intentan INSERT
```

**Qué pasa:**
```
✅ @Column(unique = true) en BD
❌ Uno de los dos falla con error SQL
❌ Usuario ve error no amigable
```

**Solución:**
```java
@PostMapping
public ResponseEntity<?> agregar(@Valid @RequestBody Cliente cliente, 
                                  BindingResult result) {
    try {
        Cliente nuevoCliente = clienteService.save(cliente);
        return ResponseEntity.ok(nuevoCliente);
        
    } catch (DataIntegrityViolationException e) {
        if (e.getMessage().contains("correo")) {
            return ResponseEntity
                .badRequest()
                .body(Map.of("error", "El correo ya está registrado"));
        }
        throw e;
    }
}
```

---

## 🟡 MEDIO - Errores que Degradan Experiencia

### 7. Búsqueda No Encuentra por Acentos

**Escenario:**
```
Cliente: "José Pérez"
Búsqueda: "jose perez"
```

**Qué pasa:**
```
❌ No encuentra porque compara exacto
❌ Usuario piensa que no existe
```

**Solución:**
```javascript
function filtrarClientes(textoBusqueda) {
    const normalizar = str => str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    
    const textoBusquedaNormalizado = normalizar(textoBusqueda);
    
    clientesFiltrados = clientes.filter(cliente => {
        const nombreCompleto = normalizar(
            `${cliente.nombre} ${cliente.apellidoP} ${cliente.apellidoM || ''}`
        );
        return nombreCompleto.includes(textoBusquedaNormalizado);
    });
}
```

---

### 8. Sin Validar Capacidad del Avión

**Escenario:**
```
Avión: Boeing 737 - Capacidad 180 pasajeros
InstanciaVuelo: AA123 del 20/11/2025

Boletos vendidos: 200
```

**Qué pasa:**
```
❌ Sistema permite vender más boletos que capacidad
❌ Overbooking no controlado
❌ Problema operativo
```

**Solución Backend:**
```java
@PostMapping
public ResponseEntity<?> agregar(@RequestBody Boleto boleto) {
    // Validar capacidad si tiene instancia
    if (boleto.getInstanciaVuelo() != null) {
        InstanciaVuelo instancia = instanciaVueloRepository
            .findById(boleto.getInstanciaVuelo().getIdInstanciaVuelo())
            .orElseThrow();
        
        Avion avion = instancia.getAvion();
        long boletosVendidos = boletoRepository
            .countByInstanciaVuelo(instancia);
        
        if (boletosVendidos >= avion.getCapacidad()) {
            return ResponseEntity
                .badRequest()
                .body(Map.of("error", "Vuelo completo. Capacidad: " + 
                      avion.getCapacidad() + ", Vendidos: " + boletosVendidos));
        }
    }
    
    return ResponseEntity.ok(boletoService.save(boleto));
}
```

---

### 9. Avión en Dos Lugares al Mismo Tiempo

**Escenario:**
```
Avión A:
- Instancia 1: 10:00-12:00
- Instancia 2: 11:00-13:00 (CONFLICTO!)
```

**Qué pasa:**
```
❌ Físicamente imposible
❌ Sistema permite crear
❌ Error operativo
```

**Solución:**
```java
public boolean avionDisponible(Integer idAvion, 
                                LocalDateTime salida, 
                                LocalDateTime llegada) {
    List<InstanciaVuelo> instancias = instanciaVueloRepository
        .findByAvionIdAndFechaSalidaBetweenOrFechaLlegadaBetween(
            idAvion, salida, llegada);
    
    return instancias.isEmpty();
}
```

---

### 10. Performance con Muchos Datos

**Escenario:**
```
Sistema con:
- 10,000 clientes
- 50,000 reservas
- 100,000 boletos

Frontend: loadClientes() carga TODOS
```

**Qué pasa:**
```
❌ Lento (varios segundos)
❌ Consume mucha memoria
❌ Búsqueda se vuelve lenta
```

**Solución:**
```java
// Backend: Paginación
@GetMapping
public Page<Cliente> listar(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "50") int size) {
    
    return clienteService.findAll(
        PageRequest.of(page, size, Sort.by("nombre"))
    );
}
```

```javascript
// Frontend: Cargar solo página actual
let paginaActual = 0;
const ITEMS_POR_PAGINA = 50;

async function loadClientes() {
    const response = await fetchAPI(
        `${ENDPOINTS.clientes}?page=${paginaActual}&size=${ITEMS_POR_PAGINA}`
    );
    clientes = response.content;
    renderClientesTable();
    renderPaginacion(response.totalPages);
}
```

---

## 🟢 BAJO - Mejoras de UX

### 11. No Indicar Que Está Editando

**Problema:**
```
Usuario edita cliente
No nota que botón dice "Actualizar"
Piensa que va a crear uno nuevo
```

**Solución:**
```javascript
function editCliente(id) {
    // ... código existente ...
    
    // Resaltar visualmente
    const card = document.querySelector('#formCliente').closest('.card');
    card.classList.add('border-warning');
    card.querySelector('.card-header').innerHTML = 
        '<i class="fas fa-edit"></i> Editando Cliente';
}

function resetClienteForm() {
    // ... código existente ...
    
    // Restaurar visual
    const card = document.querySelector('#formCliente').closest('.card');
    card.classList.remove('border-warning');
    card.querySelector('.card-header').innerHTML = 
        '<i class="fas fa-plus"></i> Nuevo Cliente';
}
```

---

### 12. Validación de Duración > 23 Horas

**Problema:**
```
Vuelo transoceánico: 28 horas
Regex actual: rechaza > 23
```

**Solución:**
```javascript
// Cambiar regex
const duracionRegex = /^([0-9]{1,3}):[0-5][0-9]:[0-5][0-9]$/;
```

---

## 📊 Resumen de Vulnerabilidades

| Prioridad | Escenario | Probabilidad | Impacto | Módulos |
|-----------|-----------|--------------|---------|---------|
| 🔴 CRÍTICO | FK Error al Eliminar | ALTA | ALTO | Todos |
| 🔴 CRÍTICO | Selectores Vacíos | ALTA | ALTO | 5/6 |
| 🟡 MEDIO | Duplicado Códigos | MEDIA | MEDIO | 2/6 |
| 🟡 MEDIO | Precio Negativo | ALTA | MEDIO | Boletos |
| 🟡 MEDIO | Fechas Inválidas | ALTA | MEDIO | Instancias |
| 🟡 MEDIO | Email Duplicado | BAJA | MEDIO | Clientes |
| 🟡 MEDIO | Búsqueda Acentos | ALTA | BAJO | Todos |
| 🟡 MEDIO | Capacidad Avión | ALTA | ALTO | Boletos |
| 🟡 MEDIO | Conflicto Aviones | MEDIA | ALTO | Instancias |
| 🟢 BAJO | Performance | BAJA | MEDIO | Todos |
| 🟢 BAJO | UX Edición | MEDIA | BAJO | Todos |
| 🟢 BAJO | Duración >23h | BAJA | BAJO | Vuelos |

---

## 🛠️ Plan de Mitigación Inmediata

### DEBE HACERSE (Crítico)

1. **Validar FK antes de Eliminar** ✅ 30 min
2. **Manejar Selectores Vacíos** ✅ 30 min
3. **Validar Precio > 0 en Backend** ✅ 5 min
4. **Validar Fechas en Backend** ✅ 10 min

**Total: ~1.5 horas de trabajo**

### DEBERÍA HACERSE (Importante)

5. **Mejorar generación de códigos** ⚠️ 15 min
6. **Validar capacidad avión** ⚠️ 30 min
7. **Manejar error email duplicado** ⚠️ 10 min
8. **Normalizar búsqueda** ⚠️ 15 min

**Total: ~1 hora adicional**

### PUEDE HACERSE (Opcional)

9. **Paginación** ⏸️ 2 horas
10. **Validar conflictos avión** ⏸️ 1 hora
11. **Mejorar UX edición** ⏸️ 30 min

**Total: ~3.5 horas**

---

## ✅ Conclusión

**El sistema es funcional pero tiene vulnerabilidades conocidas.**

**Estado Actual:**
- ✅ Funcional para demo y pruebas
- ⚠️ Requiere validaciones adicionales para producción
- ❌ No listo para usuarios no técnicos sin supervisión

**Recomendación:**
Implementar al menos las mejoras **DEBE HACERSE** antes de entregar.
Esto llevará aproximadamente 1.5 horas y previene los errores más comunes.
