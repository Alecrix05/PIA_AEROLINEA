# 🌐 Guía de Integración para Frontend

Esta guía muestra cómo consumir la API desde un frontend (React, Vue, Angular, etc.)

## 🔧 Configuración Inicial

### Base URL
```javascript
const API_URL = 'http://localhost:8080/api';
```

## 📖 Ejemplos de Uso

### 1. Buscar Vuelos

```javascript
// Buscar vuelos disponibles
async function buscarVuelos(origen, destino, fecha, pasajeros) {
  const response = await fetch(
    `${API_URL}/busqueda/vuelos?origen=${origen}&destino=${destino}&fecha=${fecha}&pasajeros=${pasajeros}`
  );
  return await response.json();
}

// Ejemplo de uso
const vuelos = await buscarVuelos(1, 2, '2025-06-15', 2);
console.log(vuelos);
/*
[
  {
    "idInstanciaVuelo": 1,
    "numeroVuelo": "AM101",
    "fechaSalida": "2025-06-15T08:00:00",
    "fechaLlegada": "2025-06-15T09:45:00",
    "asientosDisponibles": 150
  }
]
*/
```

### 2. Ver Mapa de Asientos

```javascript
async function obtenerAsientos(idVuelo) {
  const response = await fetch(
    `${API_URL}/busqueda/vuelos/${idVuelo}/asientos`
  );
  return await response.json();
}

// Ejemplo de uso
const asientos = await obtenerAsientos(1);

// Renderizar asientos
asientos.asientos.forEach(asiento => {
  console.log(`${asiento.codigo} - ${asiento.disponible ? 'Disponible' : 'Ocupado'}`);
});
```

### 3. Proceso de Compra Completo

```javascript
async function procesarCompra(compraData) {
  const response = await fetch(`${API_URL}/compra/procesar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(compraData)
  });
  return await response.json();
}

// Ejemplo de uso
const compra = {
  idCliente: 1,
  idInstanciaVuelo: 1,
  idMetodoPago: 1,
  pasajeros: [
    {
      nombre: "Juan",
      apellidoP: "Pérez",
      apellidoM: "González",
      clase: "Económica",
      asiento: "12A"
    },
    {
      nombre: "María",
      apellidoP: "Pérez",
      apellidoM: "González",
      clase: "Económica",
      asiento: "12B"
    }
  ]
};

const resultado = await procesarCompra(compra);

if (resultado.success) {
  console.log(`Compra exitosa! Código de reserva: ${resultado.reserva}`);
  console.log(`Total: $${resultado.total}`);
  resultado.boletos.forEach(boleto => {
    console.log(`Boleto ${boleto.numeroBoleto} - ${boleto.pasajero} - Asiento ${boleto.asiento}`);
  });
} else {
  console.error(`Error: ${resultado.error}`);
}
```

### 4. Consultar Mis Boletos

```javascript
async function obtenerMisBoletos(idCliente) {
  const response = await fetch(
    `${API_URL}/consulta/clientes/${idCliente}/boletos`
  );
  return await response.json();
}

// Ejemplo de uso
const boletos = await obtenerMisBoletos(1);
boletos.forEach(boleto => {
  console.log(`${boleto.numeroBoleto} - ${boleto.vuelo.origen} → ${boleto.vuelo.destino}`);
});
```

### 5. CRUD de Clientes

```javascript
// Crear cliente
async function crearCliente(cliente) {
  const response = await fetch(`${API_URL}/clientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cliente)
  });
  return await response.json();
}

// Obtener cliente
async function obtenerCliente(id) {
  const response = await fetch(`${API_URL}/clientes/${id}`);
  return await response.json();
}

// Actualizar cliente
async function actualizarCliente(id, cliente) {
  const response = await fetch(`${API_URL}/clientes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cliente)
  });
  return await response.json();
}
```

## 🎨 Componentes de Frontend Sugeridos

### Componente: BuscadorVuelos

```jsx
import React, { useState } from 'react';

