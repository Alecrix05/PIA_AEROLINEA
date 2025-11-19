package com.aerolinea.service;

import com.aerolinea.controller.BusinessException;
import com.aerolinea.controller.ResourceNotFoundException;
import com.aerolinea.model.*;
import com.aerolinea.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CompraService {

    private final ClienteRepository clienteRepository;
    private final ReservaRepository reservaRepository;
    private final BoletoRepository boletoRepository;
    private final PasajeroRepository pasajeroRepository;
    private final InstanciaVueloRepository instanciaVueloRepository;
    private final AsientoRepository asientoRepository;
    private final TarifaRepository tarifaRepository;
    private final VentaEncabezadoRepository ventaRepository;
    private final VentaDetalleRepository detalleRepository;
    private final PagoRepository pagoRepository;
    private final MetodoPagoRepository metodoPagoRepository;
    private final CodigoGeneratorService codigoGenerator;
    private final BusquedaVueloService busquedaService;

    public CompraService(ClienteRepository clienteRepository,
                        ReservaRepository reservaRepository,
                        BoletoRepository boletoRepository,
                        PasajeroRepository pasajeroRepository,
                        InstanciaVueloRepository instanciaVueloRepository,
                        AsientoRepository asientoRepository,
                        TarifaRepository tarifaRepository,
                        VentaEncabezadoRepository ventaRepository,
                        VentaDetalleRepository detalleRepository,
                        PagoRepository pagoRepository,
                        MetodoPagoRepository metodoPagoRepository,
                        CodigoGeneratorService codigoGenerator,
                        BusquedaVueloService busquedaService) {
        this.clienteRepository = clienteRepository;
        this.reservaRepository = reservaRepository;
        this.boletoRepository = boletoRepository;
        this.pasajeroRepository = pasajeroRepository;
        this.instanciaVueloRepository = instanciaVueloRepository;
        this.asientoRepository = asientoRepository;
        this.tarifaRepository = tarifaRepository;
        this.ventaRepository = ventaRepository;
        this.detalleRepository = detalleRepository;
        this.pagoRepository = pagoRepository;
        this.metodoPagoRepository = metodoPagoRepository;
        this.codigoGenerator = codigoGenerator;
        this.busquedaService = busquedaService;
    }

    /**
     * Procesar compra completa de boletos
     */
    @Transactional
    public Map<String, Object> procesarCompra(Map<String, Object> request) {
        // Extraer datos de la solicitud
        Integer idCliente = (Integer) request.get("idCliente");
        Integer idInstanciaVuelo = (Integer) request.get("idInstanciaVuelo");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> pasajeros = (List<Map<String, Object>>) request.get("pasajeros");
        Integer idMetodoPago = (Integer) request.get("idMetodoPago");
        
        // Validar cliente
        Cliente cliente = clienteRepository.findById(idCliente)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", "id", idCliente));
        
        // Validar instancia de vuelo
        InstanciaVuelo instancia = instanciaVueloRepository.findById(idInstanciaVuelo)
                .orElseThrow(() -> new ResourceNotFoundException("Instancia de vuelo", "id", idInstanciaVuelo));
        
        // Validar que el vuelo esté programado
        if (!"PROGRAMADO".equals(instancia.getEstadoVuelo())) {
            throw new BusinessException("El vuelo no está disponible para compra");
        }
        
        // Validar que haya suficientes asientos
        int disponibles = busquedaService.contarAsientosDisponibles(idInstanciaVuelo);
        if (disponibles < pasajeros.size()) {
            throw new BusinessException("No hay suficientes asientos disponibles");
        }
        
        // Crear reserva
        Reserva reserva = new Reserva();
        reserva.setCodigoReserva(codigoGenerator.generarCodigoReserva());
        reserva.setFechaReserva(LocalDate.now());
        reserva.setEstado("CONFIRMADA");
        reserva.setCliente(cliente);
        reserva = reservaRepository.save(reserva);
        
        // Crear boletos para cada pasajero
        List<Boleto> boletos = new ArrayList<>();
        BigDecimal totalVenta = BigDecimal.ZERO;
        
        for (Map<String, Object> pasajeroData : pasajeros) {
            // Buscar o crear pasajero
            Pasajero pasajero = obtenerOCrearPasajero(pasajeroData, cliente);
            
            // Obtener tarifa según clase
            String clase = (String) pasajeroData.getOrDefault("clase", "Económica");
            Tarifa tarifa = tarifaRepository.findAll().stream()
                    .filter(t -> clase.equals(t.getClase()) && Boolean.TRUE.equals(t.getActivo()))
                    .findFirst()
                    .orElseThrow(() -> new BusinessException("No hay tarifa disponible para la clase " + clase));
            
            // Buscar asiento disponible
            String codigoAsiento = (String) pasajeroData.get("asiento");
            Asiento asiento = null;
            if (codigoAsiento != null) {
                // Buscar asiento por código y avión
                Integer idAvion = instancia.getAvion().getIdAvion();
                asiento = asientoRepository.findAll().stream()
                        .filter(a -> codigoAsiento.equals(a.getCodigoAsiento()))
                        .filter(a -> a.getAvion() != null && idAvion.equals(a.getAvion().getIdAvion()))
                        .findFirst()
                        .orElseThrow(() -> new BusinessException("Asiento no encontrado: " + codigoAsiento));
                
                // Verificar que el asiento no esté ocupado
                Integer idAsiento = asiento.getIdAsiento();
                boolean ocupado = boletoRepository.findAll().stream()
                        .anyMatch(b -> b.getAsiento() != null && 
                                     b.getAsiento().getIdAsiento().equals(idAsiento) &&
                                     b.getInstanciaVuelo() != null &&
                                     b.getInstanciaVuelo().getIdInstanciaVuelo().equals(idInstanciaVuelo) &&
                                     "ACTIVO".equals(b.getEstado()));
                
                if (ocupado) {
                    throw new BusinessException("El asiento " + codigoAsiento + " ya está ocupado");
                }
            }
            
            // Crear boleto
            Boleto boleto = new Boleto();
            boleto.setNumeroBoleto(codigoGenerator.generarCodigoBoleto());
            boleto.setFechaEmision(LocalDate.now());
            boleto.setPrecio(tarifa.getPrecioBase());
            boleto.setClase(clase);
            boleto.setEstado("ACTIVO");
            boleto.setAsiento(asiento);
            boleto.setTarifa(tarifa);
            boleto.setPasajero(pasajero);
            boleto.setReserva(reserva);
            boleto.setInstanciaVuelo(instancia);
            boleto = boletoRepository.save(boleto);
            
            boletos.add(boleto);
            totalVenta = totalVenta.add(tarifa.getPrecioBase());
        }
        
        // Calcular total con impuestos
        BigDecimal totalConImpuestos = totalVenta.multiply(new BigDecimal("1.16"));
        
        // Crear venta encabezado
        VentaEncabezado venta = new VentaEncabezado();
        venta.setFechaVenta(LocalDate.now());
        venta.setFormaPago(idMetodoPago == 1 ? "TARJETA" : "EFECTIVO");
        venta.setCanalVenta("WEB");
        venta.setTotal(totalConImpuestos);
        venta.setEstadoVenta("COMPLETADA");
        venta.setCliente(cliente);
        venta = ventaRepository.save(venta);
        
        // Crear detalles de venta
        for (Boleto boleto : boletos) {
            VentaDetalle detalle = new VentaDetalle();
            BigDecimal precio = boleto.getPrecio();
            BigDecimal impuestos = precio.multiply(new BigDecimal("0.16"));
            BigDecimal subtotal = precio.add(impuestos);
            
            detalle.setPrecioUnitario(precio);
            detalle.setImpuestos(impuestos);
            detalle.setSubtotal(subtotal);
            detalle.setVenta(venta);
            detalle.setBoleto(boleto);
            detalleRepository.save(detalle);
        }
        
        // Crear pago
        MetodoPago metodoPago = metodoPagoRepository.findById(idMetodoPago)
                .orElse(null);
        
        Pago pago = new Pago();
        pago.setMetodoPago(metodoPago != null ? metodoPago.getNombre() : "EFECTIVO");
        pago.setMetodoPagoObj(metodoPago);
        pago.setMonto(totalVenta);
        pago.setFechaPago(LocalDate.now());
        pago.setEstatus("CONFIRMADO");
        pago.setVenta(venta);
        pagoRepository.save(pago);
        
        // Preparar respuesta
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("mensaje", "Compra procesada exitosamente");
        response.put("reserva", reserva.getCodigoReserva());
        response.put("idVenta", venta.getIdVenta());
        response.put("total", totalVenta);
        response.put("boletos", boletos.stream().map(b -> {
            Map<String, Object> boletoInfo = new HashMap<>();
            boletoInfo.put("numeroBoleto", b.getNumeroBoleto());
            boletoInfo.put("pasajero", b.getPasajero().getNombre() + " " + b.getPasajero().getApellidoP());
            boletoInfo.put("asiento", b.getAsiento() != null ? b.getAsiento().getCodigoAsiento() : "Por asignar");
            boletoInfo.put("clase", b.getClase());
            boletoInfo.put("precio", b.getPrecio());
            return boletoInfo;
        }).toList());
        
        return response;
    }
    
    private Pasajero obtenerOCrearPasajero(Map<String, Object> data, Cliente cliente) {
        Integer idPasajero = (Integer) data.get("idPasajero");
        
        if (idPasajero != null) {
            return pasajeroRepository.findById(idPasajero)
                    .orElseThrow(() -> new ResourceNotFoundException("Pasajero", "id", idPasajero));
        }
        
        // Crear nuevo pasajero
        Pasajero pasajero = new Pasajero();
        pasajero.setNombre((String) data.get("nombre"));
        pasajero.setApellidoP((String) data.get("apellidoP"));
        pasajero.setApellidoM((String) data.get("apellidoM"));
        pasajero.setNacionalidad((String) data.getOrDefault("nacionalidad", "Mexicana"));
        pasajero.setCliente(cliente);
        
        return pasajeroRepository.save(pasajero);
    }
}
