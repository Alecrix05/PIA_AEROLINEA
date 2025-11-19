package com.aerolinea.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "Aeropuerto")
public class Aeropuerto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_aeropuerto")
    private Integer idAeropuerto;

    @NotBlank(message = "El nombre del aeropuerto es requerido")
    @Size(min = 5, max = 100, message = "El nombre debe tener entre 5 y 100 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", message = "El nombre solo puede contener letras y espacios")
    @Column(name = "nombre", length = 100)
    private String nombre;

    @NotBlank(message = "El código IATA es requerido")
    @Pattern(regexp = "^[A-Z]{3}$", message = "El código IATA debe tener exactamente 3 letras mayúsculas (sin espacios)")
    @Size(min = 3, max = 3, message = "El código IATA debe tener exactamente 3 caracteres")
    @Column(name = "codigo_IATA", length = 10)
    private String codigoIATA;

    @ManyToOne
    @JoinColumn(name = "id_ciudad")
    private Ciudad ciudad;

    public Aeropuerto() {}

    public Integer getIdAeropuerto() {
        return idAeropuerto;
    }

    public void setIdAeropuerto(Integer idAeropuerto) {
        this.idAeropuerto = idAeropuerto;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCodigoIATA() {
        return codigoIATA;
    }

    public void setCodigoIATA(String codigoIATA) {
        this.codigoIATA = codigoIATA;
    }

    public Ciudad getCiudad() {
        return ciudad;
    }

    public void setCiudad(Ciudad ciudad) {
        this.ciudad = ciudad;
    }
}
