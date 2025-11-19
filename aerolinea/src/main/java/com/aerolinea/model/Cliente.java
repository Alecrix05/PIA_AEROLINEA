package com.aerolinea.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "Cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Integer idCliente;

    @NotBlank(message = "El nombre es requerido")
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", message = "El nombre solo puede contener letras y espacios")
    @Column(name = "nombre", length = 50)
    private String nombre;

    @NotBlank(message = "El apellido paterno es requerido")
    @Size(min = 2, max = 50, message = "El apellido paterno debe tener entre 2 y 50 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", message = "El apellido paterno solo puede contener letras y espacios")
    @Column(name = "apellido_p", length = 50)
    private String apellidoP;

    @Size(max = 50, message = "El apellido materno no puede exceder 50 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$", message = "El apellido materno solo puede contener letras y espacios")
    @Column(name = "apellido_m", length = 50)
    private String apellidoM;

    @Pattern(regexp = "^[0-9]{10,15}$", message = "El teléfono debe tener entre 10 y 15 dígitos")
    @Column(name = "telefono", length = 15)
    private String telefono;

    @NotBlank(message = "El correo es requerido")
    @Email(message = "El correo debe ser válido")
    @Column(name = "correo", length = 100, unique = true)
    private String correo;

    @Column(name = "calle", length = 100)
    private String calle;

    @Column(name = "numero", length = 10)
    private String numero;

    @Column(name = "colonia", length = 50)
    private String colonia;

    @Column(name = "ciudad", length = 50)
    private String ciudad;

    @Column(name = "estado", length = 50)
    private String estado;

    @Pattern(regexp = "^[0-9]{5}$", message = "El código postal debe tener 5 dígitos")
    @Column(name = "codigo_postal", length = 10)
    private String codigoPostal;

    public Cliente() {}

    // Getters y setters
    public Integer getIdCliente() { return idCliente; }
    public void setIdCliente(Integer idCliente) { this.idCliente = idCliente; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellidoP() { return apellidoP; }
    public void setApellidoP(String apellidoP) { this.apellidoP = apellidoP; }

    public String getApellidoM() { return apellidoM; }
    public void setApellidoM(String apellidoM) { this.apellidoM = apellidoM; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getCalle() { return calle; }
    public void setCalle(String calle) { this.calle = calle; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getColonia() { return colonia; }
    public void setColonia(String colonia) { this.colonia = colonia; }

    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getCodigoPostal() { return codigoPostal; }
    public void setCodigoPostal(String codigoPostal) { this.codigoPostal = codigoPostal; }
}
