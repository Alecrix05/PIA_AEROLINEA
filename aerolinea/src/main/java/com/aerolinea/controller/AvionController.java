package com.aerolinea.controller;

import com.aerolinea.model.Avion;
import com.aerolinea.service.AvionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aviones")
public class AvionController {

    @Autowired
    private AvionService avionService;

    @GetMapping
    public List<Avion> listar() {
        return avionService.listar();
    }

    @GetMapping("/{id}")
    public Avion obtener(@PathVariable Integer id) {
        return avionService.buscarPorId(id);
    }

    @PostMapping
    public Avion crear(@RequestBody Avion avion) {
        return avionService.guardar(avion);
    }
}
