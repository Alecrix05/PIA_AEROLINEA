# Frontend - Aerolínea Carrillo

## Estructura de Archivos

```
src/main/resources/static/
├── index.html           # Página principal del sistema administrativo
├── styles.css           # Estilos personalizados (colores azul y rojo)
├── config.js            # Configuración de API y funciones auxiliares
├── main.js              # Navegación y carga del dashboard
├── clientes.js          # Módulo de gestión de clientes
├── pasajeros.js         # Módulo de gestión de pasajeros
├── vuelos.js            # Módulo de gestión de vuelos
├── instancias.js        # Módulo de instancias de vuelo
├── reservas.js          # Módulo de gestión de reservas
├── boletos.js           # Módulo de gestión de boletos
├── ventas.js            # Módulo de gestión de ventas
└── busqueda.js          # Módulo de búsqueda de vuelos
```

## Cómo Usar

1. Inicia el backend de Spring Boot:
   ```
   mvnw.cmd spring-boot:run
   ```

2. Abre el navegador en:
   ```
   http://localhost:8080
   ```

3. El sistema carga automáticamente con el dashboard

## Colores de la Aerolínea

- **Azul Principal**: #0056b3
- **Azul Claro**: #007bff
- **Rojo**: #dc3545

## Módulos Disponibles

- **Dashboard**: Vista general con estadísticas
- **Clientes**: CRUD completo funcional
- **Pasajeros**: Formularios creados (pendiente lógica)
- **Vuelos**: Formularios creados (pendiente lógica)
- **Instancias de Vuelo**: Formularios creados (pendiente lógica)
- **Reservas**: Formularios creados (pendiente lógica)
- **Boletos**: Formularios creados (pendiente lógica)
- **Ventas**: Vista creada (pendiente lógica)
- **Búsqueda**: Formulario creado (pendiente lógica)

## Notas

- El módulo de Clientes está completamente funcional
- Los demás módulos tienen la estructura HTML lista, pero requieren implementar la lógica JavaScript
- El sistema no tiene autenticación (como se acordó para la entrega rápida)
