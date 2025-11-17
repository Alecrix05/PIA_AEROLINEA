package com.aerolinea.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
@Table(name = "Pago")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago")
    private Integer idPago;

    @NotBlank(message = "El método de pago es requerido")
    @Column(name = "metodo_pago", length = 30)
    private String metodoPago;

    @NotNull(message = "El monto es requerido")
    @DecimalMin(value = "0.0", message = "El monto debe ser mayor o igual a 0")
    @Column(name = "monto", precision = 10, scale = 2)
    private BigDecimal monto;

    @NotNull(message = "La fecha de pago es requerida")
    @Column(name = "fecha_pago")
    private LocalDate fechaPago;

    @Column(name = "estatus", length = 20)
    private String estatus;

    @ManyToOne
    @JoinColumn(name = "id_metodo_pago")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private MetodoPago metodoPagoObj;

    @ManyToOne
    @JoinColumn(name = "id_venta")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "cliente"})
    private VentaEncabezado venta;

    public Pago() {}

    public Integer getIdPago() { return idPago; }
    public void setIdPago(Integer idPago) { this.idPago = idPago; }

    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }

    public BigDecimal getMonto() { return monto; }
    public void setMonto(BigDecimal monto) { this.monto = monto; }

    public LocalDate getFechaPago() { return fechaPago; }
    public void setFechaPago(LocalDate fechaPago) { this.fechaPago = fechaPago; }

    public String getEstatus() { return estatus; }
    public void setEstatus(String estatus) { this.estatus = estatus; }

    public MetodoPago getMetodoPagoObj() { return metodoPagoObj; }
    public void setMetodoPagoObj(MetodoPago metodoPagoObj) { this.metodoPagoObj = metodoPagoObj; }

    public VentaEncabezado getVenta() { return venta; }
    public void setVenta(VentaEncabezado venta) { this.venta = venta; }
}
