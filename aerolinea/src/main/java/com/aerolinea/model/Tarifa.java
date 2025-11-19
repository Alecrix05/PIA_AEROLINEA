package com.aerolinea.model;

import java.math.BigDecimal;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "Tarifa")
public class Tarifa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tarifa")
    private Integer idTarifa;

    @NotBlank(message = "El nombre de la tarifa es requerido")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    @Column(name = "nombre", length = 100)
    private String nombre;

    @NotBlank(message = "La clase es requerida")
    @Pattern(regexp = "^(Económica|Ejecutiva|Primera)$", message = "Clase válida: Económica, Ejecutiva, Primera")
    @Column(name = "clase", length = 20)
    private String clase;  // Económica, Ejecutiva, Primera

    @NotNull(message = "El precio base es requerido")
    @DecimalMin(value = "100.00", message = "El precio mínimo es $100.00")
    @DecimalMax(value = "50000.00", message = "El precio máximo es $50,000.00")
    @Column(name = "precio_base", nullable = false)
    private BigDecimal precioBase;

    @Size(max = 255, message = "La descripción no puede exceder 255 caracteres")
    @Column(name = "descripcion", length = 255)
    private String descripcion;

    @NotNull(message = "El estado activo es requerido")
    @Column(name = "activo")
    private Boolean activo;

    public Tarifa() {}

    public Integer getIdTarifa() { return idTarifa; }
    public void setIdTarifa(Integer idTarifa) { this.idTarifa = idTarifa; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getClase() { return clase; }
    public void setClase(String clase) { this.clase = clase; }

    public BigDecimal getPrecioBase() { return precioBase; }
    public void setPrecioBase(BigDecimal precioBase) { this.precioBase = precioBase; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
}
