# 🧪 Plan de Pruebas Exhaustivo - Sistema Aerolínea

## 📋 Estado: Preparado para Testing

---

## 🎯 Objetivos de Prueba

1. Verificar funcionamiento CRUD de todos los módulos
2. Probar validaciones frontend y backend
3. Probar selectores dinámicos y relaciones
4. Identificar puntos de falla potenciales
5. Verificar manejo de errores
6. Probar casos extremos y edge cases

---

## 🔍 Plan de Pruebas por Módulo

### 1. CLIENTES ✅

#### Pruebas Básicas (CRUD)
- [ ] **Crear cliente válido**
  - Nombre: "Juan"
  - Apellido Paterno: "Pérez"
  - Apellido Materno: "García"
  - Correo: "juan.perez@example.com"
  - Teléfono: "5551234567"
  - Resultado esperado: ✅ Cliente creado exitosamente

- [ ] **Listar clientes**
  - Resultado esperado: ✅ Ver cliente creado en tabla

- [ ] **Buscar cliente**
  - Buscar por: "Juan"
  - Resultado esperado: ✅ Cliente aparece en resultados

- [ ] **Editar cliente**
  - Cambiar teléfono a: "5559876543"
  - Resultado esperado: ✅ Cliente actualizado

- [ ] **Eliminar cliente**
  - Confirmación: Sí
  - Resultado esperado: ✅ Cliente eliminado

#### Pruebas de Validación Frontend
- [ ] **Nombre vacío**
  - Resultado esperado: ❌ Error "El nombre es requerido"

- [ ] **Correo inválido**
  - Correo: "correo-invalido"
  - Resultado esperado: ❌ Error "Email inválido"

- [ ] **Teléfono corto**
  - Teléfono: "123"
  - Resultado esperado: ❌ Error "Teléfono debe tener 10-15 dígitos"

- [ ] **Teléfono con letras**
  - Teléfono: "ABC123DEF"
  - Resultado esperado: ❌ Error "Solo números permitidos"

#### Pruebas de Validación Backend
- [ ] **Correo duplicado**
  - Crear cliente con correo existente
  - Resultado esperado: ❌ Error del servidor "Correo ya existe"

- [ ] **Nombre demasiado largo**
  - Nombre: String de 100 caracteres
  - Resultado esperado: ❌ Error "Máximo 50 caracteres"

#### Casos Extremos
- [ ] **Caracteres especiales en nombre**
  - Nombre: "José María"
  - Resultado esperado: ✅ Aceptado (con tildes)

- [ ] **Correo con formato válido pero raro**
  - Correo: "test+tag@sub.domain.com"
  - Resultado esperado: ✅ Aceptado

- [ ] **Búsqueda con acentos**
  - Buscar: "José" vs "Jose"
  - Resultado esperado: ✅ Ambos encuentran el registro

#### Posibles Puntos de Falla ⚠️
1. **Frontend:** Búsqueda no maneja acentos correctamente
2. **Backend:** Validación de correo único podría fallar en concurrencia
3. **Frontend:** Eliminar sin confirmación (mitigado con confirm())
4. **Backend:** Sin soft delete, puede perder datos relacionados

---

### 2. PASAJEROS ✅

#### Pruebas Básicas (CRUD)
- [ ] **Crear pasajero válido**
  - Nombre: "María"
  - Apellidos: "López", "Sánchez"
  - Fecha Nacimiento: "1990-05-15"
  - Nacionalidad: "Mexicana"
  - Pasaporte: "MEX123456"
  - Resultado esperado: ✅ Pasajero creado

- [ ] **Listar y buscar**
  - Buscar por pasaporte: "MEX123456"
  - Resultado esperado: ✅ Pasajero encontrado

- [ ] **Editar pasajero**
  - Cambiar nacionalidad
  - Resultado esperado: ✅ Actualizado

- [ ] **Eliminar pasajero**
  - Resultado esperado: ✅ Eliminado

#### Pruebas de Validación
- [ ] **Fecha nacimiento futura**
  - Fecha: "2030-01-01"
  - Resultado esperado: ❌ No validado en frontend, pero lógicamente incorrecto

