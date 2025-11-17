package com.aerolinea.controller;

import com.aerolinea.model.Asiento;
import com.aerolinea.service.AsientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asientos")
public class AsientoController {

    @Autowired
    private AsientoService asientoService;

    @GetMapping
    public List<Asiento> listar() {
        return asientoService.listar();
    }

    @GetMapping("/{id}")
    public Asiento obtener(@PathVariable Integer id) {
        return asientoService.buscarPorId(id);
    }

    @PostMapping
    public Asiento crear(@RequestBody Asiento asiento) {
        return asientoService.guardar(asiento);
    }
}
