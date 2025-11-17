package com.aerolinea.controller;

import com.aerolinea.model.Aeropuerto;
import com.aerolinea.service.AeropuertoService;
import com.aerolinea.model.Ciudad;
import com.aerolinea.service.CiudadService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aeropuertos")
public class AeropuertoController {

    @Autowired
    private AeropuertoService aeropuertoService;

    @Autowired
    private CiudadService ciudadService;

    @GetMapping
    public List<Aeropuerto> listar() {
        return aeropuertoService.listar();
    }

    @GetMapping("/{id}")
    public Aeropuerto obtener(@PathVariable Integer id) {
        return aeropuertoService.buscarPorId(id);
    }

    @PostMapping
    public Aeropuerto crear(@RequestBody Aeropuerto aeropuerto) {
        return aeropuertoService.guardar(aeropuerto);
    }
}
