# Guía Completa de Pruebas del Sistema de Aerolínea

## Estado de Implementación

### Módulos Completados ✅
1. **Clientes** - 100% implementado y validado
2. **Pasajeros** - 100% implementado y validado
3. **Vuelos** - 100% implementado y validado
4. **Instancias de Vuelo** - 100% implementado y validado
5. **Reservas** - 100% implementado y validado
6. **Boletos** - 100% implementado y validado
7. **Ventas** - 100% implementado (requiere pruebas)
8. **Búsqueda de Vuelos** - Implementado

---

## Pruebas por Módulo

### 1. CLIENTES

#### Pruebas de Alta (CREATE)
- ✅ Crear cliente con todos los campos completos
- ✅ Crear cliente con campos mínimos requeridos
- ❌ Intentar crear sin nombre (debe rechazar)
- ❌ Intentar crear sin apellido paterno (debe rechazar)
- ❌ Intentar crear sin correo (debe rechazar)
- ❌ Intentar crear con correo inválido (debe rechazar)
- ❌ Intentar crear con teléfono de más de 20 caracteres (debe rechazar)

#### Pruebas de Búsqueda
- ✅ Buscar por nombre
- ✅ Buscar por apellido
- ✅ Buscar por correo
- ✅ Buscar por teléfono
- ✅ Búsqueda con texto vacío (debe mostrar todos)

#### Pruebas de Actualización (UPDATE)
- ✅ Actualizar nombre
- ✅ Actualizar correo
- ✅ Actualizar teléfono
- ❌ Intentar actualizar a correo inválido (debe rechazar)
- ❌ Intentar dejar campos requeridos vacíos (debe rechazar)

#### Pruebas de Eliminación (DELETE)
- ✅ Eliminar cliente sin reservas
- ⚠️ Intentar eliminar cliente con reservas activas (verificar comportamiento)
- ✅ Cancelar eliminación desde el diálogo de confirmación

---

### 2. PASAJEROS

#### Pruebas de Alta
- ✅ Crear pasajero con todos los campos
- ✅ Crear pasajero sin apellido materno (opcional)
- ✅ Crear pasajero sin pasaporte (opcional)
- ❌ Intentar crear sin nombre (debe rechazar)
- ❌ Intentar crear sin apellido paterno (debe rechazar)
- ❌ Intentar crear sin fecha de nacimiento (debe rechazar)
- ❌ Intentar crear con fecha futura (debe rechazar)

#### Pruebas de Búsqueda
- ✅ Buscar por nombre completo
- ✅ Buscar por pasaporte
- ✅ Buscar por nacionalidad

#### Pruebas de Actualización
- ✅ Actualizar todos los campos
- ✅ Actualizar fecha de nacimiento
- ❌ Intentar poner fecha inválida (debe rechazar)

#### Pruebas de Eliminación
- ✅ Eliminar pasajero sin boletos
- ⚠️ Intentar eliminar pasajero con boletos (verificar comportamiento)

---

### 3. VUELOS

#### Pruebas de Alta
- ✅ Crear vuelo con todos los campos
- ❌ Intentar crear sin número de vuelo (debe rechazar)
- ❌ Intentar crear sin origen (debe rechazar)
- ❌ Intentar crear sin destino (debe rechazar)
- ❌ Intentar crear con origen y destino iguales (debe rechazar)
- ❌ Intentar crear con capacidad negativa (debe rechazar)

#### Pruebas de Búsqueda
- ✅ Buscar por número de vuelo
- ✅ Buscar por origen
- ✅ Buscar por destino
- ✅ Buscar por estado

#### Pruebas de Actualización
- ✅ Actualizar datos del vuelo
- ✅ Cambiar estado (ACTIVO/INACTIVO)
- ❌ Intentar poner capacidad inválida

---

### 4. INSTANCIAS DE VUELO

