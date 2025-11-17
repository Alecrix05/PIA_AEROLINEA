package com.aerolinea.service;

import com.aerolinea.model.Cliente;
import java.util.List;

public interface ClienteService {
    List<Cliente> listar();
    Cliente crear(Cliente cliente) throws IllegalArgumentException;
    Cliente obtener(Integer id);
    Cliente actualizar(Integer id, Cliente datos) throws IllegalArgumentException;
    void eliminar(Integer id);
}
