package com.aerolinea.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.math.BigDecimal; 

@Entity
@Table(name = "Venta_Encabezado")
public class VentaEncabezado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_venta")
    private Integer idVenta;

    @NotNull(message = "La fecha de venta es requerida")
    @Column(name = "fecha_venta")
    private LocalDate fechaVenta;

    @NotBlank(message = "La forma de pago es requerida")
    @Column(name = "forma_pago", length = 30)
    private String formaPago;

    @Column(name = "canal_venta", length = 30)
    private String canalVenta;

    @NotNull(message = "El total es requerido")
    @DecimalMin(value = "0.0", message = "El total debe ser mayor o igual a 0")
    @Column(name = "total", precision = 10, scale = 2)
    private BigDecimal total;

    @Column(name = "estado_venta", length = 30)
    private String estadoVenta;

    @ManyToOne
    @JoinColumn(name = "id_cliente")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Cliente cliente;

    public VentaEncabezado() {}

    // Getters y setters
    public Integer getIdVenta() { return idVenta; }
    public void setIdVenta(Integer idVenta) { this.idVenta = idVenta; }

    public LocalDate getFechaVenta() { return fechaVenta; }
    public void setFechaVenta(LocalDate fechaVenta) { this.fechaVenta = fechaVenta; }

    public String getFormaPago() { return formaPago; }
    public void setFormaPago(String formaPago) { this.formaPago = formaPago; }

    public String getCanalVenta() { return canalVenta; }
    public void setCanalVenta(String canalVenta) { this.canalVenta = canalVenta; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public String getEstadoVenta() { return estadoVenta; }
    public void setEstadoVenta(String estadoVenta) { this.estadoVenta = estadoVenta; }

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
}
