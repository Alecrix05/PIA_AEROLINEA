package com.aerolinea.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO para representar un ticket de venta completo con toda la información necesaria
 */
public class TicketVentaDTO {
    
    // Información de la venta
    private Integer idVenta;
    private LocalDate fechaVenta;
    private String formaPago;
    private String canalVenta;
    private BigDecimal total;
    private String estadoVenta;
    
    // Información del cliente
    private ClienteInfo cliente;
    
    // Detalles de la venta (boletos)
    private List<DetalleInfo> detalles;
    
    // Subtotales
    private BigDecimal subtotalSinImpuestos;
    private BigDecimal totalImpuestos;
    
    // Constructors
    public TicketVentaDTO() {}
    
    // Inner classes para estructurar la información
    public static class ClienteInfo {
        private String nombreCompleto;
        private String correo;
        private String telefono;
        private String direccion;
        
        public ClienteInfo() {}
        
        public ClienteInfo(String nombreCompleto, String correo, String telefono, String direccion) {
            this.nombreCompleto = nombreCompleto;
            this.correo = correo;
            this.telefono = telefono;
            this.direccion = direccion;
        }
        
        // Getters y Setters
        public String getNombreCompleto() { return nombreCompleto; }
        public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }
        
        public String getCorreo() { return correo; }
        public void setCorreo(String correo) { this.correo = correo; }
        
        public String getTelefono() { return telefono; }
        public void setTelefono(String telefono) { this.telefono = telefono; }
        
        public String getDireccion() { return direccion; }
        public void setDireccion(String direccion) { this.direccion = direccion; }
    }
    
    public static class DetalleInfo {
        private String numeroBoleto;
        private String pasajero;
        private VueloInfo vuelo;
        private String asiento;
        private String clase;
        private BigDecimal precioUnitario;
        private BigDecimal impuestos;
        private BigDecimal subtotal;
        
        public DetalleInfo() {}
        
        // Getters y Setters
        public String getNumeroBoleto() { return numeroBoleto; }
        public void setNumeroBoleto(String numeroBoleto) { this.numeroBoleto = numeroBoleto; }
        
        public String getPasajero() { return pasajero; }
        public void setPasajero(String pasajero) { this.pasajero = pasajero; }
        
        public VueloInfo getVuelo() { return vuelo; }
        public void setVuelo(VueloInfo vuelo) { this.vuelo = vuelo; }
        
        public String getAsiento() { return asiento; }
        public void setAsiento(String asiento) { this.asiento = asiento; }
        
        public String getClase() { return clase; }
        public void setClase(String clase) { this.clase = clase; }
        
        public BigDecimal getPrecioUnitario() { return precioUnitario; }
        public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }
        
        public BigDecimal getImpuestos() { return impuestos; }
        public void setImpuestos(BigDecimal impuestos) { this.impuestos = impuestos; }
        
        public BigDecimal getSubtotal() { return subtotal; }
        public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    }
    
    public static class VueloInfo {
        private String numeroVuelo;
        private String origen;
        private String destino;
        private String fechaSalida;
        private String fechaLlegada;
        private String duracion;
        
        public VueloInfo() {}
        
        // Getters y Setters
        public String getNumeroVuelo() { return numeroVuelo; }
        public void setNumeroVuelo(String numeroVuelo) { this.numeroVuelo = numeroVuelo; }
        
        public String getOrigen() { return origen; }
        public void setOrigen(String origen) { this.origen = origen; }
        
        public String getDestino() { return destino; }
        public void setDestino(String destino) { this.destino = destino; }
        
        public String getFechaSalida() { return fechaSalida; }
        public void setFechaSalida(String fechaSalida) { this.fechaSalida = fechaSalida; }
        
        public String getFechaLlegada() { return fechaLlegada; }
        public void setFechaLlegada(String fechaLlegada) { this.fechaLlegada = fechaLlegada; }
        
        public String getDuracion() { return duracion; }
        public void setDuracion(String duracion) { this.duracion = duracion; }
    }
    
    // Getters y Setters principales
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
    
    public ClienteInfo getCliente() { return cliente; }
    public void setCliente(ClienteInfo cliente) { this.cliente = cliente; }
    
    public List<DetalleInfo> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleInfo> detalles) { this.detalles = detalles; }
    
    public BigDecimal getSubtotalSinImpuestos() { return subtotalSinImpuestos; }
    public void setSubtotalSinImpuestos(BigDecimal subtotalSinImpuestos) { this.subtotalSinImpuestos = subtotalSinImpuestos; }
    
    public BigDecimal getTotalImpuestos() { return totalImpuestos; }
    public void setTotalImpuestos(BigDecimal totalImpuestos) { this.totalImpuestos = totalImpuestos; }
}
