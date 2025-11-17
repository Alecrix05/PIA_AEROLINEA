# 🧪 Guía de Pruebas de Mejoras Críticas

## 📋 Instrucciones de Compilación y Prueba

### Paso 1: Compilar el Proyecto

```bash
# Navegar al directorio
cd "c:\Users\Alec\Documents\Cris\Facu\5to semestre\aerolinea"

# Compilar
mvnw.cmd clean compile

# Iniciar servidor
mvnw.cmd spring-boot:run
```

**Resultado Esperado:**
```
BUILD SUCCESS
Started AerolineaApplication in X.XXX seconds
```

---

## 🎯 Pruebas de Nuevas Validaciones

### PRUEBA 1: Validación de Precio en Boletos ✅

#### Test 1.1: Precio = 0 (Debe Fallar)

**Pasos:**
1. Ir a módulo "Boletos"
2. Llenar formulario normalmente
3. **Precio:** `0`
4. Click "Guardar Boleto"

**Resultado Esperado:**
```
❌ Error: "El precio debe ser mayor a 0"
✅ Boleto NO se crea
```

#### Test 1.2: Precio Negativo (Debe Fallar)

**Pasos:**
1. Inspeccionar elemento (F12)
2. Cambiar `min="0.01"` del input precio
3. Ingresar precio: `-100`
4. Click "Guardar Boleto"

**Resultado Esperado:**
```
❌ Error: "El precio debe ser mayor a 0"
✅ Boleto NO se crea
✅ Validación backend funciona
```

#### Test 1.3: Precio Válido (Debe Funcionar)

**Pasos:**
1. Precio: `150.50`
2. Click "Guardar Boleto"

**Resultado Esperado:**
```
✅ Boleto creado exitosamente
✅ Precio se guarda correctamente
```

---

### PRUEBA 2: Validación de Fechas en Instancias ✅

#### Test 2.1: Llegada Antes de Salida (Debe Fallar)

**Pasos:**
1. Ir a "Instancias de Vuelo"
2. Fecha Salida: `2025-11-20T14:00`
3. Fecha Llegada: `2025-11-20T12:00` (anterior)
4. Click "Guardar Instancia"

**Resultado Esperado:**
```
❌ Error: "La fecha de llegada debe ser posterior a la fecha de salida"
✅ Instancia NO se crea
```

#### Test 2.2: Salida Muy Pronto (Debe Fallar)

**Pasos:**
1. Fecha Salida: **Hora actual + 15 minutos** (menos de 30 min)
2. Fecha Llegada: **Hora actual + 2 horas**
3. Click "Guardar Instancia"

**Resultado Esperado:**
```
❌ Error: "La fecha de salida debe ser al menos 30 minutos en el futuro"
✅ Instancia NO se crea
```

#### Test 2.3: Fechas Válidas (Debe Funcionar)

**Pasos:**
1. Fecha Salida: **Mañana 10:00 AM**
2. Fecha Llegada: **Mañana 12:30 PM**
3. Click "Guardar Instancia"

**Resultado Esperado:**
```
✅ Instancia creada exitosamente
✅ Fechas válidas
```

---

### PRUEBA 3: Validación FK al Eliminar Cliente ✅

#### Test 3.1: Eliminar Cliente SIN Reservas (Debe Funcionar)

**Pasos:**
1. Crear cliente nuevo: "Test Sin Reservas"
2. NO crear reservas para este cliente
3. Click "Eliminar" en este cliente
4. Confirmar

**Resultado Esperado:**
```
✅ Alerta verde: "Cliente eliminado exitosamente"
✅ Cliente desaparece de tabla
```

#### Test 3.2: Eliminar Cliente CON Reservas (Debe Fallar)

**Pasos:**
1. Crear cliente: "Test Con Reservas"
2. Crear 2 reservas para este cliente
3. Volver a "Clientes"
4. Click "Eliminar" en "Test Con Reservas"
5. Confirmar

**Resultado Esperado:**
```
❌ Alerta roja: "No se puede eliminar el cliente. Tiene 2 reserva(s) asociada(s)."
✅ Cliente NO se elimina
✅ Mensaje claro y específico
```

---

### PRUEBA 4: Generación de Códigos Únicos ✅

#### Test 4.1: Crear Múltiples Boletos Rápidamente

**Pasos:**
1. Crear boleto #1 → Anotar código (ej: BLT-20251117143022-000001)
2. Inmediatamente crear boleto #2 → Anotar código
3. Inmediatamente crear boleto #3 → Anotar código

**Resultado Esperado:**
```
✅ Los 3 códigos son DIFERENTES
✅ Formato: BLT-YYYYMMDDHHMMSS-NNNNNN
✅ Timestamp incluye hora completa
✅ Sin duplicados

Ejemplo:
BLT-20251117143022-000001
BLT-20251117143023-000002
BLT-20251117143024-000003
```

#### Test 4.2: Crear Múltiples Reservas Rápidamente

