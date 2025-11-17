package com.aerolinea.controller;

import com.aerolinea.model.VentaEncabezado;
import com.aerolinea.model.TicketVentaDTO;
import com.aerolinea.service.VentaEncabezadoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
public class VentaEncabezadoController {

    private final VentaEncabezadoService ventaService;

    public VentaEncabezadoController(VentaEncabezadoService ventaService) {
        this.ventaService = ventaService;
    }

    @GetMapping
    public List<VentaEncabezado> getVentas() {
        return ventaService.getAllVentas();
    }

    @GetMapping("/{id}")
    public VentaEncabezado getVenta(@PathVariable Integer id) {
        return ventaService.getVentaById(id);
    }

    /* 
    @GetMapping("/{id}/ticket")
    public TicketVentaDTO getTicketVenta(@PathVariable Integer id) {
        return ventaService.generarTicketVenta(id);
    }*/

    @PostMapping
    public VentaEncabezado saveVenta(@RequestBody VentaEncabezado venta) {
        return ventaService.saveVenta(venta);
    }

    @PutMapping("/{id}")
    public VentaEncabezado updateVenta(@PathVariable Integer id, @RequestBody VentaEncabezado venta) {
        venta.setIdVenta(id);
        return ventaService.saveVenta(venta);
    }

    @DeleteMapping("/{id}")
    public void deleteVenta(@PathVariable Integer id) {
        ventaService.deleteVenta(id);
    }
}
