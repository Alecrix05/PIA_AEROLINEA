package com.aerolinea.controller;

import com.aerolinea.model.*;
import com.aerolinea.repository.*;
import com.aerolinea.service.InstanciaVueloService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instancias-vuelo")
public class InstanciaVueloController {

    private final InstanciaVueloService instanciaVueloService;
    private final VueloRepository vueloRepository;
    private final AvionRepository avionRepository;
    private final TripulacionRepository tripulacionRepository;

    public InstanciaVueloController(
            InstanciaVueloService instanciaVueloService,
            VueloRepository vueloRepository,
            AvionRepository avionRepository,
            TripulacionRepository tripulacionRepository) {

        this.instanciaVueloService = instanciaVueloService;
        this.vueloRepository = vueloRepository;
        this.avionRepository = avionRepository;
        this.tripulacionRepository = tripulacionRepository;
    }

    @GetMapping
    public List<InstanciaVuelo> listar() {
        return instanciaVueloService.findAll();
    }

    @GetMapping("/{id}")
    public InstanciaVuelo obtener(@PathVariable Integer id) {
        return instanciaVueloService.findById(id);
    }

    @PostMapping
    public InstanciaVuelo agregar(@RequestBody InstanciaVuelo instancia) {

        if (instancia.getVuelo() != null && instancia.getVuelo().getIdVuelo() != null) {
            instancia.setVuelo(vueloRepository.findById(instancia.getVuelo().getIdVuelo()).orElse(null));
        }

        if (instancia.getAvion() != null && instancia.getAvion().getIdAvion() != null) {
            instancia.setAvion(avionRepository.findById(instancia.getAvion().getIdAvion()).orElse(null));
        }

        if (instancia.getTripulacion() != null && instancia.getTripulacion().getIdTripulacion() != null) {
            instancia.setTripulacion(tripulacionRepository.findById(instancia.getTripulacion().getIdTripulacion()).orElse(null));
        }

        return instanciaVueloService.save(instancia);
    }

    @PutMapping("/{id}")
    public InstanciaVuelo actualizar(@PathVariable Integer id, @RequestBody InstanciaVuelo instancia) {
        instancia.setIdInstanciaVuelo(id);

        if (instancia.getVuelo() != null && instancia.getVuelo().getIdVuelo() != null) {
            instancia.setVuelo(vueloRepository.findById(instancia.getVuelo().getIdVuelo()).orElse(null));
        }

        if (instancia.getAvion() != null && instancia.getAvion().getIdAvion() != null) {
            instancia.setAvion(avionRepository.findById(instancia.getAvion().getIdAvion()).orElse(null));
        }

        if (instancia.getTripulacion() != null && instancia.getTripulacion().getIdTripulacion() != null) {
            instancia.setTripulacion(tripulacionRepository.findById(instancia.getTripulacion().getIdTripulacion()).orElse(null));
        }

        return instanciaVueloService.save(instancia);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        instanciaVueloService.delete(id);
    }
}
