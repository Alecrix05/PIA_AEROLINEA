package com.aerolinea.controller;

import com.aerolinea.model.Ruta;
import com.aerolinea.model.Vuelo;
import com.aerolinea.repository.RutaRepository;
import com.aerolinea.service.VueloService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vuelos") 
public class VueloController {

    private final VueloService vueloService;
    private final RutaRepository rutaRepository;

    public VueloController(VueloService vueloService, RutaRepository rutaRepository) {
        this.vueloService = vueloService;
        this.rutaRepository = rutaRepository;
    }

    @GetMapping
    public List<Vuelo> listar() {
        return vueloService.findAll();
    }

    @GetMapping("/{id}")
    public Vuelo obtener(@PathVariable Integer id) {
        return vueloService.findById(id);
    }

    @PostMapping
    public Vuelo agregar(@RequestBody Vuelo vuelo) {
        if (vuelo.getRuta() != null && vuelo.getRuta().getIdRuta() != null) {
            Ruta ruta = rutaRepository.findById(vuelo.getRuta().getIdRuta()).orElse(null);
            vuelo.setRuta(ruta);
        }
        return vueloService.save(vuelo);
    }

    @PutMapping("/{id}")
    public Vuelo actualizar(@PathVariable Integer id, @RequestBody Vuelo vuelo) {
        vuelo.setIdVuelo(id);
        if (vuelo.getRuta() != null && vuelo.getRuta().getIdRuta() != null) {
            Ruta ruta = rutaRepository.findById(vuelo.getRuta().getIdRuta()).orElse(null);
            vuelo.setRuta(ruta);
        }
        return vueloService.save(vuelo);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        vueloService.delete(id);
    }
}
