package com.aerolinea.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.Date;

@Entity
@Table(name = "Pasajero")
public class Pasajero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pasajero")
    private Integer idPasajero;

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

    @NotNull(message = "La fecha de nacimiento es requerida")
    @Past(message = "La fecha de nacimiento debe ser anterior a la fecha actual")
    @Column(name = "fecha_nacimiento")
    private Date fechaNacimiento;

    @Size(max = 50, message = "La nacionalidad no puede exceder 50 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$", message = "La nacionalidad solo puede contener letras y espacios")
    @Column(name = "nacionalidad", length = 50)
    private String nacionalidad;

    @Column(name = "pasaporte")
    private byte[] pasaporte;

    @ManyToOne
    @JoinColumn(name = "id_cliente")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Cliente cliente;

    public Pasajero() {}

    // Getters y setters
    public Integer getIdPasajero() { return idPasajero; }
    public void setIdPasajero(Integer idPasajero) { this.idPasajero = idPasajero; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellidoP() { return apellidoP; }
    public void setApellidoP(String apellidoP) { this.apellidoP = apellidoP; }

    public String getApellidoM() { return apellidoM; }
    public void setApellidoM(String apellidoM) { this.apellidoM = apellidoM; }

    public Date getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(Date fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }

    public String getNacionalidad() { return nacionalidad; }
    public void setNacionalidad(String nacionalidad) { this.nacionalidad = nacionalidad; }

    public byte[] getPasaporte() { return pasaporte; }
    public void setPasaporte(byte[] pasaporte) { this.pasaporte = pasaporte; }

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
}