#### Pruebas de Alta
- ✅ Crear instancia con vuelo válido
- ✅ Asignar fechas y horas
- ❌ Intentar crear sin vuelo (debe rechazar)
- ❌ Intentar crear sin fecha de salida (debe rechazar)
- ❌ Intentar crear con fecha de llegada anterior a salida (debe rechazar)
- ❌ Intentar crear con disponibilidad negativa (debe rechazar)

#### Pruebas de Búsqueda
- ✅ Buscar por vuelo
- ✅ Buscar por fecha
- ✅ Buscar por estado

#### Pruebas de Actualización
- ✅ Actualizar fechas
- ✅ Actualizar disponibilidad
- ✅ Cambiar estado
- ❌ Intentar reducir disponibilidad por debajo de boletos vendidos (debe rechazar)

---

### 5. RESERVAS

#### Pruebas de Alta
- ✅ Crear reserva con código automático
- ✅ Asignar cliente
- ❌ Intentar crear sin cliente (debe rechazar)
- ❌ Intentar crear sin código (debe rechazar)
- ❌ Intentar crear sin fecha (debe rechazar)

#### Pruebas de Búsqueda
- ✅ Buscar por código de reserva
- ✅ Buscar por cliente
- ✅ Buscar por estado

#### Pruebas de Actualización
- ✅ Actualizar estado (PENDIENTE/CONFIRMADA/CANCELADA)
- ✅ Cambiar fecha
- ❌ Intentar poner estado inválido (debe rechazar)

#### Pruebas de Eliminación
- ✅ Eliminar reserva sin boletos
- ⚠️ Intentar eliminar reserva con boletos asociados (verificar comportamiento)

---

### 6. BOLETOS

#### Pruebas de Alta
- ✅ Crear boleto con número automático
- ✅ Asignar pasajero, reserva e instancia
- ❌ Intentar crear sin pasajero (debe rechazar)
- ❌ Intentar crear sin número (debe rechazar)
- ❌ Intentar crear sin precio o precio negativo (debe rechazar)
- ❌ Intentar crear sin fecha de emisión (debe rechazar)
- ❌ Intentar crear sin clase (debe rechazar)

#### Pruebas de Búsqueda
- ✅ Buscar por número de boleto
- ✅ Buscar por pasajero
- ✅ Buscar por clase (ECONOMICA/EJECUTIVA/PRIMERA)
- ✅ Buscar por estado (EMITIDO/USADO/CANCELADO)

#### Pruebas de Actualización
- ✅ Actualizar precio
- ✅ Cambiar estado
- ✅ Cambiar clase
- ❌ Intentar poner precio negativo (debe rechazar)

#### Pruebas de Eliminación
- ✅ Eliminar boleto
- ⚠️ Verificar integridad con ventas

---

### 7. VENTAS (NUEVO)

#### Pruebas de Alta
- ⏳ Crear venta con cliente
- ⏳ Asignar forma de pago
- ⏳ Calcular total automático
- ❌ Intentar crear sin cliente (debe rechazar)
- ❌ Intentar crear sin fecha (debe rechazar)
- ❌ Intentar crear sin forma de pago (debe rechazar)
- ❌ Intentar crear con total negativo (debe rechazar)

#### Pruebas de Búsqueda
- ⏳ Buscar por cliente
- ⏳ Buscar por estado
- ⏳ Buscar por forma de pago

#### Pruebas de Visualización
- ⏳ Ver detalle completo de venta
- ⏳ Verificar modal de detalles

#### Pruebas de Actualización
- ⏳ Actualizar estado (PENDIENTE/COMPLETADA/CANCELADA)
- ⏳ Modificar forma de pago
- ❌ Intentar modificar total a negativo (debe rechazar)

#### Pruebas de Eliminación
- ⏳ Eliminar venta
- ⚠️ Verificar comportamiento con detalles asociados

---

## Escenarios de Falla Críticos

### Escenario 1: Validaciones de Backend
**Objetivo**: Verificar que el backend rechaza datos inválidos

