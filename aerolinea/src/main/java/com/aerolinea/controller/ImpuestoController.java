package com.aerolinea.controller;

import com.aerolinea.model.Impuesto;
import com.aerolinea.service.ImpuestoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/impuestos")
public class ImpuestoController {

    @Autowired
    private ImpuestoService impuestoService;

    @GetMapping
    public List<Impuesto> listar() {
        return impuestoService.listar();
    }

    @GetMapping("/{id}")
    public Impuesto obtener(@PathVariable Integer id) {
        return impuestoService.buscarPorId(id);
    }

    @PostMapping
    public Impuesto crear(@RequestBody Impuesto impuesto) {
        return impuestoService.guardar(impuesto);
    }

    @PutMapping("/{id}")
    public Impuesto actualizar(@PathVariable Integer id, @RequestBody Impuesto impuesto) {
        return impuestoService.actualizar(id, impuesto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        impuestoService.eliminar(id);
    }
}
