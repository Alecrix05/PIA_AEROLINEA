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
    @Pattern(regexp = "^[A-Z]{2}[0-9]{3,4}$", message = "El número de vuelo debe tener formato: 2 letras seguidas de 3-4 números (ej: AM101)")
    @Column(name = "numero_vuelo", length = 20)
    private String numeroVuelo;

    @NotBlank(message = "La duración es requerida")
    @Pattern(regexp = "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", message = "La duración debe tener formato HH:MM:SS")
    @Column(name = "duracion")
    private String duracion; // Se guardará en formato HH:MM:SS

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_ruta")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
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
