package com.aerolinea.service;

import com.aerolinea.model.Boleto;
import com.aerolinea.repository.BoletoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BoletoService {

    private final BoletoRepository boletoRepository;

    public BoletoService(BoletoRepository boletoRepository) {
        this.boletoRepository = boletoRepository;
    }

    public List<Boleto> findAll() {
        return boletoRepository.findAll();
    }

    public Boleto findById(Integer id) {
        return boletoRepository.findById(id).orElseThrow(() -> 
            new RuntimeException("Boleto no encontrado con ID: " + id));
    }

    public Boleto save(Boleto boleto) {
        // Validación adicional: precio debe ser mayor a 0
        if (boleto.getPrecio() != null && boleto.getPrecio().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor a 0");
        }
        
        // Validación: fecha de emisión no puede ser futura
        if (boleto.getFechaEmision() != null && boleto.getFechaEmision().isAfter(java.time.LocalDate.now())) {
            throw new IllegalArgumentException("La fecha de emisión no puede ser futura");
        }
        
        return boletoRepository.save(boleto);
    }

    public void delete(Integer id) {
        boletoRepository.deleteById(id);
    }
}
