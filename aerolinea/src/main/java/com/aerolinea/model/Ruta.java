package com.aerolinea.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "Ruta")
public class Ruta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ruta")
    private Integer idRuta;

    @NotNull(message = "La distancia es requerida")
    @DecimalMin(value = "0.0", message = "La distancia debe ser mayor o igual a 0")
    @Column(name = "distancia")
    private Double distancia;

    @ManyToOne
    @JoinColumn(name = "id_origen")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "ciudad"})
    private Aeropuerto origen;

    @ManyToOne
    @JoinColumn(name = "id_destino")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "ciudad"})
    private Aeropuerto destino;

    // Getters y Setters
    public Integer getIdRuta() {
        return idRuta;
    }

    public void setIdRuta(Integer idRuta) {
        this.idRuta = idRuta;
    }

    public Double getDistancia() {
        return distancia;
    }

    public void setDistancia(Double distancia) {
        this.distancia = distancia;
    }

    public Aeropuerto getOrigen() {
        return origen;
    }

    public void setOrigen(Aeropuerto origen) {
        this.origen = origen;
    }

    public Aeropuerto getDestino() {
        return destino;
    }

    public void setDestino(Aeropuerto destino) {
        this.destino = destino;
    }
}
