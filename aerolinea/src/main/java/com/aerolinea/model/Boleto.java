package com.aerolinea.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
@Table(name = "Boleto")
public class Boleto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_boleto")
    private Integer idBoleto;

    @NotBlank(message = "El número de boleto es requerido")
    @Column(name = "numero_boleto", length = 30)
    private String numeroBoleto;

    @NotNull(message = "La fecha de emisión es requerida")
    @Column(name = "fecha_emision")
    private LocalDate fechaEmision;

    @NotNull(message = "El precio es requerido")
    @DecimalMin(value = "0.01", inclusive = true, message = "El precio debe ser mayor a 0")
    @Column(name = "precio", precision = 10, scale = 2)
    private BigDecimal precio;

    @NotBlank(message = "La clase es requerida")
    @Pattern(regexp = "^(Económica|Ejecutiva|Primera)$", message = "Clase válida: Económica, Ejecutiva, Primera")
    @Column(name = "clase", length = 20)
    private String clase;

    @Column(name = "estado", length = 20)
    private String estado;

    @ManyToOne
    @JoinColumn(name = "id_asiento")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "avion"})
    private Asiento asiento;

    @ManyToOne
    @JoinColumn(name = "id_tarifa")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Tarifa tarifa;

    @ManyToOne
    @JoinColumn(name = "id_pasajero")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "cliente"})
    private Pasajero pasajero;

    @ManyToOne
    @JoinColumn(name = "id_reserva")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "cliente"})
    private Reserva reserva;

    @ManyToOne
    @JoinColumn(name = "id_instancia_vuelo")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "vuelo", "avion", "tripulacion"})
    private InstanciaVuelo instanciaVuelo;

    public Boleto() {}

    // GETTERS Y SETTERS

    public Integer getIdBoleto() { return idBoleto; }
    public void setIdBoleto(Integer idBoleto) { this.idBoleto = idBoleto; }

    public String getNumeroBoleto() { return numeroBoleto; }
    public void setNumeroBoleto(String numeroBoleto) { this.numeroBoleto = numeroBoleto; }

    public LocalDate getFechaEmision() { return fechaEmision; }
    public void setFechaEmision(LocalDate fechaEmision) { this.fechaEmision = fechaEmision; }

    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }

    public String getClase() { return clase; }
    public void setClase(String clase) { this.clase = clase; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Asiento getAsiento() { return asiento; }
    public void setAsiento(Asiento asiento) { this.asiento = asiento; }

    public Tarifa getTarifa() { return tarifa; }
    public void setTarifa(Tarifa tarifa) { this.tarifa = tarifa; }

    public Pasajero getPasajero() { return pasajero; }
    public void setPasajero(Pasajero pasajero) { this.pasajero = pasajero; }

    public Reserva getReserva() { return reserva; }
    public void setReserva(Reserva reserva) { this.reserva = reserva; }

    public InstanciaVuelo getInstanciaVuelo() { return instanciaVuelo; }
    public void setInstanciaVuelo(InstanciaVuelo instanciaVuelo) { this.instanciaVuelo = instanciaVuelo; }
}
