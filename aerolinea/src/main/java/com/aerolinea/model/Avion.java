package com.aerolinea.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Avion")
public class Avion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_avion")
    private Integer idAvion;

    @Column(name = "matricula", length = 20)
    private String matricula;

    @Column(name = "modelo", length = 50)
    private String modelo;

    @Column(name = "capacidad")
    private Integer capacidad;

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
