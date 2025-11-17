package com.aerolinea.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class CodigoGeneratorService {

    private final AtomicLong contadorBoleto = new AtomicLong(1);
    private final AtomicLong contadorReserva = new AtomicLong(1);

    /**
     * Genera código único para boleto
     * Formato: BLT-YYYYMMDDHHMMSS-NNNNNN
     * Incluye timestamp completo para evitar duplicados
     */
    public synchronized String generarCodigoBoleto() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        long numero = contadorBoleto.getAndIncrement();
        return String.format("BLT-%s-%06d", timestamp, numero);
    }

    /**
     * Genera código único para reserva
     * Formato: RES-YYYYMMDDHHMMSS-NNNNNN
     * Incluye timestamp completo para evitar duplicados
     */
    public synchronized String generarCodigoReserva() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        long numero = contadorReserva.getAndIncrement();
        return String.format("RES-%s-%06d", timestamp, numero);
    }

    /**
     * Genera código alfanumérico aleatorio
     * Útil para confirmaciones
     */
    public String generarCodigoAlfanumerico(int longitud) {
        String caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder codigo = new StringBuilder();
        for (int i = 0; i < longitud; i++) {
            int index = (int) (Math.random() * caracteres.length());
            codigo.append(caracteres.charAt(index));
        }
        return codigo.toString();
    }
}
