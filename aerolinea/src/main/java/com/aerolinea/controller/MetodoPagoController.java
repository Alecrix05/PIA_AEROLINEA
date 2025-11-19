package com.aerolinea.controller;

import com.aerolinea.model.MetodoPago;
import com.aerolinea.service.MetodoPagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metodos-pago")
public class MetodoPagoController {

    @Autowired
    private MetodoPagoService metodoPagoService;

    @GetMapping
    public List<MetodoPago> listar() {
        return metodoPagoService.listar();
    }

    @GetMapping("/{id}")
    public MetodoPago obtener(@PathVariable Integer id) {
        return metodoPagoService.buscarPorId(id);
    }

    @PostMapping
    public MetodoPago crear(@RequestBody MetodoPago metodoPago) {
        return metodoPagoService.guardar(metodoPago);
    }

    @PutMapping("/{id}")
    public MetodoPago actualizar(@PathVariable Integer id, @RequestBody MetodoPago metodoPago) {
        return metodoPagoService.actualizar(id, metodoPago);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        metodoPagoService.eliminar(id);
    }
}
