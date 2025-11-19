package com.aerolinea.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aerolinea.model.Pasajero;
import com.aerolinea.repository.PasajeroRepository;

import java.util.List;

@Service
public class PasajeroService {

    @Autowired
    private PasajeroRepository pasajeroRepository;
    
    @Autowired
    private EncryptionService encryptionService;

    public Pasajero guardar(Pasajero pasajero) {
        return pasajeroRepository.save(pasajero);
    }
    
    // Método para guardar con pasaporte alfanumérico
    public Pasajero guardarConPasaporte(Pasajero pasajero, String pasaporteTexto) {
        if (pasaporteTexto != null && !pasaporteTexto.isEmpty()) {
            pasajero.setPasaporte(encryptionService.encrypt(pasaporteTexto));
        }
        return pasajeroRepository.save(pasajero);
    }
    
    // Método para obtener pasaporte desencriptado
    public String obtenerPasaporteTexto(Pasajero pasajero) {
        if (pasajero.getPasaporte() != null) {
            return encryptionService.decrypt(pasajero.getPasaporte());
        }
        return null;
    }

    public List<Pasajero> listar() {
        return pasajeroRepository.findAll();
    }

    public Pasajero buscarPorId(Integer id) {
        return pasajeroRepository.findById(id).orElse(null);
    }

    public List<Pasajero> buscarPorCliente(Integer idCliente) {
        return pasajeroRepository.findByClienteIdCliente(idCliente);
    }

    public void eliminar(Integer id) {
        pasajeroRepository.deleteById(id);
    }
}
