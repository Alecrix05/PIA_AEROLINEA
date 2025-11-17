package com.aerolinea.service;

import com.aerolinea.model.Pago;
import com.aerolinea.repository.PagoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PagoService {

    private final PagoRepository pagoRepository;

    public PagoService(PagoRepository pagoRepository) {
        this.pagoRepository = pagoRepository;
    }

    public List<Pago> getAllPagos() {
        return pagoRepository.findAll();
    }

    public Pago savePago(Pago pago) {
        return pagoRepository.save(pago);
    }
}
