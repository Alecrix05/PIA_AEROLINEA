package com.aerolinea.controller;

import com.aerolinea.model.Departamento;
import com.aerolinea.model.Empleado;
import com.aerolinea.repository.DepartamentoRepository;
import com.aerolinea.service.EmpleadoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empleados")
public class EmpleadoController {

    private final EmpleadoService empleadoService;
    private final DepartamentoRepository departamentoRepository;

    public EmpleadoController(EmpleadoService empleadoService, DepartamentoRepository departamentoRepository) {
        this.empleadoService = empleadoService;
        this.departamentoRepository = departamentoRepository;
    }

    @GetMapping
    public List<Empleado> listarEmpleados() {
        return empleadoService.findAll();
    }

    @PostMapping
    public Empleado agregarEmpleado(@RequestBody Empleado empleado) {

        if (empleado.getDepartamento() != null &&
            empleado.getDepartamento().getIdDepartamento() != null) {

            Departamento dept = departamentoRepository
                    .findById(empleado.getDepartamento().getIdDepartamento())
                    .orElse(null);

            empleado.setDepartamento(dept);
        }

        return empleadoService.save(empleado);
    }

    @GetMapping("/{id}")
    public Empleado obtenerEmpleado(@PathVariable Integer id) {
        return empleadoService.findById(id);
    }

    @PutMapping("/{id}")
    public Empleado actualizarEmpleado(@PathVariable Integer id, @RequestBody Empleado empleado) {
        if (empleado.getDepartamento() != null &&
            empleado.getDepartamento().getIdDepartamento() != null) {

            Departamento dept = departamentoRepository
                    .findById(empleado.getDepartamento().getIdDepartamento())
                    .orElse(null);

            empleado.setDepartamento(dept);
        }
        return empleadoService.update(id, empleado);
    }

    @DeleteMapping("/{id}")
    public void eliminarEmpleado(@PathVariable Integer id) {
        empleadoService.deleteById(id);
    }
}
