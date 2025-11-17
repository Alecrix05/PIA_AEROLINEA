package com.aerolinea.model;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "Venta_Impuesto")
public class VentaImpuesto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_venta_impuesto")
    private Integer idVentaImpuesto;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_detalle", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "venta", "boleto"})
    private VentaDetalle detalle;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_impuesto", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Impuesto impuesto;

    @Column(name = "monto_impuesto", nullable = false)
    private BigDecimal montoImpuesto;

    public VentaImpuesto() {}

    public Integer getIdVentaImpuesto() {
        return idVentaImpuesto;
    }

    public void setIdVentaImpuesto(Integer idVentaImpuesto) {
        this.idVentaImpuesto = idVentaImpuesto;
    }

    public VentaDetalle getDetalle() {
        return detalle;
    }

    public void setDetalle(VentaDetalle detalle) {
        this.detalle = detalle;
    }

    public Impuesto getImpuesto() {
        return impuesto;
    }

    public void setImpuesto(Impuesto impuesto) {
        this.impuesto = impuesto;
    }

    public BigDecimal getMontoImpuesto() {
        return montoImpuesto;
    }

    public void setMontoImpuesto(BigDecimal montoImpuesto) {
        this.montoImpuesto = montoImpuesto;
    }
}
