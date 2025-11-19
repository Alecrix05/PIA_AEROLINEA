package com.aerolinea.controller;

import com.aerolinea.service.CompraService;
import com.aerolinea.service.PrintingService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/compra")
@CrossOrigin(origins = "*")
public class CompraController {

    private final CompraService compraService;
    private final PrintingService printingService;

    public CompraController(CompraService compraService, PrintingService printingService) {
        this.compraService = compraService;
        this.printingService = printingService;
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

    /**
     * Generar ticket de compra en PDF
     * GET /api/compra/ticket/{idVenta}
     */
    @GetMapping("/ticket/{idVenta}")
    public ResponseEntity<byte[]> generarTicket(@PathVariable Integer idVenta) {
        try {
            byte[] pdfBytes = printingService.generarTicketVenta(idVenta);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "ticket-" + idVenta + ".pdf");
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Generar pase de abordar en PDF
     * GET /api/compra/pase-abordar/{idBoleto}
     */
    @GetMapping("/pase-abordar/{idBoleto}")
    public ResponseEntity<byte[]> generarPaseAbordar(@PathVariable Integer idBoleto) {
        try {
            byte[] pdfBytes = printingService.generarPaseAbordar(idBoleto);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "pase-abordar-" + idBoleto + ".pdf");
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
