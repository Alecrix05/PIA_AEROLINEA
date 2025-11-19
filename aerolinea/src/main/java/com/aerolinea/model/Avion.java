package com.aerolinea.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "Avion")
public class Avion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_avion")
    private Integer idAvion;

    @NotBlank(message = "La matrícula es requerida")
    @Pattern(regexp = "^[A-Z]{2}-[A-Z]{3}$", message = "La matrícula debe tener formato XX-XXX (ej: XA-ABC)")
    @Column(name = "matricula", length = 20)
    private String matricula;

    @NotBlank(message = "El modelo es requerido")
    @Size(min = 3, max = 50, message = "El modelo debe tener entre 3 y 50 caracteres")
    @Column(name = "modelo", length = 50)
    private String modelo;

    @NotNull(message = "La capacidad es requerida")
    @Min(value = 50, message = "La capacidad mínima es 50 pasajeros")
    @Max(value = 850, message = "La capacidad máxima es 850 pasajeros")
    @Column(name = "capacidad")
    private Integer capacidad;

    @NotBlank(message = "El estado operativo es requerido")
    @Pattern(regexp = "^(ACTIVO|MANTENIMIENTO|INACTIVO)$", message = "Estado válido: ACTIVO, MANTENIMIENTO, INACTIVO")
    @Column(name = "estado_operativo", length = 30)
    private String estadoOperativo;

    public Avion() {}

    public Integer getIdAvion() {
        return idAvion;
    }

    public void setIdAvion(Integer idAvion) {
        this.idAvion = idAvion;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public Integer getCapacidad() {
        return capacidad;
    }

    public void setCapacidad(Integer capacidad) {
        this.capacidad = capacidad;
    }

    public String getEstadoOperativo() {
        return estadoOperativo;
    }

    public void setEstadoOperativo(String estadoOperativo) {
        this.estadoOperativo = estadoOperativo;
    }
}
