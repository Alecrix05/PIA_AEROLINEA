package com.aerolinea.controller;

import com.aerolinea.model.Reserva;
import com.aerolinea.service.ReservaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @GetMapping
    public List<Reserva> getReservas() {
        return reservaService.getAllReservas();
    }

    @GetMapping("/{id}")
    public Reserva getReserva(@PathVariable Integer id) {
        return reservaService.getReservaById(id);
    }

    @PostMapping
    public Reserva saveReserva(@RequestBody Reserva reserva) {
        return reservaService.saveReserva(reserva);
    }

    @PutMapping("/{id}")
    public Reserva updateReserva(@PathVariable Integer id, @RequestBody Reserva reserva) {
        reserva.setIdReserva(id);
        return reservaService.saveReserva(reserva);
    }

    @DeleteMapping("/{id}")
    public void deleteReserva(@PathVariable Integer id) {
        reservaService.deleteReserva(id);
    }
}
