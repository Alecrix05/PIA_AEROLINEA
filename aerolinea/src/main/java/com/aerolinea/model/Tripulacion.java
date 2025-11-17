package com.aerolinea.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "Tripulacion")
public class Tripulacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tripulacion")
    private Integer idTripulacion;

    @NotBlank(message = "El nombre de la tripulación es requerido")
    @Column(name = "nombre_tripulacion", length = 50)
    private String nombreTripulacion;

    @ManyToOne
    @JoinColumn(name = "id_piloto")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "departamento"})
    private Empleado piloto;

    @ManyToOne
    @JoinColumn(name = "id_copiloto")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "departamento"})
    private Empleado copiloto;

    // Getters y setters
    public Integer getIdTripulacion() {
        return idTripulacion;
    }

    public void setIdTripulacion(Integer idTripulacion) {
        this.idTripulacion = idTripulacion;
    }

    public String getNombreTripulacion() {
        return nombreTripulacion;
    }

    public void setNombreTripulacion(String nombreTripulacion) {
        this.nombreTripulacion = nombreTripulacion;
    }

    public Empleado getPiloto() {
        return piloto;
    }

    public void setPiloto(Empleado piloto) {
        this.piloto = piloto;
    }

    public Empleado getCopiloto() {
        return copiloto;
    }

    public void setCopiloto(Empleado copiloto) {
        this.copiloto = copiloto;
    }
}