#### Test 1.1: Campos Requeridos Vacíos
```
Para cada módulo:
1. Abrir formulario
2. Dejar campo requerido vacío
3. Intentar guardar
✅ Debe mostrar error de validación
✅ No debe crear el registro
```

#### Test 1.2: Formatos Inválidos
```
1. Ingresar correo sin '@'
2. Ingresar teléfono con letras
3. Ingresar fecha futura cuando no es permitido
✅ Debe mostrar error específico
```

#### Test 1.3: Valores Fuera de Rango
```
1. Ingresar precio negativo
2. Ingresar capacidad 0 o negativa
3. Ingresar texto de más caracteres permitidos
✅ Debe rechazar y mostrar error
```

---

### Escenario 2: Integridad Referencial
**Objetivo**: Verificar que no se puede eliminar registros con dependencias

#### Test 2.1: Cliente con Reservas
```
1. Crear cliente
2. Crear reserva para ese cliente
3. Intentar eliminar el cliente
⚠️ Verificar comportamiento (debe rechazar o advertir)
```

#### Test 2.2: Vuelo con Instancias
```
1. Crear vuelo
2. Crear instancia de ese vuelo
3. Intentar eliminar el vuelo
⚠️ Verificar comportamiento
```

#### Test 2.3: Reserva con Boletos
```
1. Crear reserva
2. Crear boleto asociado
3. Intentar eliminar reserva
⚠️ Verificar comportamiento
```

---

### Escenario 3: Concurrencia
**Objetivo**: Verificar que el sistema maneja operaciones simultáneas

#### Test 3.1: Actualización Simultánea
```
1. Abrir mismo registro en dos ventanas
2. Modificar en ambas
3. Guardar en ambas
⚠️ Verificar que no se pierden datos
```

#### Test 3.2: Disponibilidad de Asientos
```
1. Crear instancia con 5 asientos disponibles
2. En dos sesiones, intentar vender 3 asientos cada una
⚠️ No debe vender más de 5 en total
```

---

### Escenario 4: Búsquedas y Filtros
**Objetivo**: Verificar que las búsquedas funcionan correctamente

#### Test 4.1: Búsqueda por Cada Campo
```
Para cada módulo:
1. Buscar por cada campo disponible
2. Buscar con caracteres especiales
3. Buscar con mayúsculas/minúsculas
✅ Debe encontrar resultados correctos
✅ Debe ser case-insensitive
```

#### Test 4.2: Búsqueda Sin Resultados
```
1. Buscar texto que no existe
✅ Debe mostrar mensaje "No se encontraron..."
✅ No debe mostrar error
```

---

### Escenario 5: Navegación y UX
**Objetivo**: Verificar que la interfaz es intuitiva y robusta

#### Test 5.1: Cancelar Operaciones
```
1. Llenar formulario
2. Hacer click en Cancelar
✅ Debe limpiar formulario
✅ Debe resetear botón a "Guardar"
```

#### Test 5.2: Editar y Cancelar
```
1. Editar un registro
2. Modificar datos
3. Hacer click en Cancelar
✅ No debe guardar cambios
✅ Tabla debe mostrar datos originales
```

#### Test 5.3: Mensajes de Confirmación
```
1. Intentar eliminar registro
✅ Debe mostrar diálogo de confirmación
2. Hacer click en Cancelar
✅ No debe eliminar
3. Hacer click en Aceptar
✅ Debe eliminar y mostrar mensaje de éxito
```

---

## Pruebas de Integración

### Flujo Completo: Venta de Boleto

#### Paso 1: Crear Cliente
```
1. Ir a módulo Clientes
2. Crear nuevo cliente con datos válidos
3. Verificar que aparece en la tabla
```

#### Paso 2: Crear Pasajero
```
1. Ir a módulo Pasajeros
2. Crear pasajero con datos válidos
3. Verificar que aparece en la tabla
```

