package com.aerolinea.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "Vuelo")
public class Vuelo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_vuelo")
    private Integer idVuelo;

    @NotBlank(message = "El número de vuelo es requerido")
    @Column(name = "numero_vuelo", length = 20)
    private String numeroVuelo;

    @Column(name = "duracion")
    private String duracion; // Se guardará en formato HH:MM:SS

    @ManyToOne
    @JoinColumn(name = "id_ruta")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "origen", "destino"})
    private Ruta ruta;

    // Getters y Setters
    public Integer getIdVuelo() {
        return idVuelo;
    }

    public void setIdVuelo(Integer idVuelo) {
        this.idVuelo = idVuelo;
    }

    public String getNumeroVuelo() {
        return numeroVuelo;
    }

    public void setNumeroVuelo(String numeroVuelo) {
        this.numeroVuelo = numeroVuelo;
    }

    public String getDuracion() {
        return duracion;
    }

    public void setDuracion(String duracion) {
        this.duracion = duracion;
    }

    public Ruta getRuta() {
        return ruta;
    }

    public void setRuta(Ruta ruta) {
        this.ruta = ruta;
    }
}
