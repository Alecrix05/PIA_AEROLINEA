package com.aerolinea.controller;

import com.aerolinea.service.CompraService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/compra")
@CrossOrigin(origins = "*")
public class CompraController {

    private final CompraService compraService;

    public CompraController(CompraService compraService) {
        this.compraService = compraService;
    }

    /**
     * Procesar compra completa de boletos
     * 
     * POST /api/compra/procesar
     * {
     *   "idCliente": 1,
     *   "idInstanciaVuelo": 1,
     *   "idMetodoPago": 1,
     *   "pasajeros": [
     *     {
     *       "nombre": "Juan",
     *       "apellidoP": "Pérez",
     *       "apellidoM": "González",
     *       "clase": "Económica",
     *       "asiento": "12A"
     *     }
     *   ]
     * }
     */
    @PostMapping("/procesar")
    public ResponseEntity<?> procesarCompra(@RequestBody Map<String, Object> request) {
        try {
            Map<String, Object> resultado = compraService.procesarCompra(request);
            return ResponseEntity.ok(resultado);
        } catch (BusinessException | ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Error al procesar la compra: " + e.getMessage()
            ));
        }
    }
}
