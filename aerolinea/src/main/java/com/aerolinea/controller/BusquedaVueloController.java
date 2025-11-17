package com.aerolinea.controller;

import com.aerolinea.service.BusquedaVueloService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/busqueda")
@CrossOrigin(origins = "*")
public class BusquedaVueloController {

    private final BusquedaVueloService busquedaService;

    public BusquedaVueloController(BusquedaVueloService busquedaService) {
        this.busquedaService = busquedaService;
    }

    /**
     * Buscar vuelos disponibles
     * GET /api/busqueda/vuelos?origen=1&destino=2&fecha=2025-06-15&pasajeros=2
     */
    @GetMapping("/vuelos")
    public ResponseEntity<List<Map<String, Object>>> buscarVuelos(
            @RequestParam Integer origen,
            @RequestParam Integer destino,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            @RequestParam(defaultValue = "1") Integer pasajeros) {
        
        List<Map<String, Object>> vuelos = busquedaService.buscarVuelos(origen, destino, fecha, pasajeros);
        return ResponseEntity.ok(vuelos);
    }

    /**
     * Obtener mapa de asientos de un vuelo
     * GET /api/busqueda/vuelos/1/asientos
     */
    @GetMapping("/vuelos/{idInstanciaVuelo}/asientos")
    public ResponseEntity<Map<String, Object>> obtenerAsientos(@PathVariable Integer idInstanciaVuelo) {
        Map<String, Object> mapa = busquedaService.obtenerMapaAsientos(idInstanciaVuelo);
        return ResponseEntity.ok(mapa);
    }

    /**
     * Contar asientos disponibles de un vuelo
     * GET /api/busqueda/vuelos/1/disponibles
     */
    @GetMapping("/vuelos/{idInstanciaVuelo}/disponibles")
    public ResponseEntity<Map<String, Object>> contarDisponibles(@PathVariable Integer idInstanciaVuelo) {
        int disponibles = busquedaService.contarAsientosDisponibles(idInstanciaVuelo);
        return ResponseEntity.ok(Map.of("disponibles", disponibles));
    }
}
