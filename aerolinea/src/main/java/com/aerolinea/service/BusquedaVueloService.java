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
            System.out.println("Instancia o avión no encontrado para ID: " + idInstanciaVuelo);
            return 0;
        }
        
        // Asientos ocupados (solo boletos activos)
        List<Boleto> boletosVendidos = boletoRepository.findAll().stream()
                .filter(b -> b.getInstanciaVuelo() != null && 
                           b.getInstanciaVuelo().getIdInstanciaVuelo().equals(idInstanciaVuelo))
                .filter(b -> "ACTIVO".equals(b.getEstado()) || "EMITIDO".equals(b.getEstado()))
                .collect(Collectors.toList());
        
        int asientosOcupados = boletosVendidos.size();
        int capacidadAvion = instancia.getAvion().getCapacidad();
        int disponibles = capacidadAvion - asientosOcupados;
        
        System.out.println("Vuelo " + idInstanciaVuelo + ": " + capacidadAvion + " capacidad, " + asientosOcupados + " ocupados, " + disponibles + " disponibles");
        
        return Math.max(0, disponibles);
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

    /**
     * Búsqueda flexible de vuelos con parámetros opcionales
     */
    public List<Map<String, Object>> buscarVuelosFlexible(Integer idOrigen, Integer idDestino, LocalDate fecha, Integer pasajeros) {
        List<InstanciaVuelo> instancias = instanciaVueloRepository.findAll();
        
        System.out.println("=== BÚSQUEDA FLEXIBLE DEBUG ===");
        System.out.println("Total instancias encontradas: " + instancias.size());
        System.out.println("Parámetros: origen=" + idOrigen + ", destino=" + idDestino + ", fecha=" + fecha + ", pasajeros=" + pasajeros);
        
        // Mostrar TODAS las instancias primero
        System.out.println("\n--- TODAS LAS INSTANCIAS ---");
        instancias.forEach(iv -> {
            System.out.println("ID: " + iv.getIdInstanciaVuelo() + 
                             ", Vuelo: " + (iv.getVuelo() != null ? iv.getVuelo().getNumeroVuelo() : "NULL") + 
                             ", Estado: " + iv.getEstadoVuelo() + 
                             ", Fecha: " + iv.getFechaSalida());
            if (iv.getVuelo() != null && iv.getVuelo().getRuta() != null) {
                System.out.println("  Origen: " + iv.getVuelo().getRuta().getOrigen().getIdAeropuerto() + 
                                 ", Destino: " + iv.getVuelo().getRuta().getDestino().getIdAeropuerto());
            }
        });
        
        List<InstanciaVuelo> programados = instancias.stream()
                .filter(iv -> {
                    boolean tieneVuelo = iv.getVuelo() != null && iv.getVuelo().getRuta() != null;
                    boolean esProgramado = "PROGRAMADO".equals(iv.getEstadoVuelo());
                    System.out.println("Vuelo " + (iv.getVuelo() != null ? iv.getVuelo().getNumeroVuelo() : "NULL") + 
                                     ": tieneVuelo=" + tieneVuelo + ", esProgramado=" + esProgramado);
                    return tieneVuelo && esProgramado;
                })
                .collect(Collectors.toList());
        
        System.out.println("\n--- VUELOS PROGRAMADOS: " + programados.size() + " ---");
        programados.forEach(iv -> {
            System.out.println("- Vuelo: " + iv.getVuelo().getNumeroVuelo() + 
                             ", Estado: " + iv.getEstadoVuelo() + 
                             ", Fecha: " + iv.getFechaSalida() +
                             ", Origen: " + iv.getVuelo().getRuta().getOrigen().getIdAeropuerto() +
                             ", Destino: " + iv.getVuelo().getRuta().getDestino().getIdAeropuerto());
        });
        
        List<InstanciaVuelo> filtradosPorCriterios = programados.stream()
                // Filtrar por origen si se especifica
                .filter(iv -> {
                    boolean cumple = idOrigen == null || iv.getVuelo().getRuta().getOrigen().getIdAeropuerto().equals(idOrigen);
                    if (idOrigen != null) {
                        System.out.println("Filtro origen - Vuelo " + iv.getVuelo().getNumeroVuelo() + ": " + 
                                         iv.getVuelo().getRuta().getOrigen().getIdAeropuerto() + " == " + idOrigen + " = " + cumple);
                    }
                    return cumple;
                })
                // Filtrar por destino si se especifica
                .filter(iv -> {
                    boolean cumple = idDestino == null || iv.getVuelo().getRuta().getDestino().getIdAeropuerto().equals(idDestino);
                    if (idDestino != null) {
                        System.out.println("Filtro destino - Vuelo " + iv.getVuelo().getNumeroVuelo() + ": " + 
                                         iv.getVuelo().getRuta().getDestino().getIdAeropuerto() + " == " + idDestino + " = " + cumple);
                    }
                    return cumple;
                })
                // Filtrar por fecha si se especifica
                .filter(iv -> {
                    boolean cumple = fecha == null || (iv.getFechaSalida() != null && iv.getFechaSalida().toLocalDate().equals(fecha));
                    if (fecha != null) {
                        System.out.println("Filtro fecha - Vuelo " + iv.getVuelo().getNumeroVuelo() + ": " + 
                                         (iv.getFechaSalida() != null ? iv.getFechaSalida().toLocalDate() : "NULL") + " == " + fecha + " = " + cumple);
                    }
                    return cumple;
                })
                .collect(Collectors.toList());
        
        System.out.println("\n--- DESPUÉS DE FILTROS: " + filtradosPorCriterios.size() + " ---");
        
        return filtradosPorCriterios.stream()
                .map(iv -> {
                    Map<String, Object> vueloInfo = new HashMap<>();
                    int asientosDisponibles = contarAsientosDisponibles(iv.getIdInstanciaVuelo());
                    
                    vueloInfo.put("idInstanciaVuelo", iv.getIdInstanciaVuelo());
                    vueloInfo.put("numeroVuelo", iv.getVuelo().getNumeroVuelo());
                    vueloInfo.put("fechaSalida", iv.getFechaSalida());
                    vueloInfo.put("fechaLlegada", iv.getFechaLlegada());
                    vueloInfo.put("duracion", iv.getVuelo().getDuracion());
                    vueloInfo.put("origen", iv.getVuelo().getRuta().getOrigen().getNombre());
                    vueloInfo.put("destino", iv.getVuelo().getRuta().getDestino().getNombre());
                    vueloInfo.put("codigoOrigen", iv.getVuelo().getRuta().getOrigen().getCodigoIATA());
                    vueloInfo.put("codigoDestino", iv.getVuelo().getRuta().getDestino().getCodigoIATA());
                    vueloInfo.put("asientosDisponibles", asientosDisponibles);
                    vueloInfo.put("capacidad", iv.getAvion().getCapacidad());
                    
                    System.out.println("Vuelo " + iv.getVuelo().getNumeroVuelo() + ": " + asientosDisponibles + "/" + iv.getAvion().getCapacidad() + " asientos disponibles");
                    
                    return vueloInfo;
                })
                .filter(v -> {
                    int disponibles = (Integer) v.get("asientosDisponibles");
                    boolean cumple = disponibles >= pasajeros;
                    System.out.println("Vuelo " + v.get("numeroVuelo") + ": " + disponibles + " >= " + pasajeros + " = " + cumple);
                    return cumple;
                })
                .sorted((v1, v2) -> {
                    // Ordenar por fecha de salida
                    LocalDateTime fecha1 = (LocalDateTime) v1.get("fechaSalida");
                    LocalDateTime fecha2 = (LocalDateTime) v2.get("fechaSalida");
                    if (fecha1 != null && fecha2 != null) {
                        return fecha1.compareTo(fecha2);
                    }
                    return 0;
                })
                .collect(Collectors.toList());
    }
}