- [ ] **Sin fecha nacimiento**
  - Resultado esperado: ❌ Error "Fecha requerida"

- [ ] **Pasajero menor de edad**
  - Fecha: Hace 5 años
  - Resultado esperado: ✅ Aceptado (sin validación de edad mínima)

#### Casos Extremos
- [ ] **Nombre con caracteres Unicode**
  - Nombre: "Björk"
  - Resultado esperado: ✅ Aceptado

- [ ] **Pasaporte vacío**
  - Resultado esperado: ✅ Aceptado (es opcional)

#### Posibles Puntos de Falla ⚠️
1. **Frontend:** No valida fecha futura
2. **Backend:** No valida edad mínima
3. **Frontend:** No valida formato de pasaporte
4. **Backend:** Posible duplicado de pasaportes

---

### 3. RESERVAS ✅

#### Pruebas Básicas (CRUD)
- [ ] **Crear reserva**
  - Seleccionar cliente existente
  - Fecha: Hoy
  - Estado: PENDIENTE
  - Resultado esperado: ✅ Código generado automáticamente

- [ ] **Listar reservas**
  - Resultado esperado: ✅ Ver código RES-YYYYMMDD-NNNNNN

- [ ] **Buscar por código**
  - Resultado esperado: ✅ Encontrado

- [ ] **Cambiar estado a CONFIRMADA**
  - Resultado esperado: ✅ Badge cambia a verde

- [ ] **Eliminar reserva**
  - Resultado esperado: ✅ Eliminada

#### Pruebas de Validación
- [ ] **Sin cliente seleccionado**
  - Resultado esperado: ❌ Error "Debe seleccionar cliente"

- [ ] **Fecha vacía**
  - Resultado esperado: ❌ Error "Fecha requerida"

- [ ] **Código manual (intentar editar)**
  - Resultado esperado: ✅ Campo readonly

#### Pruebas de Integración
- [ ] **Cliente sin crear**
  - Select de clientes vacío
  - Resultado esperado: ⚠️ No puede crear reserva

- [ ] **Crear reserva y eliminar cliente**
  - Resultado esperado: ⚠️ Posible error por FK constraint

#### Casos Extremos
- [ ] **Múltiples reservas mismo cliente**
  - Crear 10 reservas
  - Resultado esperado: ✅ Códigos únicos

- [ ] **Fecha muy antigua**
  - Fecha: "1990-01-01"
  - Resultado esperado: ✅ Aceptado (no valida futuro/pasado)

#### Posibles Puntos de Falla ⚠️
1. **Frontend:** Generación de código podría duplicarse en milisegundos
2. **Backend:** Sin validación de fecha (puede ser pasada)
3. **Frontend:** No valida que el cliente exista antes de enviar
4. **Backend:** Eliminar cliente con reservas causa error FK
5. **Frontend:** Select vacío si no hay clientes

---

### 4. BOLETOS ✅

#### Pruebas Básicas (CRUD)
- [ ] **Crear boleto completo**
  - Pasajero: Seleccionar existente
  - Reserva: Seleccionar existente
  - Instancia: Seleccionar existente
  - Fecha emisión: Hoy
  - Precio: 150.50
  - Clase: ECONOMICA
  - Estado: EMITIDO
  - Resultado esperado: ✅ Número generado (BLT-...)

- [ ] **Crear boleto mínimo**
  - Solo pasajero, fecha, precio
  - Reserva e Instancia: Vacío
  - Resultado esperado: ✅ Creado (son opcionales)

- [ ] **Editar boleto**
  - Cambiar clase a EJECUTIVA
  - Resultado esperado: ✅ Actualizado

- [ ] **Eliminar boleto**
  - Resultado esperado: ✅ Eliminado

#### Pruebas de Validación
- [ ] **Precio cero**
  - Precio: 0
  - Resultado esperado: ❌ Error "Precio debe ser mayor a 0"

