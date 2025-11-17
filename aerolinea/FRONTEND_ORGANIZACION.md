# Organización del Frontend - Aerolínea Carrillo

## ✅ Cambios Realizados

### 1. Archivos Movidos a `src/main/resources/static/`

Todos los archivos del frontend ahora están en la ubicación correcta para Spring Boot:

```
src/main/resources/static/
├── index.html           ✅ Sistema administrativo completo
├── styles.css           ✅ Estilos con colores azul y rojo de Aerolínea Carrillo  
├── config.js            ✅ Configuración de API
├── main.js              ✅ Navegación y dashboard
├── clientes.js          ✅ CRUD de clientes funcional
├── pasajeros.js         ⚠️  Placeholder (pendiente implementar)
├── vuelos.js            ⚠️  Placeholder (pendiente implementar)
├── instancias.js        ⚠️  Placeholder (pendiente implementar)
├── reservas.js          ⚠️  Placeholder (pendiente implementar)
├── boletos.js           ⚠️  Placeholder (pendiente implementar)
├── ventas.js            ⚠️  Placeholder (pendiente implementar)
└── busqueda.js          ⚠️  Placeholder (pendiente implementar)
```

### 2. Archivos en la Raíz del Proyecto

**NOTA**: Los archivos de la raíz (index.html, main.js, config.js, etc.) quedaron ahí. 
**Se pueden eliminar manualmente** ya que ahora todo está en `static/`.

Archivos que puedes eliminar de la raíz:
- index.html
- main.js  
- config.js
- styles.css
- clientes.js

### 3. ¿Por Qué Esta Organización?

Spring Boot sirve archivos estáticos automáticamente desde `src/main/resources/static/`:
- Cuando inicias el servidor en `localhost:8080`
- El navegador automáticamente carga `index.html` de `static/`
- No necesitas especificar la ruta

## 🚀 Cómo Iniciar el Sistema

1. **Inicia el backend:**
   ```bash
   mvnw.cmd spring-boot:run
   ```

2. **Abre el navegador:**
   ```
   http://localhost:8080
   ```

3. **Verifica que funciona:**
   - Deberías ver el Dashboard con las 4 tarjetas de estadísticas
   - El menú lateral debe tener todos los módulos
   - Al hacer clic en "Clientes" deberías poder crear/ver/eliminar clientes

## 🎨 Diseño

- **Colores corporativos**: Azul (#0056b3) y Rojo (#dc3545)
- **Framework**: Bootstrap 5.3.0
- **Iconos**: Font Awesome 6.4.0
- **Estilo**: Panel administrativo moderno con sidebar

## 📋 Estado de los Módulos

| Módulo | Estado | Descripción |
|--------|--------|-------------|
| Dashboard | ✅ Completo | Muestra estadísticas en tarjetas |
| Clientes | ✅ Completo | CRUD funcional con formularios |
| Pasajeros | 🟡 Parcial | HTML listo, falta JavaScript |
| Vuelos | 🟡 Parcial | HTML listo, falta JavaScript |
| Instancias | 🟡 Parcial | HTML listo, falta JavaScript |
| Reservas | 🟡 Parcial | HTML listo, falta JavaScript |
| Boletos | 🟡 Parcial | HTML listo, falta JavaScript |
| Ventas | 🟡 Parcial | HTML listo, falta JavaScript |
| Búsqueda | 🟡 Parcial | HTML listo, falta JavaScript |

## 🔧 Próximos Pasos

Para completar los módulos faltantes, necesitas implementar en cada archivo .js:

1. **Función de carga**: `loadXXX()` que llame al endpoint correspondiente
2. **Función de renderizado**: `renderXXXTable()` que muestre los datos en la tabla
3. **Handler del formulario**: Capturar el submit y enviar datos a la API
4. **Funciones de edición/eliminación**: Botones de acciones en cada fila

**Ejemplo**: Puedes usar `clientes.js` como plantilla para los demás módulos.

## ⚠️ Notas Importantes

1. **Sin autenticación**: Como se acordó, NO hay sistema de login/roles
2. **API Backend**: Debe estar corriendo en `localhost:8080/api`
3. **CORS**: Asegúrate que el backend tenga CORS habilitado para desarrollo
4. **Archivos duplicados**: Puedes eliminar los archivos HTML/JS/CSS de la raíz del proyecto

## 🐛 Troubleshooting

**Si no carga la página:**
- Verifica que el backend esté corriendo
- Abre la consola del navegador (F12) y busca errores
- Verifica que la URL sea exactamente `http://localhost:8080`

**Si no carga los datos:**
- Abre la consola del navegador
- Verifica que no haya errores de CORS
- Verifica que la API responda en `http://localhost:8080/api/clientes`

**Si los estilos no cargan:**
- Verifica que `styles.css` esté en `static/`
- Refresca la página con Ctrl+F5 (borrar caché)
