package com.aerolinea.service;

import com.aerolinea.model.*;
import com.aerolinea.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ConsultaService {

    private final BoletoRepository boletoRepository;
    private final ReservaRepository reservaRepository;
    private final VentaEncabezadoRepository ventaRepository;
    private final ClienteRepository clienteRepository;

    public ConsultaService(BoletoRepository boletoRepository,
                          ReservaRepository reservaRepository,
                          VentaEncabezadoRepository ventaRepository,
                          ClienteRepository clienteRepository) {
        this.boletoRepository = boletoRepository;
        this.reservaRepository = reservaRepository;
        this.ventaRepository = ventaRepository;
        this.clienteRepository = clienteRepository;
    }

    /**
     * Obtener todos los boletos de un cliente
     */
    public List<Map<String, Object>> obtenerBoletosCliente(Integer idCliente) {
        // Obtener reservas del cliente
        List<Reserva> reservas = reservaRepository.findAll().stream()
                .filter(r -> r.getCliente() != null && 
                           r.getCliente().getIdCliente().equals(idCliente))
                .collect(Collectors.toList());
        
        Set<Integer> idsReservas = reservas.stream()
                .map(Reserva::getIdReserva)
                .collect(Collectors.toSet());
        
        // Obtener boletos de esas reservas
        return boletoRepository.findAll().stream()
                .filter(b -> b.getReserva() != null && 
                           idsReservas.contains(b.getReserva().getIdReserva()))
                .map(this::mapearBoletoADTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener todas las reservas de un cliente
     */
    public List<Map<String, Object>> obtenerReservasCliente(Integer idCliente) {
        return reservaRepository.findAll().stream()
                .filter(r -> r.getCliente() != null && 
                           r.getCliente().getIdCliente().equals(idCliente))
                .map(reserva -> {
                    Map<String, Object> info = new HashMap<>();
                    info.put("idReserva", reserva.getIdReserva());
                    info.put("codigoReserva", reserva.getCodigoReserva());
                    info.put("fechaReserva", reserva.getFechaReserva());
                    info.put("estado", reserva.getEstado());
                    
                    // Contar boletos de esta reserva
                    long cantidadBoletos = boletoRepository.findAll().stream()
                            .filter(b -> b.getReserva() != null && 
                                       b.getReserva().getIdReserva().equals(reserva.getIdReserva()))
                            .count();
                    info.put("cantidadBoletos", cantidadBoletos);
                    
                    return info;
                })
                .collect(Collectors.toList());
    }

    /**
     * Obtener historial de compras de un cliente
     */
    public List<Map<String, Object>> obtenerHistorialCompras(Integer idCliente) {
        return ventaRepository.findAll().stream()
                .filter(v -> v.getCliente() != null && 
                           v.getCliente().getIdCliente().equals(idCliente))
                .sorted((v1, v2) -> v2.getFechaVenta().compareTo(v1.getFechaVenta()))
                .map(venta -> {
                    Map<String, Object> info = new HashMap<>();
                    info.put("idVenta", venta.getIdVenta());
                    info.put("fechaVenta", venta.getFechaVenta());
                    info.put("total", venta.getTotal());
                    info.put("formaPago", venta.getFormaPago());
                    info.put("canalVenta", venta.getCanalVenta());
                    info.put("estadoVenta", venta.getEstadoVenta());
                    return info;
                })
                .collect(Collectors.toList());
    }

    /**
     * Obtener detalles completos de un boleto
     */
    public Map<String, Object> obtenerDetalleBoleto(Integer idBoleto) {
        Boleto boleto = boletoRepository.findById(idBoleto).orElse(null);
        if (boleto == null) {
            return null;
        }
        return mapearBoletoADTO(boleto);
    }

    private Map<String, Object> mapearBoletoADTO(Boleto boleto) {
        Map<String, Object> info = new HashMap<>();
        info.put("idBoleto", boleto.getIdBoleto());
        info.put("numeroBoleto", boleto.getNumeroBoleto());
        info.put("fechaEmision", boleto.getFechaEmision());
        info.put("precio", boleto.getPrecio());
        info.put("clase", boleto.getClase());
        info.put("estado", boleto.getEstado());
        
        // Pasajero
        if (boleto.getPasajero() != null) {
            Map<String, String> pasajero = new HashMap<>();
            pasajero.put("nombre", boleto.getPasajero().getNombre());
            pasajero.put("apellidoP", boleto.getPasajero().getApellidoP());
            pasajero.put("apellidoM", boleto.getPasajero().getApellidoM());
            info.put("pasajero", pasajero);
        }
        
        // Asiento
        if (boleto.getAsiento() != null) {
            info.put("asiento", boleto.getAsiento().getCodigoAsiento());
            info.put("ubicacion", boleto.getAsiento().getUbicacion());
        }
        
        // Vuelo
        if (boleto.getInstanciaVuelo() != null) {
            InstanciaVuelo instancia = boleto.getInstanciaVuelo();
            Map<String, Object> vuelo = new HashMap<>();
            
            if (instancia.getVuelo() != null) {
                vuelo.put("numeroVuelo", instancia.getVuelo().getNumeroVuelo());
                vuelo.put("duracion", instancia.getVuelo().getDuracion());
                
                if (instancia.getVuelo().getRuta() != null) {
                    Ruta ruta = instancia.getVuelo().getRuta();
                    if (ruta.getOrigen() != null) {
                        vuelo.put("origen", ruta.getOrigen().getNombre());
                        vuelo.put("codigoOrigen", ruta.getOrigen().getCodigoIATA());
                    }
                    if (ruta.getDestino() != null) {
                        vuelo.put("destino", ruta.getDestino().getNombre());
                        vuelo.put("codigoDestino", ruta.getDestino().getCodigoIATA());
                    }
                }
            }
            
            vuelo.put("fechaSalida", instancia.getFechaSalida());
            vuelo.put("fechaLlegada", instancia.getFechaLlegada());
            vuelo.put("estadoVuelo", instancia.getEstadoVuelo());
            
            info.put("vuelo", vuelo);
        }
        
        // Reserva
        if (boleto.getReserva() != null) {
            info.put("codigoReserva", boleto.getReserva().getCodigoReserva());
        }
        
        return info;
    }
}