- [ ] **Precio negativo**
  - Precio: -100
  - Resultado esperado: ❌ Error "Precio debe ser mayor a 0"

- [ ] **Sin pasajero**
  - Resultado esperado: ❌ Error "Debe seleccionar pasajero"

- [ ] **Precio muy alto**
  - Precio: 999999.99
  - Resultado esperado: ✅ Aceptado (no hay límite superior)

#### Pruebas de Selectores Dinámicos
- [ ] **Sin pasajeros en BD**
  - Resultado esperado: ⚠️ Select vacío, no puede crear

- [ ] **Sin reservas en BD**
  - Resultado esperado: ✅ Puede omitir (es opcional)

- [ ] **Sin instancias en BD**
  - Resultado esperado: ✅ Puede omitir (es opcional)

#### Casos Extremos
- [ ] **Múltiples boletos para misma reserva**
  - Crear 3 boletos con misma reserva
  - Resultado esperado: ✅ Permitido

- [ ] **Cambiar estado EMITIDO → USADO → CANCELADO**
  - Resultado esperado: ✅ Badge cambia colores

- [ ] **Fecha emisión futura**
  - Fecha: "2030-01-01"
  - Resultado esperado: ✅ Aceptado (no valida)

#### Posibles Puntos de Falla ⚠️
1. **Frontend:** No valida lógica de negocio (ej: boleto usado no debe editarse)
2. **Backend:** Sin validación de estados válidos
3. **Frontend:** Selectores vacíos bloquean creación
4. **Backend:** No valida que instancia tenga cupo disponible
5. **Frontend:** No valida coherencia (ej: reserva del mismo cliente que pasajero)

---

### 5. VUELOS ✅

#### Pruebas Básicas (CRUD)
- [ ] **Crear vuelo con ruta**
  - Número: "AA123"
  - Ruta: Seleccionar existente
  - Duración: "02:30:00"
  - Resultado esperado: ✅ Creado

- [ ] **Crear vuelo sin ruta**
  - Número: "BB456"
  - Ruta: Vacío
  - Duración: "01:45:00"
  - Resultado esperado: ✅ Creado (ruta opcional)

- [ ] **Listar vuelos**
  - Resultado esperado: ✅ Ver rutas como "Origen → Destino"

- [ ] **Editar vuelo**
  - Cambiar duración
  - Resultado esperado: ✅ Actualizado

- [ ] **Eliminar vuelo**
  - Resultado esperado: ✅ Eliminado

#### Pruebas de Validación
- [ ] **Duración formato incorrecto**
  - Duración: "2:30" (sin segundos)
  - Resultado esperado: ❌ Error "Formato debe ser HH:MM:SS"

- [ ] **Duración con letras**
  - Duración: "ABC"
  - Resultado esperado: ❌ Error formato

- [ ] **Número vuelo vacío**
  - Resultado esperado: ❌ Error "Número requerido"

- [ ] **Número vuelo muy largo**
  - Número: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  - Resultado esperado: ❌ Error "Máximo 20 caracteres"

#### Pruebas de Selectores
- [ ] **Sin rutas en BD**
  - Resultado esperado: ⚠️ Select vacío, pero puede omitir

- [ ] **Ruta eliminada después de crear vuelo**
  - Resultado esperado: ⚠️ Vuelo queda con ruta null

#### Casos Extremos
- [ ] **Duración 00:00:00**
  - Resultado esperado: ✅ Aceptado (pero ilógico)

- [ ] **Duración 23:59:59**
  - Resultado esperado: ✅ Aceptado

- [ ] **Número vuelo con espacios**
  - Número: "AA 123"
  - Resultado esperado: ✅ Aceptado

#### Posibles Puntos de Falla ⚠️
1. **Frontend:** Regex de duración podría fallar con horas > 23
2. **Backend:** Sin validación de duración máxima razonable
3. **Frontend:** No valida duplicados de número de vuelo
4. **Backend:** Posible duplicado de numeroVuelo
5. **Frontend:** Select de rutas podría no cargar si hay error en API

---

### 6. INSTANCIAS DE VUELO ✅