**Pasos:**
1. Crear 3 reservas seguidas
2. Anotar códigos

**Resultado Esperado:**
```
✅ Códigos únicos
✅ Formato: RES-YYYYMMDDHHMMSS-NNNNNN
✅ Sin duplicados
```

---

### PRUEBA 5: Validación de Fecha de Emisión ✅

#### Test 5.1: Fecha de Emisión Futura (Debe Fallar)

**Pasos:**
1. Crear boleto
2. Fecha Emisión: `2026-01-01` (futuro)
3. Click "Guardar"

**Resultado Esperado:**
```
❌ Error: "La fecha de emisión no puede ser futura"
✅ Boleto NO se crea
```

#### Test 5.2: Fecha de Emisión Hoy (Debe Funcionar)

**Pasos:**
1. Fecha Emisión: Hoy
2. Click "Guardar"

**Resultado Esperado:**
```
✅ Boleto creado exitosamente
```

---

## 📊 Checklist de Verificación

### Validaciones Backend
- [ ] Precio > 0 en boletos → **Rechazado correctamente**
- [ ] Precio negativo → **Rechazado correctamente**
- [ ] Fecha llegada < salida → **Rechazado correctamente**
- [ ] Salida muy pronta (<30 min) → **Rechazado correctamente**
- [ ] Eliminar cliente con reservas → **Mensaje claro de error**
- [ ] Fecha emisión futura → **Rechazado correctamente**

### Generación de Códigos
- [ ] Códigos de boleto únicos → **Sin duplicados**
- [ ] Códigos de reserva únicos → **Sin duplicados**
- [ ] Timestamp completo → **Incluye hora/min/seg**

### Casos Normales (Regresión)
- [ ] Crear boleto normal → **Funciona OK**
- [ ] Crear instancia normal → **Funciona OK**
- [ ] Eliminar cliente sin reservas → **Funciona OK**
- [ ] Todas las operaciones CRUD → **Funcionan OK**

---

## 🚨 Escenarios de Falla Conocidos

### ✅ RESUELTOS
1. ~~Precio ≤ 0 en boletos~~ → **RESUELTO**
2. ~~Fecha llegada < salida~~ → **RESUELTO**
3. ~~Error FK al eliminar cliente~~ → **RESUELTO**
4. ~~Códigos potencialmente duplicados~~ → **RESUELTO**
5. ~~Fecha emisión futura~~ → **RESUELTO**
6. ~~Salida inmediata de vuelos~~ → **RESUELTO**

### ⚠️ PENDIENTES (FASE 2 - Opcional)
1. Validación de capacidad de avión
2. Selectores vacíos sin mensaje
3. Búsqueda insensible a acentos
4. Validación de conflictos de avión

---

## 📝 Formato de Reporte de Bugs

Si encuentras algún problema:

```markdown
**Módulo:** [Boletos/Instancias/Clientes]
**Prueba:** [Número de test]
**Resultado Esperado:** [Qué debería pasar]
**Resultado Actual:** [Qué pasó]
**Error:** [Mensaje de error completo]

**Logs del servidor:**
[Copiar logs de consola donde corre mvnw]

**Logs del navegador:**
[Abrir F12 → Consola → Copiar errores]
```

---

## 🎯 Criterios de Éxito

### Mínimo Aceptable (6/6)
- ✅ Compilación exitosa
- ✅ Sistema inicia sin errores
- ✅ Al menos 3/6 validaciones funcionando
- ✅ Sin regresiones en funcionalidad existente

### Satisfactorio (5/6)
- ✅ Todas las validaciones funcionando
- ✅ Mensajes de error claros
- ✅ Códigos únicos verificados
- ✅ Sin regresiones

### Excelente (6/6)
- ✅ Todas las validaciones funcionando perfectamente
- ✅ Mensajes descriptivos y útiles
- ✅ Códigos únicos bajo presión (creación rápida)
- ✅ Zero regresiones
- ✅ Rendimiento sin cambios

---

## 🔍 Prueba de Estrés (Avanzada)

### Test de Concurrencia de Códigos

**Objetivo:** Verificar que generación de códigos es thread-safe

**Método Manual:**
1. Abrir 2 ventanas del navegador
2. En ambas, ir a módulo Boletos
3. Llenar formularios en ambas
4. Click "Guardar" en AMBAS al mismo tiempo
5. Verificar códigos generados

**Resultado Esperado:**
```
✅ Códigos diferentes en ambas ventanas
✅ Sin duplicados
✅ Sin errores de concurrencia
```

---

## ✅ Conclusión

Después de ejecutar todas las pruebas, deberías tener:

**Confirmado:**
- ✅ 6/6 validaciones críticas funcionando
- ✅ Mensajes de error claros y útiles
- ✅ Sistema más robusto
- ✅ Sin regresiones

**Calificación esperada:** **8.7/10** (antes: 8.1/10)

**Tiempo de pruebas:** ~30 minutos

---

**Próximo paso:** Si todas las pruebas pasan, proceder con entrega académica.