function BuscadorVuelos() {
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [fecha, setFecha] = useState('');
  const [pasajeros, setPasajeros] = useState(1);
  const [vuelos, setVuelos] = useState([]);
  const [loading, setLoading] = useState(false);

  const buscar = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/busqueda/vuelos?origen=${origen}&destino=${destino}&fecha=${fecha}&pasajeros=${pasajeros}`
      );
      const data = await response.json();
      setVuelos(data);
    } catch (error) {
      console.error('Error al buscar vuelos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Buscar Vuelos</h2>
      <input 
        type="number" 
        placeholder="ID Origen" 
        value={origen}
        onChange={(e) => setOrigen(e.target.value)}
      />
      <input 
        type="number" 
        placeholder="ID Destino" 
        value={destino}
        onChange={(e) => setDestino(e.target.value)}
      />
      <input 
        type="date" 
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />
      <input 
        type="number" 
        placeholder="Pasajeros" 
        value={pasajeros}
        onChange={(e) => setPasajeros(e.target.value)}
      />
      <button onClick={buscar} disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar'}
      </button>

      <div>
        {vuelos.map(vuelo => (
          <div key={vuelo.idInstanciaVuelo}>
            <h3>{vuelo.numeroVuelo}</h3>
            <p>{vuelo.origen} → {vuelo.destino}</p>
            <p>Salida: {new Date(vuelo.fechaSalida).toLocaleString()}</p>
            <p>Asientos disponibles: {vuelo.asientosDisponibles}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuscadorVuelos;
```

### Componente: MapaAsientos

```jsx
import React, { useState, useEffect } from 'react';

function MapaAsientos({ idVuelo, onSeleccionarAsiento }) {
  const [asientos, setAsientos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    cargarAsientos();
  }, [idVuelo]);

  const cargarAsientos = async () => {
    const response = await fetch(
      `http://localhost:8080/api/busqueda/vuelos/${idVuelo}/asientos`
    );
    const data = await response.json();
    setAsientos(data.asientos);
  };

  const seleccionar = (asiento) => {
    if (asiento.disponible) {
      setSeleccionado(asiento.codigo);
      onSeleccionarAsiento(asiento);
    }
  };

  return (
    <div>
      <h3>Selecciona tu asiento</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
        {asientos.map(asiento => (
          <button
            key={asiento.idAsiento}
            onClick={() => seleccionar(asiento)}
            disabled={!asiento.disponible}
            style={{
              backgroundColor: 
                seleccionado === asiento.codigo ? 'blue' :
                asiento.disponible ? 'green' : 'red',
              color: 'white',
              padding: '10px'
            }}
          >
            {asiento.codigo}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MapaAsientos;
```

### Componente: ProcesoCompra

```jsx
import React, { useState } from 'react';

function ProcesoCompra({ vuelo, cliente }) {
  const [pasajeros, setPasajeros] = useState([{
    nombre: '',
    apellidoP: '',
    apellidoM: '',
    clase: 'Económica',
    asiento: ''
  }]);
  const [metodoPago, setMetodoPago] = useState(1);

  const agregarPasajero = () => {
    setPasajeros([...pasajeros, {
      nombre: '',
      apellidoP: '',
      apellidoM: '',
      clase: 'Económica',
      asiento: ''
    }]);
  };

  const actualizarPasajero = (index, campo, valor) => {
    const nuevos = [...pasajeros];
    nuevos[index][campo] = valor;
    setPasajeros(nuevos);
  };

  const procesarCompra = async () => {
    const compra = {
      idCliente: cliente.idCliente,
      idInstanciaVuelo: vuelo.idInstanciaVuelo,
      idMetodoPago: metodoPago,
      pasajeros: pasajeros
    };

    try {
      const response = await fetch('http://localhost:8080/api/compra/procesar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compra)
      });
      const resultado = await response.json();
      
      if (resultado.success) {
        alert(`¡Compra exitosa! Código de reserva: ${resultado.reserva}`);
        // Aquí puedes redirigir a una página de confirmación
      } else {
        alert(`Error: ${resultado.error}`);
      }
    } catch (error) {
      alert('Error al procesar la compra');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Completar Compra</h2>
      
      {pasajeros.map((pasajero, index) => (
        <div key={index} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h4>Pasajero {index + 1}</h4>
          <input 
            placeholder="Nombre"
            value={pasajero.nombre}
            onChange={(e) => actualizarPasajero(index, 'nombre', e.target.value)}
          />
          <input 
            placeholder="Apellido Paterno"
            value={pasajero.apellidoP}
            onChange={(e) => actualizarPasajero(index, 'apellidoP', e.target.value)}
          />
          <input 
            placeholder="Apellido Materno"
            value={pasajero.apellidoM}
            onChange={(e) => actualizarPasajero(index, 'apellidoM', e.target.value)}
          />
          <select 
            value={pasajero.clase}
            onChange={(e) => actualizarPasajero(index, 'clase', e.target.value)}
          >
            <option value="Económica">Económica</option>
            <option value="Ejecutiva">Ejecutiva</option>
            <option value="Primera">Primera</option>
          </select>
          <input 
            placeholder="Asiento (ej: 12A)"
            value={pasajero.asiento}
            onChange={(e) => actualizarPasajero(index, 'asiento', e.target.value)}
          />
        </div>
      ))}

      <button onClick={agregarPasajero}>+ Agregar Pasajero</button>

      <div style={{ marginTop: '20px' }}>
        <h4>Método de Pago</h4>
        <select value={metodoPago} onChange={(e) => setMetodoPago(Number(e.target.value))}>
          <option value={1}>Tarjeta de Crédito</option>
          <option value={2}>Transferencia</option>
          <option value={3}>Efectivo</option>
        </select>
      </div>

      <button 
        onClick={procesarCompra}
        style={{ 
          marginTop: '20px', 
          padding: '15px 30px', 
          backgroundColor: 'green', 
          color: 'white',
          fontSize: '18px'
        }}
      >
        Confirmar Compra
      </button>
    </div>
  );
}

export default ProcesoCompra;
```

## 🔐 Manejo de Errores

```javascript
async function handleRequest(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      // Manejar errores de la API
      if (data.error) {
        throw new Error(data.message || data.error);
      }
      throw new Error(`Error ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error en la petición:', error);
    // Mostrar mensaje al usuario
    alert(error.message);
    throw error;
  }
}

// Uso
try {
  const vuelos = await handleRequest(
    `${API_URL}/busqueda/vuelos?origen=1&destino=2&fecha=2025-06-15&pasajeros=2`
  );
} catch (error) {
  // Error ya manejado
}
```

## 📱 Flujo Completo de Compra (React)

```jsx
import React, { useState } from 'react';

function AppCompraCompleta() {
  const [paso, setPaso] = useState(1);
  const [vueloSeleccionado, setVueloSeleccionado] = useState(null);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState([]);

  return (
    <div>
      {paso === 1 && (
        <BuscadorVuelos 
          onSeleccionar={(vuelo) => {
            setVueloSeleccionado(vuelo);
            setPaso(2);
          }}
        />
      )}
      
      {paso === 2 && (
        <MapaAsientos 
          vuelo={vueloSeleccionado}
          onContinuar={(asientos) => {
            setAsientosSeleccionados(asientos);
            setPaso(3);
          }}
        />
      )}
      
      {paso === 3 && (
        <ProcesoCompra 
          vuelo={vueloSeleccionado}
          asientos={asientosSeleccionados}
        />
      )}
    </div>
  );
}
```

## 🎯 Tips de Integración

1. **Usar variables de entorno** para la URL de la API
2. **Implementar loading states** durante las peticiones
3. **Validar datos** antes de enviarlos
4. **Cachear resultados** cuando sea posible
5. **Manejar errores** de forma amigable
6. **Usar TypeScript** para mejor type safety

## 📦 Librerías Recomendadas

### React
- `axios` - Cliente HTTP más robusto
- `react-query` - Manejo de estado del servidor
- `formik` + `yup` - Formularios y validación

### Vue
- `axios` - Cliente HTTP
- `pinia` - Estado global
- `vee-validate` - Validación de formularios

### Angular
- `HttpClient` - Incluido en Angular
- `RxJS` - Manejo de observables
- `Reactive Forms` - Formularios reactivos

---

**¡Listo para integrar con tu frontend! 🚀**
