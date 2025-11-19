package com.aerolinea.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Impuesto")
public class Impuesto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_impuesto")
    private Integer idImpuesto;

    @NotBlank(message = "El nombre del impuesto es requerido")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", message = "El nombre solo puede contener letras y espacios")
    @Column(name = "nombre", length = 100)
    private String nombre;

    @NotNull(message = "El porcentaje es requerido")
    @DecimalMin(value = "0.00", message = "El porcentaje mínimo es 0%")
    @DecimalMax(value = "100.00", message = "El porcentaje máximo es 100%")
    @Column(name = "porcentaje", precision = 5, scale = 2, nullable = false)
    private BigDecimal porcentaje;

    @Size(max = 255, message = "La descripción no puede exceder 255 caracteres")
    @Column(name = "descripcion", length = 255)
    private String descripcion;

    public Impuesto() {}

    public Integer getIdImpuesto() {
        return idImpuesto;
    }

    public void setIdImpuesto(Integer idImpuesto) {
        this.idImpuesto = idImpuesto;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public BigDecimal getPorcentaje() {
        return porcentaje;
    }

    public void setPorcentaje(BigDecimal porcentaje) {
        this.porcentaje = porcentaje;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
