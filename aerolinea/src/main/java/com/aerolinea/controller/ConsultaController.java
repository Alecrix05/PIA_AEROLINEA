package com.aerolinea.controller;

import com.aerolinea.service.ConsultaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/consulta")
@CrossOrigin(origins = "*")
public class ConsultaController {

    private final ConsultaService consultaService;

    public ConsultaController(ConsultaService consultaService) {
        this.consultaService = consultaService;
    }

    /**
     * Obtener todos los boletos de un cliente
     * GET /api/consulta/clientes/1/boletos
     */
    @GetMapping("/clientes/{idCliente}/boletos")
    public ResponseEntity<List<Map<String, Object>>> obtenerBoletosCliente(@PathVariable Integer idCliente) {
        List<Map<String, Object>> boletos = consultaService.obtenerBoletosCliente(idCliente);
        return ResponseEntity.ok(boletos);
    }

    /**
     * Obtener todas las reservas de un cliente
     * GET /api/consulta/clientes/1/reservas
     */
    @GetMapping("/clientes/{idCliente}/reservas")
    public ResponseEntity<List<Map<String, Object>>> obtenerReservasCliente(@PathVariable Integer idCliente) {
        List<Map<String, Object>> reservas = consultaService.obtenerReservasCliente(idCliente);
        return ResponseEntity.ok(reservas);
    }

    /**
     * Obtener historial de compras de un cliente
     * GET /api/consulta/clientes/1/historial
     */
    @GetMapping("/clientes/{idCliente}/historial")
    public ResponseEntity<List<Map<String, Object>>> obtenerHistorialCompras(@PathVariable Integer idCliente) {
        List<Map<String, Object>> historial = consultaService.obtenerHistorialCompras(idCliente);
        return ResponseEntity.ok(historial);
    }

    /**
     * Obtener detalles de un boleto específico
     * GET /api/consulta/boletos/1
     */
    @GetMapping("/boletos/{idBoleto}")
    public ResponseEntity<?> obtenerDetalleBoleto(@PathVariable Integer idBoleto) {
        Map<String, Object> detalle = consultaService.obtenerDetalleBoleto(idBoleto);
        if (detalle == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(detalle);
    }
}
