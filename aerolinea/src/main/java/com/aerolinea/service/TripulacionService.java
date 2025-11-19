package com.aerolinea.service;

import com.aerolinea.model.Tripulacion;
import com.aerolinea.repository.TripulacionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TripulacionService {

    private final TripulacionRepository tripulacionRepository;

    public TripulacionService(TripulacionRepository tripulacionRepository) {
        this.tripulacionRepository = tripulacionRepository;
    }

    public List<Tripulacion> findAll() {
        return tripulacionRepository.findAll();
    }

    public Tripulacion save(Tripulacion tripulacion) {
        return tripulacionRepository.save(tripulacion);
    }

    public Tripulacion findById(Integer id) {
        return tripulacionRepository.findById(id).orElse(null);
    }

    public Tripulacion update(Integer id, Tripulacion tripulacion) {
        tripulacion.setIdTripulacion(id);
        return tripulacionRepository.save(tripulacion);
    }

    public void deleteById(Integer id) {
        tripulacionRepository.deleteById(id);
    }
}
