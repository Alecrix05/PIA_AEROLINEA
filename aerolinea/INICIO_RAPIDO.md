# ⚡ INICIO RÁPIDO

## 🚀 Para empezar YA

### 1️⃣ Verificar Base de Datos
```bash
# Conectar a MySQL
mysql -u root -p

# Verificar que existe la BD
SHOW DATABASES;
# Debe aparecer: aerolinea

# Si NO existe, crearla:
mysql -u root -p < BD_aerolinea.sql
```

### 2️⃣ Configurar Contraseña
Edita: `src/main/resources/application.properties`
```properties
spring.datasource.password=TU_CONTRASEÑA_AQUI
```

### 3️⃣ Iniciar Aplicación
```bash
# Windows
mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

Espera este mensaje:
```
Started AerolineaApplication in X.XXX seconds
```

### 4️⃣ Probar que Funciona
Abre en el navegador:
```
http://localhost:8080/api/clientes
```

Deberías ver: `[]` o una lista de clientes

## 🧪 Crear Datos de Prueba

Abre el archivo `api-tests.http` en VS Code con la extensión "REST Client"

**Ejecuta EN ORDEN:**

1. Crear Departamento (línea 13)
2. Crear Empleado (línea 40)
3. Crear Tripulación (línea 88)
4. Crear Ciudad CDMX (línea 115)
5. Crear Ciudad Monterrey (línea 123)
6. Crear Aeropuerto MEX (línea 163)
7. Crear Aeropuerto MTY (línea 172)
8. Crear Ruta (línea 208)
9. Crear Vuelo (línea 241)
10. Crear Avión (línea 279)
11. Crear Asientos (líneas 318-368)
12. Crear Instancia de Vuelo (línea 396)
13. Crear Cliente (línea 440)
14. Crear Pasajero (línea 534)
15. Crear Reserva (línea 579)
16. Crear Tarifa (línea 615)

## 🎯 Probar Nuevas Funcionalidades

### Buscar Vuelos
```http
GET http://localhost:8080/api/busqueda/vuelos?origen=1&destino=2&fecha=2025-06-15&pasajeros=2
```

### Ver Asientos Disponibles
```http
GET http://localhost:8080/api/busqueda/vuelos/1/asientos
```

### Comprar Boletos (IMPORTANTE: Ajustar IDs)
```http
POST http://localhost:8080/api/compra/procesar
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
    }
  ]
}
```

### Ver Mis Boletos
```http
GET http://localhost:8080/api/consulta/clientes/1/boletos
```

## ❗ Problemas Comunes

### Error: "Access denied for user"
**Solución:** Verifica usuario/contraseña en `application.properties`

### Error: "Table doesn't exist"
**Solución:** Ejecuta el script SQL:
```bash
mysql -u root -p < BD_aerolinea.sql
```

### Error: "Port 8080 already in use"
**Solución 1:** Cambia el puerto en `application.properties`:
```properties
server.port=8081
```
**Solución 2:** Mata el proceso:
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID [NUMERO] /F

# Linux/Mac
lsof -i :8080
kill -9 [PID]
```

### Error al crear Asiento: "Foreign key constraint fails"
**Solución:** Asegúrate de haber creado el Avión primero

### Error: "No hay suficientes asientos disponibles"
**Solución:** Crea más asientos para el avión o reduce pasajeros

## 📱 Para Conectar con Frontend

### React
```javascript
const API_URL = 'http://localhost:8080/api';

// Buscar vuelos
fetch(`${API_URL}/busqueda/vuelos?origen=1&destino=2&fecha=2025-06-15&pasajeros=2`)
  .then(res => res.json())
  .then(vuelos => console.log(vuelos));

// Comprar
fetch(`${API_URL}/compra/procesar`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    idCliente: 1,
    idInstanciaVuelo: 1,
    idMetodoPago: 1,
    pasajeros: [{ nombre: "Juan", apellidoP: "Pérez", apellidoM: "G", clase: "Económica", asiento: "12A" }]
  })
})
.then(res => res.json())
.then(result => console.log(result));
```

Ver `FRONTEND_GUIDE.md` para ejemplos completos.

## 📚 Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `README.md` | Documentación completa |
| `api-tests.http` | Pruebas de todos los endpoints |
| `FRONTEND_GUIDE.md` | Guía para conectar frontend |
| `ANALISIS_Y_MEJORAS.md` | Plan de trabajo completo |
| `CAMBIOS_REALIZADOS.md` | Resumen de lo implementado |

## 🎓 Flujo Típico de Uso

```
1. Cliente busca vuelos
   ↓
2. Ve asientos disponibles
   ↓
3. Selecciona asientos
   ↓
4. Llena datos de pasajeros
   ↓
5. Procesa pago
   ↓
6. Recibe confirmación con código de reserva y boletos
   ↓
7. Puede consultar sus boletos después
```

## 🆘 Ayuda Rápida

**¿La API no responde?**
- Verifica que Spring Boot esté corriendo
- Revisa la consola por errores
- Prueba: `curl http://localhost:8080/api/clientes`

**¿Error 404?**
- Verifica la URL
- Asegúrate que el endpoint existe
- Revisa `README.md` para endpoints correctos

**¿Error 500?**
- Revisa la consola de Spring Boot
- Verifica que la BD tenga datos necesarios
- Checa que los IDs en el JSON existan

## ✅ Checklist Pre-Entrega

- [ ] Base de datos creada y poblada
- [ ] Aplicación inicia sin errores
- [ ] Endpoints de búsqueda funcionan
- [ ] Proceso de compra funciona
- [ ] Consultas de cliente funcionan
- [ ] Documentación revisada
- [ ] Frontend conectado (si aplica)

## 🎉 ¡Listo para Entregar!

Tu proyecto ahora tiene:
- ✅ 22 entidades
- ✅ CRUD completo
- ✅ Búsqueda de vuelos
- ✅ Proceso de compra transaccional
- ✅ Validaciones de negocio
- ✅ Consultas de cliente
- ✅ CORS para frontend
- ✅ Manejo de errores
- ✅ Documentación completa

---

**¿Dudas? Revisa los archivos .md en el proyecto** 📖
