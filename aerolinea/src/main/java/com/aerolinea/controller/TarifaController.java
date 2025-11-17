package com.aerolinea.controller;

import com.aerolinea.model.Tarifa;
import com.aerolinea.service.TarifaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tarifas")
public class TarifaController {

    @Autowired
    private TarifaService tarifaService;

    @GetMapping
    public List<Tarifa> listar() {
        return tarifaService.listar();
    }

    @GetMapping("/{id}")
    public Tarifa obtener(@PathVariable Integer id) {
        return tarifaService.buscarPorId(id);
    }

    @PostMapping
    public Tarifa crear(@RequestBody Tarifa tarifa) {
        return tarifaService.guardar(tarifa);
    }
}