#### Pruebas Básicas (CRUD)
- [ ] **Crear instancia completa**
  - Vuelo: Seleccionar existente
  - Avión: Seleccionar existente
  - Fecha salida: "2025-11-20T10:00"
  - Fecha llegada: "2025-11-20T12:30"
  - Estado: PROGRAMADO
  - Resultado esperado: ✅ Creada

- [ ] **Listar instancias**
  - Resultado esperado: ✅ Ver vuelo y avión en tabla

- [ ] **Editar instancia**
  - Cambiar estado a EN_VUELO
  - Resultado esperado: ✅ Badge amarillo

- [ ] **Eliminar instancia**
  - Resultado esperado: ✅ Eliminada

#### Pruebas de Validación
- [ ] **Fecha llegada antes de salida**
  - Salida: "2025-11-20T12:00"
  - Llegada: "2025-11-20T10:00"
  - Resultado esperado: ❌ Error "Llegada debe ser posterior"

- [ ] **Fechas iguales**
  - Salida y Llegada: "2025-11-20T10:00"
  - Resultado esperado: ❌ Error validación

- [ ] **Sin vuelo seleccionado**
  - Resultado esperado: ❌ Error "Debe seleccionar vuelo"

- [ ] **Sin avión seleccionado**
  - Resultado esperado: ❌ Error "Debe seleccionar avión"

#### Pruebas de Selectores
- [ ] **Sin vuelos en BD**
  - Resultado esperado: ⚠️ Select vacío, no puede crear

- [ ] **Sin aviones en BD**
  - Resultado esperado: ⚠️ Select vacío, no puede crear

#### Casos Extremos
- [ ] **Fecha salida en el pasado**
  - Salida: "2020-01-01T10:00"
  - Resultado esperado: ✅ Aceptado (no valida)

- [ ] **Diferencia de 1 minuto**
  - Salida: "10:00", Llegada: "10:01"
  - Resultado esperado: ✅ Aceptado

- [ ] **Múltiples instancias del mismo vuelo**
  - Crear 3 instancias con mismo vuelo
  - Resultado esperado: ✅ Permitido

- [ ] **Mismo avión en múltiples instancias simultáneas**
  - Avión A: Vuelo 1 (10:00-12:00)
  - Avión A: Vuelo 2 (11:00-13:00)
  - Resultado esperado: ✅ Permitido (no valida conflictos)

#### Posibles Puntos de Falla ⚠️
1. **Frontend:** No valida fecha pasada
2. **Backend:** Sin validación de conflictos de avión
3. **Frontend:** Selectores vacíos bloquean completamente
4. **Backend:** No valida capacidad del avión vs boletos vendidos
5. **Frontend:** No muestra aviones ocupados en ese horario

---

## 🚨 Análisis de Puntos Críticos de Falla

### 1. Problemas de Datos Relacionados

#### Escenario: Cliente con Reservas - Eliminar Cliente
```
Estado Inicial:
- Cliente ID 1: "Juan Pérez"
- Reserva ID 1: Cliente 1, Código RES-001

Acción: Eliminar Cliente 1

Posible Error:
❌ SQL FK Constraint Violation
❌ Frontend no valida antes de eliminar
❌ No existe soft delete

Solución:
- Validar en backend que no tenga reservas
- Mostrar mensaje: "No se puede eliminar, tiene N reservas"
- O implementar soft delete
```

#### Escenario: Pasajero con Boletos - Eliminar Pasajero
```
Similar al anterior
Solución: Validar relaciones antes de eliminar
```

#### Escenario: Vuelo con Instancias - Eliminar Vuelo
```
Similar al anterior
Solución: Validar relaciones antes de eliminar
```

### 2. Problemas de Selectores Vacíos

#### Escenario: Sin Clientes - Crear Reserva
```
Estado: BD sin clientes

Frontend: Select vacío
Usuario: No puede crear reserva

Solución:
- Mostrar mensaje: "Debe crear clientes primero"
- Link directo a módulo de clientes
- O permitir crear cliente inline
```

