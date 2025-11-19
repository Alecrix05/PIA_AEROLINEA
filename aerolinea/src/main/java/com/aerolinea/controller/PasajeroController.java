package com.aerolinea.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.aerolinea.model.Pasajero;
import com.aerolinea.service.PasajeroService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pasajeros")
public class PasajeroController {

    @Autowired
    private PasajeroService pasajeroService;

    @GetMapping
    public List<Pasajero> listar() {
        return pasajeroService.listar();
    }

    @GetMapping("/{id}")
    public Pasajero obtener(@PathVariable Integer id) {
        return pasajeroService.buscarPorId(id);
    }

    @PostMapping
    public Pasajero crear(@RequestBody Pasajero pasajero) {
        return pasajeroService.guardar(pasajero);
    }
    
    @PostMapping("/con-pasaporte")
    public Pasajero crearConPasaporte(@RequestBody Map<String, Object> datos) {
        // Crear pasajero sin pasaporte
        Pasajero pasajero = new Pasajero();
        pasajero.setNombre((String) datos.get("nombre"));
        pasajero.setApellidoP((String) datos.get("apellidoP"));
        pasajero.setApellidoM((String) datos.get("apellidoM"));
        pasajero.setFechaNacimiento(java.sql.Date.valueOf((String) datos.get("fechaNacimiento")));
        pasajero.setNacionalidad((String) datos.get("nacionalidad"));
        
        // Manejar cliente
        if (datos.get("cliente") != null) {
            @SuppressWarnings("unchecked")
            Map<String, Object> clienteData = (Map<String, Object>) datos.get("cliente");
            com.aerolinea.model.Cliente cliente = new com.aerolinea.model.Cliente();
            cliente.setIdCliente((Integer) clienteData.get("idCliente"));
            pasajero.setCliente(cliente);
        }
        
        // Guardar con pasaporte encriptado si se proporciona
        String pasaporteTexto = (String) datos.get("pasaporte");
        if (pasaporteTexto != null && !pasaporteTexto.trim().isEmpty()) {
            return pasajeroService.guardarConPasaporte(pasajero, pasaporteTexto);
        } else {
            return pasajeroService.guardar(pasajero);
        }
    }

    @PutMapping("/{id}")
    public Pasajero actualizar(@PathVariable Integer id, @RequestBody Pasajero pasajero) {
        pasajero.setIdPasajero(id);
        return pasajeroService.guardar(pasajero);
    }

    @GetMapping("/cliente/{idCliente}")
    public List<Pasajero> listarPorCliente(@PathVariable Integer idCliente) {
        return pasajeroService.buscarPorCliente(idCliente);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        pasajeroService.eliminar(id);
    }
}