#### Paso 3: Crear Vuelo
```
1. Ir a módulo Vuelos
2. Crear vuelo con origen/destino
3. Marcar como ACTIVO
```

#### Paso 4: Crear Instancia
```
1. Ir a módulo Instancias
2. Crear instancia del vuelo
3. Asignar fecha/hora y disponibilidad
```

#### Paso 5: Crear Reserva
```
1. Ir a módulo Reservas
2. Crear reserva para el cliente
3. Marcar como CONFIRMADA
```

#### Paso 6: Crear Boleto
```
1. Ir a módulo Boletos
2. Crear boleto asociando:
   - Pasajero creado
   - Reserva creada
   - Instancia creada
3. Asignar precio y clase
```

#### Paso 7: Crear Venta
```
1. Ir a módulo Ventas
2. Crear venta para el cliente
3. Asignar forma de pago
4. Ingresar total igual al precio del boleto
5. Marcar como COMPLETADA
```

#### Paso 8: Verificación
```
1. Verificar que todos los datos se crearon correctamente
2. Verificar relaciones entre entidades
3. Intentar eliminar entidades relacionadas (debe rechazar)
```

---

## Pruebas de Regresión

Después de cada cambio, verificar:

1. ✅ Dashboard muestra contadores correctos
2. ✅ Todas las secciones se cargan sin errores
3. ✅ Búsquedas funcionan en todos los módulos
4. ✅ Formularios validan correctamente
5. ✅ Mensajes de éxito/error se muestran
6. ✅ Botones Cancelar resetean formularios
7. ✅ Operaciones CRUD funcionan en todos los módulos

---

## Checklist de Pruebas Rápidas

### Para cada módulo, verificar:

- [ ] Crear registro con datos válidos
- [ ] Crear registro con datos inválidos (debe rechazar)
- [ ] Buscar por diferentes criterios
- [ ] Editar registro existente
- [ ] Cancelar edición
- [ ] Eliminar registro
- [ ] Cancelar eliminación
- [ ] Ver que la tabla se actualiza después de cada operación
- [ ] Verificar que los selects se cargan con datos

---

## Herramientas de Prueba Recomendadas

### Pruebas Manuales
- Navegadores: Chrome, Firefox, Edge
- Modo incógnito para sesiones limpias
- DevTools para ver errores de consola

### Pruebas Automatizadas (futuro)
- Selenium para pruebas E2E
- Postman para pruebas de API
- JUnit para pruebas unitarias en backend

---

## Reporte de Bugs

### Formato para reportar errores:

```
ID: BUG-XXX
Módulo: [Clientes|Pasajeros|etc]
Severidad: [Alta|Media|Baja]
Pasos para reproducir:
1. ...
2. ...
Resultado esperado: ...
Resultado actual: ...
Capturas: [adjuntar si aplica]
```

---

## Notas Importantes

1. **Validaciones**: Todas las validaciones críticas están implementadas en backend y frontend
2. **Búsquedas**: Todas las búsquedas son case-insensitive y buscan en múltiples campos
3. **Formularios**: Todos los formularios tienen reseteo y cancelación
4. **Eliminaciones**: Todas las eliminaciones piden confirmación
5. **Errores**: Todos los errores muestran mensajes específicos al usuario

---

## Estado Actual del Sistema

### Completamente Implementado ✅
- CRUD completo de Clientes
- CRUD completo de Pasajeros  
- CRUD completo de Vuelos
- CRUD completo de Instancias
- CRUD completo de Reservas
- CRUD completo de Boletos
- CRUD completo de Ventas

### Pendiente de Pruebas Exhaustivas ⏳
- Módulo de Ventas (recién implementado)
- Integridad referencial en eliminaciones
- Pruebas de concurrencia
- Flujos completos de venta

### Próximos Pasos 📋
1. Probar módulo de Ventas
2. Verificar escenarios de integridad referencial
3. Documentar cualquier bug encontrado
4. Implementar correcciones si es necesario