#### Escenario: Sin Rutas - Crear Vuelo
```
Estado: BD sin rutas

Frontend: Select vacío (pero es opcional)
Usuario: Puede crear sin ruta

Problema: Vuelo sin ruta tiene poco sentido

Solución:
- Hacer ruta requerida
- O agregar mensaje informativo
```

#### Escenario: Sin Vuelos - Crear Instancia
```
Estado: BD sin vuelos

Frontend: Select vacío
Usuario: Bloqueado completamente

Solución:
- Mensaje claro
- Link a crear vuelo
```

### 3. Problemas de Validación de Negocio

#### Escenario: Avión Sobre-vendido
```
Instancia:
- Vuelo AA123
- Avión Boeing 737 (Capacidad: 180)
- Fecha: 2025-11-20

Boletos vendidos: 200

Problema:
❌ Sistema permite vender más boletos que capacidad

Solución:
- Validar capacidad en backend al crear boleto
- Mostrar asientos disponibles en frontend
```

#### Escenario: Conflicto de Aviones
```
Instancia 1:
- Avión A, Vuelo 1
- Salida: 10:00, Llegada: 12:00

Instancia 2:
- Avión A, Vuelo 2
- Salida: 11:00, Llegada: 13:00

Problema:
❌ Mismo avión en dos lugares al mismo tiempo

Solución:
- Validar disponibilidad de avión en backend
- Mostrar aviones disponibles solo
```

#### Escenario: Boleto para Vuelo Pasado
```
Instancia:
- Fecha salida: 2020-01-01 (pasada)

Boleto:
- Para esta instancia
- Fecha emisión: Hoy

Problema:
❌ Vendiendo boleto para vuelo ya realizado

Solución:
- Validar fecha de instancia en backend
- Filtrar instancias pasadas en select
```

### 4. Problemas de Concurrencia

#### Escenario: Código de Reserva Duplicado
```
Tiempo 0ms: Usuario A crea reserva
Tiempo 1ms: Usuario B crea reserva
Código generado: RES-20251117-123456 (ambos)

Problema:
❌ Duplicado por generación casi simultánea

Solución:
- Usar UUID en vez de timestamp
- O validar unicidad en BD con constraint
- O usar secuencia de BD
```

#### Escenario: Correo Duplicado
```
Tiempo 0ms: Usuario A crea cliente@email.com
Tiempo 1ms: Usuario B crea cliente@email.com

Problema:
❌ Race condition en validación

Solución:
- Unique constraint en BD (ya existe)
- Manejar error de duplicado correctamente
```

### 5. Problemas de Formato y Tipo de Datos

#### Escenario: Duración con Horas > 23
```
Vuelo transoceánico:
- Duración: 28:30:00

Frontend Regex: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/

Problema:
❌ Rechaza duraciones válidas > 23 horas

Solución:
- Cambiar regex: /^([0-9]{1,2}):[0-5][0-9]:[0-5][0-9]$/
- O usar formato de días+horas
```

#### Escenario: Precio con Decimales Largos
```
Precio: 150.123456789

Problema:
⚠️ Base de datos puede truncar

Solución:
- Validar 2 decimales en frontend
- Definir DECIMAL(10,2) en BD
```

### 6. Problemas de UI/UX

#### Escenario: Editar Registro - Usuario Confundido
```
Usuario edita cliente
Olvidó que estaba editando
Crea uno nuevo pensando que es el formulario vacío

Problema:
⚠️ Confusión por no limpiar formulario

Solución Actual:
✅ Botón cambia a "Actualizar"
✅ Botón "Cancelar" limpia

Mejora:
- Resaltar visualmente que está editando
- Título del card cambia
```

#### Escenario: Búsqueda con Acentos
```
Cliente: "José Pérez"
Búsqueda: "jose perez" (sin acentos)

Problema:
❌ No encuentra si búsqueda es case-sensitive y accent-sensitive

Solución:
- Normalizar strings en búsqueda
- O usar búsqueda fuzzy
```

### 7. Problemas de Performance

