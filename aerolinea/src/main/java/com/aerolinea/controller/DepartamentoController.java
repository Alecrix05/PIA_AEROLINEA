package com.aerolinea.controller;

import com.aerolinea.model.Departamento;
import com.aerolinea.service.DepartamentoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departamentos")
public class DepartamentoController {

    private final DepartamentoService departamentoService;

    public DepartamentoController(DepartamentoService departamentoService) {
        this.departamentoService = departamentoService;
    }

    @GetMapping
    public List<Departamento> listarDepartamentos() {
        return departamentoService.findAll();
    }

    @PostMapping
    public Departamento agregarDepartamento(@RequestBody Departamento departamento) {
        return departamentoService.save(departamento);
    }
}
