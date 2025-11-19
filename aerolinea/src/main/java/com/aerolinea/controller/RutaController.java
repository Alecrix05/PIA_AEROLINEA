package com.aerolinea.controller;

import com.aerolinea.model.Aeropuerto;
import com.aerolinea.model.Ruta;
import com.aerolinea.repository.AeropuertoRepository;
import com.aerolinea.service.RutaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rutas") 
public class RutaController {

    private final RutaService rutaService;
    private final AeropuertoRepository aeropuertoRepository;

    public RutaController(RutaService rutaService, AeropuertoRepository aeropuertoRepository) {
        this.rutaService = rutaService;
        this.aeropuertoRepository = aeropuertoRepository;
    }

    @GetMapping
    public List<Ruta> listar() {
        return rutaService.findAll();
    }

    @PostMapping
    public Ruta agregar(@RequestBody Ruta ruta) {

        if (ruta.getOrigen() != null && ruta.getOrigen().getIdAeropuerto() != null) {
            Aeropuerto origen = aeropuertoRepository.findById(ruta.getOrigen().getIdAeropuerto())
                    .orElse(null);
            ruta.setOrigen(origen);
        }

        if (ruta.getDestino() != null && ruta.getDestino().getIdAeropuerto() != null) {
            Aeropuerto destino = aeropuertoRepository.findById(ruta.getDestino().getIdAeropuerto())
                    .orElse(null);
            ruta.setDestino(destino);
        }

        return rutaService.save(ruta);
    }

    @GetMapping("/{id}")
    public Ruta obtener(@PathVariable Integer id) {
        return rutaService.findById(id);
    }

    @PutMapping("/{id}")
    public Ruta actualizar(@PathVariable Integer id, @RequestBody Ruta ruta) {
        if (ruta.getOrigen() != null && ruta.getOrigen().getIdAeropuerto() != null) {
            Aeropuerto origen = aeropuertoRepository.findById(ruta.getOrigen().getIdAeropuerto())
                    .orElse(null);
            ruta.setOrigen(origen);
        }

        if (ruta.getDestino() != null && ruta.getDestino().getIdAeropuerto() != null) {
            Aeropuerto destino = aeropuertoRepository.findById(ruta.getDestino().getIdAeropuerto())
                    .orElse(null);
            ruta.setDestino(destino);
        }
        return rutaService.update(id, ruta);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        rutaService.deleteById(id);
    }
}