#### Escenario: Miles de Registros
```
Sistema con 10,000 clientes

Frontend: Carga todos al inicio

Problema:
❌ Lento, consume memoria

Solución:
- Paginación en backend
- Lazy loading en frontend
- Virtual scrolling
```

#### Escenario: Muchas Búsquedas Rápidas
```
Usuario escribe rápido en búsqueda

Frontend: Filtra en cada keystroke

Problema:
⚠️ Procesa demasiado

Solución Actual:
✅ Filtrado en memoria (rápido)

Mejora:
- Debounce para búsquedas en servidor
```

---

## 📝 Recomendaciones de Mejora

### Prioridad ALTA 🔴

1. **Validar Relaciones antes de Eliminar**
   ```javascript
   // En cada módulo antes de delete
   if (tieneRegistrosRelacionados(id)) {
       showAlert('error', 'No se puede eliminar, tiene registros asociados');
       return;
   }
   ```

2. **Manejar Selectores Vacíos**
   ```javascript
   if (selectores.length === 0) {
       mostrarMensaje('Debe crear X primero', linkA_ModuloX);
       deshabilitarFormulario();
   }
   ```

3. **Validar Capacidad de Avión**
   ```java
   // En BoletoController
   if (instancia.getBoletos().size() >= avion.getCapacidad()) {
       throw new RuntimeException("Vuelo lleno");
   }
   ```

4. **Unique Constraint en Códigos**
   ```java
   @Column(unique = true)
   private String codigoReserva;
   ```

### Prioridad MEDIA 🟡

5. **Validar Fechas Lógicas**
   ```javascript
   // No permitir fechas pasadas
   if (fecha < new Date()) {
       error("Fecha no puede ser pasada");
   }
   ```

6. **Mejorar Generación de Códigos**
   ```javascript
   // Usar UUID o timestamp más granular
   const codigo = `RES-${Date.now()}-${Math.random()}`;
   ```

7. **Validar Conflictos de Avión**
   ```java
   // Verificar que avión no esté ocupado en ese horario
   ```

8. **Soft Delete**
   ```java
   @Column(name = "deleted_at")
   private LocalDateTime deletedAt;
   ```

### Prioridad BAJA 🟢

9. **Paginación**
   ```java
   @GetMapping
   public Page<Cliente> listar(Pageable pageable) {
       return clienteService.findAll(pageable);
   }
   ```

10. **Búsqueda Mejorada**
    ```javascript
    // Normalizar acentos
    const normalizar = str => str.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    ```

---

## ✅ Checklist de Pruebas Manuales

### Antes de Entregar
- [ ] Compilar proyecto sin errores
- [ ] Iniciar servidor exitosamente
- [ ] Probar cada módulo individualmente
- [ ] Probar flujos completos (cliente → reserva → boleto)
- [ ] Intentar romper con datos inválidos
- [ ] Verificar mensajes de error claros
- [ ] Probar en diferentes navegadores
- [ ] Verificar responsive design
- [ ] Revisar console del navegador (sin errores JS)
- [ ] Revisar logs del servidor (sin errores)

### Escenarios de Estrés
- [ ] Crear 100 registros rápido
- [ ] Búsqueda con texto muy largo
- [ ] Campos con caracteres especiales
- [ ] Selectores con muchos elementos
- [ ] Eliminar registros con relaciones

---

## 🎯 Conclusión del Plan de Pruebas

**El sistema tiene una base sólida pero requiere validaciones adicionales de lógica de negocio.**

**Puntos Fuertes:**
- ✅ CRUD funcional en todos los módulos
- ✅ Validaciones básicas frontend y backend
- ✅ UI intuitiva y responsive
- ✅ Manejo de errores básico

**Áreas de Mejora:**
- ⚠️ Validar relaciones antes de eliminar
- ⚠️ Manejar selectores vacíos mejor
- ⚠️ Validar lógica de negocio (capacidad, conflictos)
- ⚠️ Mejorar generación de códigos únicos

**Recomendación:**
El sistema es funcional para demostración y uso básico. Para producción, implementar las mejoras de prioridad ALTA.
