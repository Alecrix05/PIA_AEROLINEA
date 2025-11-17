package com.aerolinea.controller;

import com.aerolinea.model.Pago;
import com.aerolinea.service.PagoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    private final PagoService pagoService;

    public PagoController(PagoService pagoService) {
        this.pagoService = pagoService;
    }

    @GetMapping
    public List<Pago> getPagos() {
        return pagoService.getAllPagos();
    }

    @PostMapping
    public Pago savePago(@RequestBody Pago pago) {
        return pagoService.savePago(pago);
    }
}
