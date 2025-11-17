package com.aerolinea.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.aerolinea.model.Pasajero;
import com.aerolinea.service.PasajeroService;

import java.util.List;

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

    @PutMapping("/{id}")
    public Pasajero actualizar(@PathVariable Integer id, @RequestBody Pasajero pasajero) {
        pasajero.setIdPasajero(id);
        return pasajeroService.guardar(pasajero);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        pasajeroService.eliminar(id);
    }
}
