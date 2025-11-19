package com.aerolinea.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "Asiento")
public class Asiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_asiento")
    private Integer idAsiento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_avion", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Avion avion;

    @NotBlank(message = "El código de asiento es requerido")
    @Pattern(regexp = "^[1-9][0-9]?[A-Z]$", message = "El código debe tener formato: número + letra (ej: 12A)")
    @Column(name = "codigo_asiento", length = 10, nullable = false)
    private String codigoAsiento;

    @NotNull(message = "La fila es requerida")
    @Min(value = 1, message = "La fila debe ser mayor a 0")
    @Max(value = 99, message = "La fila no puede ser mayor a 99")
    @Column(name = "fila")
    private Short fila;

    @NotBlank(message = "La columna es requerida")
    @Pattern(regexp = "^[A-Z]$", message = "La columna debe ser una letra mayúscula")
    @Column(name = "columna", length = 5)
    private String columna;

    @NotBlank(message = "La clase es requerida")
    @Pattern(regexp = "^(Económica|Ejecutiva|Primera)$", message = "Clase válida: Económica, Ejecutiva, Primera")
    @Column(name = "clase", length = 30)
    private String clase;

    @Pattern(regexp = "^(Ventana|Pasillo|Centro)$", message = "Ubicación válida: Ventana, Pasillo, Centro")
    @Column(name = "ubicacion", length = 100)
    private String ubicacion;

    public Asiento() {}

    public Integer getIdAsiento() { return idAsiento; }
    public void setIdAsiento(Integer idAsiento) { this.idAsiento = idAsiento; }

    public Avion getAvion() { return avion; }
    public void setAvion(Avion avion) { this.avion = avion; }

    public String getCodigoAsiento() { return codigoAsiento; }
    public void setCodigoAsiento(String codigoAsiento) { this.codigoAsiento = codigoAsiento; }

    public Short getFila() { return fila; }
    public void setFila(Short fila) { this.fila = fila; }

    public String getColumna() { return columna; }
    public void setColumna(String columna) { this.columna = columna; }

    public String getClase() { return clase; }
    public void setClase(String clase) { this.clase = clase; }

    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }
}
