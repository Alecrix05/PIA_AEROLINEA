package com.aerolinea.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Entity
@Table(name = "Empleado")
public class Empleado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_empleado")
    private Integer idEmpleado;

    @NotBlank(message = "El nombre es requerido")
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", message = "El nombre solo puede contener letras y espacios")
    private String nombre;

    @NotBlank(message = "El apellido paterno es requerido")
    @Size(min = 2, max = 50, message = "El apellido paterno debe tener entre 2 y 50 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", message = "El apellido paterno solo puede contener letras y espacios")
    @Column(name = "apellido_p")
    private String apellidoP;

    @Size(max = 50, message = "El apellido materno no puede exceder 50 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$", message = "El apellido materno solo puede contener letras y espacios")
    @Column(name = "apellido_m")
    private String apellidoM;

    @NotBlank(message = "El puesto es requerido")
    @Size(max = 100, message = "El puesto no puede exceder 100 caracteres")
    private String puesto;

    @NotNull(message = "El salario es requerido")
    @DecimalMin(value = "0.01", message = "El salario debe ser mayor a 0")
    @DecimalMax(value = "999999.99", message = "El salario no puede exceder $999,999.99")
    private Double salario;

    @NotNull(message = "La fecha de contratación es requerida")
    @PastOrPresent(message = "La fecha de contratación no puede ser futura")
    @Column(name = "fecha_contratacion")
    private LocalDate fechaContratacion;

    @ManyToOne
    @JoinColumn(name = "id_departamento")
    private Departamento departamento;

    public Integer getIdEmpleado() {
        return idEmpleado;
    }

    public void setIdEmpleado(Integer idEmpleado) {
        this.idEmpleado = idEmpleado;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidoP() {
        return apellidoP;
    }

    public void setApellidoP(String apellidoP) {
        this.apellidoP = apellidoP;
    }

    public String getApellidoM() {
        return apellidoM;
    }

    public void setApellidoM(String apellidoM) {
        this.apellidoM = apellidoM;
    }

    public String getPuesto() {
        return puesto;
    }

    public void setPuesto(String puesto) {
        this.puesto = puesto;
    }

    public Double getSalario() {
        return salario;
    }

    public void setSalario(Double salario) {
        this.salario = salario;
    }

    public LocalDate getFechaContratacion() {
        return fechaContratacion;
    }

    public void setFechaContratacion(LocalDate fechaContratacion) {
        this.fechaContratacion = fechaContratacion;
    }

    public Departamento getDepartamento() {
        return departamento;
    }

    public void setDepartamento(Departamento departamento) {
        this.departamento = departamento;
    }
}
