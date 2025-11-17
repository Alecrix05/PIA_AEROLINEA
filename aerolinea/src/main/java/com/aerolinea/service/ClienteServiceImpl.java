package com.aerolinea.service;

import com.aerolinea.model.Cliente;
import com.aerolinea.repository.ClienteRepository;
import com.aerolinea.repository.ReservaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository repo;
    private final ReservaRepository reservaRepository;

    public ClienteServiceImpl(ClienteRepository repo, ReservaRepository reservaRepository) {
        this.repo = repo;
        this.reservaRepository = reservaRepository;
    }

    @Override
    public List<Cliente> listar() {
        return repo.findAll();
    }

    @Override
    public Cliente crear(Cliente cliente) throws IllegalArgumentException {
        if (cliente.getCorreo() != null && repo.existsByCorreo(cliente.getCorreo())) {
            throw new IllegalArgumentException("Correo ya registrado");
        }
        return repo.save(cliente);
    }

    @Override
    public Cliente obtener(Integer id) {
        Optional<Cliente> op = repo.findById(id);
        return op.orElse(null);
    }

    @Override
    public Cliente actualizar(Integer id, Cliente datos) throws IllegalArgumentException {
        Cliente c = obtener(id);
        if (c == null) return null;
        // si actualizan correo, verificar unicidad
        if (datos.getCorreo() != null && !datos.getCorreo().equals(c.getCorreo())) {
            if (repo.existsByCorreo(datos.getCorreo())) {
                throw new IllegalArgumentException("Correo ya registrado por otro cliente");
            }
            c.setCorreo(datos.getCorreo());
        }
        // actualizar demás campos
        if (datos.getNombre() != null) c.setNombre(datos.getNombre());
        if (datos.getApellidoP() != null) c.setApellidoP(datos.getApellidoP());
        if (datos.getApellidoM() != null) c.setApellidoM(datos.getApellidoM());
        if (datos.getTelefono() != null) c.setTelefono(datos.getTelefono());
        if (datos.getCalle() != null) c.setCalle(datos.getCalle());
        if (datos.getNumero() != null) c.setNumero(datos.getNumero());
        if (datos.getColonia() != null) c.setColonia(datos.getColonia());
        if (datos.getCiudad() != null) c.setCiudad(datos.getCiudad());
        if (datos.getEstado() != null) c.setEstado(datos.getEstado());
        if (datos.getCodigoPostal() != null) c.setCodigoPostal(datos.getCodigoPostal());

        return repo.save(c);
    }

    @Override
    public void eliminar(Integer id) {
        // Validar que no tenga reservas asociadas
        long cantidadReservas = reservaRepository.countByClienteId(id);
        if (cantidadReservas > 0) {
            throw new IllegalArgumentException(
                "No se puede eliminar el cliente. Tiene " + cantidadReservas + " reserva(s) asociada(s)."
            );
        }
        repo.deleteById(id);
    }
}
