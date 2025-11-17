package com.aerolinea.controller;

import com.aerolinea.model.*;
import com.aerolinea.repository.*;
import com.aerolinea.service.BoletoService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boletos")
public class BoletoController {

    private final BoletoService boletoService;
    private final PasajeroRepository pasajeroRepository;
    private final ReservaRepository reservaRepository;
    private final InstanciaVueloRepository instanciaVueloRepository;
    private final AsientoRepository asientoRepository;
    private final TarifaRepository tarifaRepository;

    public BoletoController(
            BoletoService boletoService,
            PasajeroRepository pasajeroRepository,
            ReservaRepository reservaRepository,
            InstanciaVueloRepository instanciaVueloRepository,
            AsientoRepository asientoRepository,
            TarifaRepository tarifaRepository) {

        this.boletoService = boletoService;
        this.pasajeroRepository = pasajeroRepository;
        this.reservaRepository = reservaRepository;
        this.instanciaVueloRepository = instanciaVueloRepository;
        this.asientoRepository = asientoRepository;
        this.tarifaRepository = tarifaRepository;
    }

    @GetMapping
    public List<Boleto> listar() {
        return boletoService.findAll();
    }

    @GetMapping("/{id}")
    public Boleto obtener(@PathVariable Integer id) {
        return boletoService.findById(id);
    }

    @PostMapping
    public Boleto agregar(@RequestBody Boleto boleto) {

        if (boleto.getPasajero() != null && boleto.getPasajero().getIdPasajero() != null) {
            boleto.setPasajero(
                    pasajeroRepository.findById(boleto.getPasajero().getIdPasajero()).orElse(null)
            );
        }

        if (boleto.getReserva() != null && boleto.getReserva().getIdReserva() != null) {
            boleto.setReserva(
                    reservaRepository.findById(boleto.getReserva().getIdReserva()).orElse(null)
            );
        }

        if (boleto.getInstanciaVuelo() != null && boleto.getInstanciaVuelo().getIdInstanciaVuelo() != null) {
            boleto.setInstanciaVuelo(
                    instanciaVueloRepository.findById(boleto.getInstanciaVuelo().getIdInstanciaVuelo()).orElse(null)
            );
        }

        if (boleto.getAsiento() != null && boleto.getAsiento().getIdAsiento() != null) {
            boleto.setAsiento(
                    asientoRepository.findById(boleto.getAsiento().getIdAsiento()).orElse(null)
            );
        }

        if (boleto.getTarifa() != null && boleto.getTarifa().getIdTarifa() != null) {
            boleto.setTarifa(
                    tarifaRepository.findById(boleto.getTarifa().getIdTarifa()).orElse(null)
            );
        }

        return boletoService.save(boleto);
    }

    @PutMapping("/{id}")
    public Boleto actualizar(@PathVariable Integer id, @RequestBody Boleto boleto) {
        boleto.setIdBoleto(id);
        
        if (boleto.getPasajero() != null && boleto.getPasajero().getIdPasajero() != null) {
            boleto.setPasajero(
                    pasajeroRepository.findById(boleto.getPasajero().getIdPasajero()).orElse(null)
            );
        }

        if (boleto.getReserva() != null && boleto.getReserva().getIdReserva() != null) {
            boleto.setReserva(
                    reservaRepository.findById(boleto.getReserva().getIdReserva()).orElse(null)
            );
        }

        if (boleto.getInstanciaVuelo() != null && boleto.getInstanciaVuelo().getIdInstanciaVuelo() != null) {
            boleto.setInstanciaVuelo(
                    instanciaVueloRepository.findById(boleto.getInstanciaVuelo().getIdInstanciaVuelo()).orElse(null)
            );
        }

        if (boleto.getAsiento() != null && boleto.getAsiento().getIdAsiento() != null) {
            boleto.setAsiento(
                    asientoRepository.findById(boleto.getAsiento().getIdAsiento()).orElse(null)
            );
        }

        if (boleto.getTarifa() != null && boleto.getTarifa().getIdTarifa() != null) {
            boleto.setTarifa(
                    tarifaRepository.findById(boleto.getTarifa().getIdTarifa()).orElse(null)
            );
        }

        return boletoService.save(boleto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        boletoService.delete(id);
    }
}
