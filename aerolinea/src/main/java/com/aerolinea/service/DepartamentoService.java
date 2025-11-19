package com.aerolinea.service;

import com.aerolinea.model.Departamento;
import com.aerolinea.repository.DepartamentoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartamentoService {

    private final DepartamentoRepository departamentoRepository;

    public DepartamentoService(DepartamentoRepository departamentoRepository) {
        this.departamentoRepository = departamentoRepository;
    }

    public List<Departamento> findAll() {
        return departamentoRepository.findAll();
    }

    public Departamento save(Departamento departamento) {
        return departamentoRepository.save(departamento);
    }

    public Departamento findById(Integer id) {
        return departamentoRepository.findById(id).orElse(null);
    }

    public Departamento update(Integer id, Departamento departamento) {
        departamento.setIdDepartamento(id);
        return departamentoRepository.save(departamento);
    }

    public void deleteById(Integer id) {
        departamentoRepository.deleteById(id);
    }
}
