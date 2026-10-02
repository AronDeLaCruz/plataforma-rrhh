// Las tablas siguen el contrato del backend (CrearEducacionDto / CrearExperienciaDto):
// tres campos, todos obligatorios, con estos mismos nombres.
export interface Estudio {
  id: string;
  institucion: string;
  tituloObtenido: string;
  nivelEducativo: string;
}

export interface ExperienciaLaboral {
  id: string;
  nombre: string;
  descripcion: string;
  puesto: string;
}

export interface Usuario {
  id: string;
  nombres: string;
  numeroDocumento: string;
  puesto: string;
}

export interface Postulante {///mas q postulante esto es ficha
  id: string;
  apat: string;
  amat: string;
  nombres: string;
  tipoDocumento: string;
  dni: string;
  fechaNacimiento: string;
  edad: number; // Cambiado a number - ahora se guarda como número
  direccion: string;
  departamento: string;
  provincia: string;
  distrito: string;
  celular: string;
  telefonoFijo: string;
  email: string;
  nacionalidad: string;
  banco: string;
  cuenta: string;
  sexo: string;
  estadoCivil: string;
  estudios: Estudio[];
  experienciaLaboral: ExperienciaLaboral[];
}

export function crearPostulanteVacio(dni: string): Postulante {
  return {
    id: dni,
    apat: "",
    amat: "",
    nombres: "",
    tipoDocumento: "DNI",
    dni,
    fechaNacimiento: "",
    edad: 0, // Se guarda como número (el tipo Postulante.edad es number)
    direccion: "",
    departamento: "",
    provincia: "",
    distrito: "",
    celular: "",
    telefonoFijo: "",
    email: "",
    nacionalidad: "PERUANA",
    banco: "",
    cuenta: "",
    sexo: "",
    estadoCivil: "",
    estudios: [],
    experienciaLaboral: [],
  };
}