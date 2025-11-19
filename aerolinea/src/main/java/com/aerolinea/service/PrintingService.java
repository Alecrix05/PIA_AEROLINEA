package com.aerolinea.service;

import com.aerolinea.model.*;
import com.aerolinea.repository.*;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PrintingService {

    private final VentaEncabezadoRepository ventaRepository;
    private final BoletoRepository boletoRepository;
    private final VentaDetalleRepository ventaDetalleRepository;

    public PrintingService(VentaEncabezadoRepository ventaRepository, 
                          BoletoRepository boletoRepository,
                          VentaDetalleRepository ventaDetalleRepository) {
        this.ventaRepository = ventaRepository;
        this.boletoRepository = boletoRepository;
        this.ventaDetalleRepository = ventaDetalleRepository;
    }

    public byte[] generarTicketVenta(Integer idVenta) {
        VentaEncabezado venta = ventaRepository.findById(idVenta)
            .orElseThrow(() -> new RuntimeException("Venta no encontrada"));
        
        List<VentaDetalle> detalles = ventaDetalleRepository.findByVenta_IdVenta(idVenta);
        
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            
            // Encabezado
            document.add(new Paragraph("AEROLINEA CARRILLO")
                .setFontSize(18)
                .setBold());
            
            document.add(new Paragraph("TICKET DE COMPRA")
                .setFontSize(14)
                .setBold());
            
            document.add(new Paragraph("═══════════════════════════════════════"));
            
            // Información de la venta
            document.add(new Paragraph("FOLIO: " + venta.getIdVenta()));
            document.add(new Paragraph("FECHA: " + venta.getFechaVenta().format(dtf)));
            document.add(new Paragraph("CLIENTE: " + venta.getCliente().getNombre() + " " + 
                venta.getCliente().getApellidoP()));
            
            // Obtener código de reserva del primer boleto
            String codigoReserva = "N/A";
            if (!detalles.isEmpty()) {
                Boleto primerBoleto = detalles.get(0).getBoleto();
                if (primerBoleto != null && primerBoleto.getReserva() != null) {
                    codigoReserva = primerBoleto.getReserva().getCodigoReserva();
                }
            }
            document.add(new Paragraph("RESERVA: " + codigoReserva));
            
            document.add(new Paragraph("───────────────────────────────────────"));
            
            // Tabla de boletos
            Table table = new Table(4);
            table.addHeaderCell("BOLETO");
            table.addHeaderCell("PASAJERO");
            table.addHeaderCell("ASIENTO");
            table.addHeaderCell("PRECIO");
            
            BigDecimal total = BigDecimal.ZERO;
            for (VentaDetalle detalle : detalles) {
                table.addCell(detalle.getBoleto().getNumeroBoleto());
                table.addCell(detalle.getBoleto().getPasajero().getNombre() + " " + 
                    detalle.getBoleto().getPasajero().getApellidoP());
                table.addCell(detalle.getBoleto().getAsiento() != null ? 
                    detalle.getBoleto().getAsiento().getCodigoAsiento() : "N/A");
                
                // Usar precio del boleto directamente
                BigDecimal precioBoleto = detalle.getBoleto().getPrecio();
                BigDecimal subtotalConIva = precioBoleto.multiply(new BigDecimal("1.16"));
                
                table.addCell("$" + precioBoleto.toString());
                total = total.add(subtotalConIva);
            }
            
            document.add(table);
            
            document.add(new Paragraph("───────────────────────────────────────"));
            BigDecimal subtotal = total.divide(new BigDecimal("1.16"), 2, BigDecimal.ROUND_HALF_UP);
            BigDecimal iva = total.subtract(subtotal);
            document.add(new Paragraph("SUBTOTAL: $" + subtotal.toString()));
            document.add(new Paragraph("IVA (16%): $" + iva.toString()));
            document.add(new Paragraph("TOTAL: $" + total.toString()).setBold());
            
            document.add(new Paragraph("═══════════════════════════════════════"));
            document.add(new Paragraph("¡Gracias por volar con nosotros!"));
            
            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generando ticket: " + e.getMessage());
        }
    }

    public byte[] generarPaseAbordar(Integer idBoleto) {
        Boleto boleto = boletoRepository.findById(idBoleto)
            .orElseThrow(() -> new RuntimeException("Boleto no encontrado"));
        
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            
            DateTimeFormatter sdf = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            DateTimeFormatter stf = DateTimeFormatter.ofPattern("HH:mm");
            
            // Encabezado
            document.add(new Paragraph("AEROLINEA CARRILLO")
                .setFontSize(16)
                .setBold());
            
            document.add(new Paragraph("PASE DE ABORDAR")
                .setFontSize(14)
                .setBold());
            
            document.add(new Paragraph("═══════════════════════════════════════"));
            
            // Información del vuelo
            InstanciaVuelo instancia = boleto.getInstanciaVuelo();
            if (instancia == null) {
                throw new RuntimeException("No se encontró información del vuelo para el boleto");
            }
            Vuelo vuelo = instancia.getVuelo();
            if (vuelo == null) {
                throw new RuntimeException("No se encontró información del vuelo");
            }
            Ruta ruta = vuelo.getRuta();
            if (ruta == null) {
                throw new RuntimeException("No se encontró información de la ruta");
            }
            
            document.add(new Paragraph("VUELO: " + vuelo.getNumeroVuelo()).setBold());
            document.add(new Paragraph("FECHA: " + instancia.getFechaSalida().format(sdf)));
            document.add(new Paragraph("SALIDA: " + instancia.getFechaSalida().format(stf)));
            document.add(new Paragraph("LLEGADA: " + instancia.getFechaLlegada().format(stf)));
            
            document.add(new Paragraph("───────────────────────────────────────"));
            
            // Información del pasajero
            document.add(new Paragraph("PASAJERO: " + boleto.getPasajero().getNombre() + " " + 
                boleto.getPasajero().getApellidoP() + " " + 
                (boleto.getPasajero().getApellidoM() != null ? boleto.getPasajero().getApellidoM() : ""))
                .setBold());
            
            document.add(new Paragraph("ASIENTO: " + 
                (boleto.getAsiento() != null ? boleto.getAsiento().getCodigoAsiento() : "Por asignar")).setBold());
            document.add(new Paragraph("CLASE: " + boleto.getClase()));
            document.add(new Paragraph("BOLETO: " + boleto.getNumeroBoleto()));
            
            document.add(new Paragraph("───────────────────────────────────────"));
            
            // Información de aeropuertos
            document.add(new Paragraph("ORIGEN: " + ruta.getOrigen().getNombre()));
            document.add(new Paragraph("CÓDIGO: " + ruta.getOrigen().getCodigoIATA()));
            document.add(new Paragraph("DESTINO: " + ruta.getDestino().getNombre()));
            document.add(new Paragraph("CÓDIGO: " + ruta.getDestino().getCodigoIATA()));
            
            document.add(new Paragraph("═══════════════════════════════════════"));
            
            document.add(new Paragraph("IMPORTANTE:")
                .setBold());
            document.add(new Paragraph("• Presentarse 2 horas antes del vuelo"));
            document.add(new Paragraph("• Llevar identificación oficial"));
            document.add(new Paragraph("• Revisar restricciones de equipaje"));
            
            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generando pase de abordar: " + e.getMessage());
        }
    }
}