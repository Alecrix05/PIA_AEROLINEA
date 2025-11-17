package com.aerolinea.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Instancia_Vuelo")
public class InstanciaVuelo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_instancia_vuelo")
    private Integer idInstanciaVuelo;

    @NotNull(message = "La fecha de salida es requerida")
    @Column(name = "fecha_salida")
    private LocalDateTime fechaSalida;

    @NotNull(message = "La fecha de llegada es requerida")
    @Column(name = "fecha_llegada")
    private LocalDateTime fechaLlegada;

    @NotBlank(message = "El estado del vuelo es requerido")
    @Column(name = "estado_vuelo", length = 30)
    private String estadoVuelo;

    @ManyToOne
    @JoinColumn(name = "id_vuelo")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "ruta"})
    private Vuelo vuelo;

    @ManyToOne
    @JoinColumn(name = "id_avion")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Avion avion;

    @ManyToOne
    @JoinColumn(name = "id_tripulacion")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "piloto", "copiloto"})
    private Tripulacion tripulacion;

    @PrePersist
    @PreUpdate
    private void validarFechas() {
        if (fechaSalida != null && fechaLlegada != null) {
            if (fechaLlegada.isBefore(fechaSalida) || fechaLlegada.isEqual(fechaSalida)) {
                throw new IllegalArgumentException("La fecha de llegada debe ser posterior a la fecha de salida");
            }
        }
    }

    // Getters y Setters
    public Integer getIdInstanciaVuelo() {
        return idInstanciaVuelo;
    }

    public void setIdInstanciaVuelo(Integer idInstanciaVuelo) {
        this.idInstanciaVuelo = idInstanciaVuelo;
    }

    public LocalDateTime getFechaSalida() {
        return fechaSalida;
    }

    public void setFechaSalida(LocalDateTime fechaSalida) {
        this.fechaSalida = fechaSalida;
    }

    public LocalDateTime getFechaLlegada() {
        return fechaLlegada;
    }

    public void setFechaLlegada(LocalDateTime fechaLlegada) {
        this.fechaLlegada = fechaLlegada;
    }

    public String getEstadoVuelo() {
        return estadoVuelo;
    }

    public void setEstadoVuelo(String estadoVuelo) {
        this.estadoVuelo = estadoVuelo;
    }

    public Vuelo getVuelo() {
        return vuelo;
    }

    public void setVuelo(Vuelo vuelo) {
        this.vuelo = vuelo;
    }

    public Avion getAvion() {
        return avion;
    }

    public void setAvion(Avion avion) {
        this.avion = avion;
    }

    public Tripulacion getTripulacion() {
        return tripulacion;
    }

    public void setTripulacion(Tripulacion tripulacion) {
        this.tripulacion = tripulacion;
    }
}
