package com.aerolinea.controller;

import com.aerolinea.model.Ciudad;
import com.aerolinea.service.CiudadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ciudades")
public class CiudadController {

    @Autowired
    private CiudadService ciudadService;

    @GetMapping
    public List<Ciudad> listar() {
        return ciudadService.listar();
    }

    @GetMapping("/{id}")
    public Ciudad obtener(@PathVariable Integer id) {
        return ciudadService.buscarPorId(id);
    }

    @PostMapping
    public Ciudad crear(@RequestBody Ciudad ciudad) {
        return ciudadService.guardar(ciudad);
    }
}
