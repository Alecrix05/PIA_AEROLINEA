package com.aerolinea.service;

import com.aerolinea.model.*;
import com.aerolinea.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BusquedaVueloService {

    private final InstanciaVueloRepository instanciaVueloRepository;
    private final BoletoRepository boletoRepository;
    private final AsientoRepository asientoRepository;

    public BusquedaVueloService(InstanciaVueloRepository instanciaVueloRepository,
                                BoletoRepository boletoRepository,
                                AsientoRepository asientoRepository) {
        this.instanciaVueloRepository = instanciaVueloRepository;
        this.boletoRepository = boletoRepository;
        this.asientoRepository = asientoRepository;
    }

    /**
     * Busca vuelos disponibles según origen, destino y fecha
     */
    public List<Map<String, Object>> buscarVuelos(Integer idOrigen, Integer idDestino, LocalDate fecha, Integer pasajeros) {
        List<InstanciaVuelo> instancias = instanciaVueloRepository.findAll();
        
        return instancias.stream()
                .filter(iv -> iv.getVuelo() != null && iv.getVuelo().getRuta() != null)
                .filter(iv -> iv.getVuelo().getRuta().getOrigen().getIdAeropuerto().equals(idOrigen))
                .filter(iv -> iv.getVuelo().getRuta().getDestino().getIdAeropuerto().equals(idDestino))
                .filter(iv -> iv.getFechaSalida() != null && 
                             iv.getFechaSalida().toLocalDate().equals(fecha))
                .filter(iv -> "PROGRAMADO".equals(iv.getEstadoVuelo()))
                .map(iv -> {
                    Map<String, Object> vueloInfo = new HashMap<>();
                    vueloInfo.put("idInstanciaVuelo", iv.getIdInstanciaVuelo());
                    vueloInfo.put("numeroVuelo", iv.getVuelo().getNumeroVuelo());
                    vueloInfo.put("fechaSalida", iv.getFechaSalida());
                    vueloInfo.put("fechaLlegada", iv.getFechaLlegada());
                    vueloInfo.put("duracion", iv.getVuelo().getDuracion());
                    vueloInfo.put("origen", iv.getVuelo().getRuta().getOrigen().getNombre());
                    vueloInfo.put("destino", iv.getVuelo().getRuta().getDestino().getNombre());
                    vueloInfo.put("asientosDisponibles", contarAsientosDisponibles(iv.getIdInstanciaVuelo()));
                    vueloInfo.put("capacidad", iv.getAvion().getCapacidad());
                    return vueloInfo;
                })
                .filter(v -> (Integer) v.get("asientosDisponibles") >= pasajeros)
                .collect(Collectors.toList());
    }

    /**
     * Cuenta los asientos disponibles en una instancia de vuelo
     */
    public int contarAsientosDisponibles(Integer idInstanciaVuelo) {
        InstanciaVuelo instancia = instanciaVueloRepository.findById(idInstanciaVuelo).orElse(null);
        if (instancia == null || instancia.getAvion() == null) {
            return 0;
        }
        
        // Total de asientos del avión
        List<Asiento> todosAsientos = asientoRepository.findAll().stream()
                .filter(a -> a.getAvion() != null && 
                           a.getAvion().getIdAvion().equals(instancia.getAvion().getIdAvion()))
                .collect(Collectors.toList());
        
        // Asientos ocupados
        List<Boleto> boletosVendidos = boletoRepository.findAll().stream()
                .filter(b -> b.getInstanciaVuelo() != null && 
                           b.getInstanciaVuelo().getIdInstanciaVuelo().equals(idInstanciaVuelo))
                .filter(b -> "ACTIVO".equals(b.getEstado()))
                .collect(Collectors.toList());
        
        return todosAsientos.size() - boletosVendidos.size();
    }

    /**
     * Obtiene mapa de asientos disponibles/ocupados
     */
    public Map<String, Object> obtenerMapaAsientos(Integer idInstanciaVuelo) {
        InstanciaVuelo instancia = instanciaVueloRepository.findById(idInstanciaVuelo).orElse(null);
        if (instancia == null) {
            throw new RuntimeException("Instancia de vuelo no encontrada");
        }
        
        List<Asiento> asientos = asientoRepository.findAll().stream()
                .filter(a -> a.getAvion() != null && 
                           a.getAvion().getIdAvion().equals(instancia.getAvion().getIdAvion()))
                .collect(Collectors.toList());
        
        List<Boleto> boletosVendidos = boletoRepository.findAll().stream()
                .filter(b -> b.getInstanciaVuelo() != null && 
                           b.getInstanciaVuelo().getIdInstanciaVuelo().equals(idInstanciaVuelo))
                .filter(b -> "ACTIVO".equals(b.getEstado()))
                .collect(Collectors.toList());
        
        Set<Integer> asientosOcupados = boletosVendidos.stream()
                .map(b -> b.getAsiento() != null ? b.getAsiento().getIdAsiento() : null)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        
        List<Map<String, Object>> asientosDetalle = asientos.stream()
                .map(a -> {
                    Map<String, Object> asientoInfo = new HashMap<>();
                    asientoInfo.put("idAsiento", a.getIdAsiento());
                    asientoInfo.put("codigo", a.getCodigoAsiento());
                    asientoInfo.put("fila", a.getFila());
                    asientoInfo.put("columna", a.getColumna());
                    asientoInfo.put("clase", a.getClase());
                    asientoInfo.put("ubicacion", a.getUbicacion());
                    asientoInfo.put("disponible", !asientosOcupados.contains(a.getIdAsiento()));
                    return asientoInfo;
                })
                .collect(Collectors.toList());
        
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("asientos", asientosDetalle);
        resultado.put("totalAsientos", asientos.size());
        resultado.put("asientosDisponibles", asientos.size() - asientosOcupados.size());
        resultado.put("asientosOcupados", asientosOcupados.size());
        
        return resultado;
    }
}
