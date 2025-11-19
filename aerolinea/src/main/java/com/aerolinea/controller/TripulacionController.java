package com.aerolinea.controller;

import com.aerolinea.model.Empleado;
import com.aerolinea.model.Tripulacion;
import com.aerolinea.repository.EmpleadoRepository;
import com.aerolinea.service.TripulacionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tripulaciones")
public class TripulacionController {

    private final TripulacionService tripulacionService;
    private final EmpleadoRepository empleadoRepository;

    public TripulacionController(TripulacionService tripulacionService, EmpleadoRepository empleadoRepository) {
        this.tripulacionService = tripulacionService;
        this.empleadoRepository = empleadoRepository;
    }

    @GetMapping
    public List<Tripulacion> listar() {
        return tripulacionService.findAll();
    }

    @PostMapping
    public Tripulacion agregar(@RequestBody Tripulacion tripulacion) {

        if (tripulacion.getPiloto() != null && tripulacion.getPiloto().getIdEmpleado() != null) {
            Empleado piloto = empleadoRepository
                    .findById(tripulacion.getPiloto().getIdEmpleado())
                    .orElse(null);
            tripulacion.setPiloto(piloto);
        }

        if (tripulacion.getCopiloto() != null && tripulacion.getCopiloto().getIdEmpleado() != null) {
            Empleado copiloto = empleadoRepository
                    .findById(tripulacion.getCopiloto().getIdEmpleado())
                    .orElse(null);
            tripulacion.setCopiloto(copiloto);
        }

        return tripulacionService.save(tripulacion);
    }

    @GetMapping("/{id}")
    public Tripulacion obtener(@PathVariable Integer id) {
        return tripulacionService.findById(id);
    }

    @PutMapping("/{id}")
    public Tripulacion actualizar(@PathVariable Integer id, @RequestBody Tripulacion tripulacion) {
        if (tripulacion.getPiloto() != null && tripulacion.getPiloto().getIdEmpleado() != null) {
            Empleado piloto = empleadoRepository
                    .findById(tripulacion.getPiloto().getIdEmpleado())
                    .orElse(null);
            tripulacion.setPiloto(piloto);
        }

        if (tripulacion.getCopiloto() != null && tripulacion.getCopiloto().getIdEmpleado() != null) {
            Empleado copiloto = empleadoRepository
                    .findById(tripulacion.getCopiloto().getIdEmpleado())
                    .orElse(null);
            tripulacion.setCopiloto(copiloto);
        }
        return tripulacionService.update(id, tripulacion);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        tripulacionService.deleteById(id);
    }
}
