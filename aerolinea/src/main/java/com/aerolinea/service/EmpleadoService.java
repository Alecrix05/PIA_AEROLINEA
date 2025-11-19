package com.aerolinea.service;

import com.aerolinea.model.Empleado;
import com.aerolinea.repository.EmpleadoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmpleadoService {

    private final EmpleadoRepository empleadoRepository;

    public EmpleadoService(EmpleadoRepository empleadoRepository) {
        this.empleadoRepository = empleadoRepository;
    }

    public List<Empleado> findAll() {
        return empleadoRepository.findAll();
    }

    public Empleado save(Empleado empleado) {
        return empleadoRepository.save(empleado);
    }

    public Empleado findById(Integer id) {
        return empleadoRepository.findById(id).orElse(null);
    }

    public Empleado update(Integer id, Empleado empleado) {
        empleado.setIdEmpleado(id);
        return empleadoRepository.save(empleado);
    }

    public void deleteById(Integer id) {
        empleadoRepository.deleteById(id);
    }
}
