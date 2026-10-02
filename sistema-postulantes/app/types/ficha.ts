// Contrato de la ficha tal como lo expone el backend (Ingresantes: Dto/Ficha/CrearFichaDto).
// Los nombres son los que emite y acepta System.Text.Json (camelCase); el binder del API no
// distingue mayúsculas, pero se mantienen literales para no introducir deriva.

export interface CrearEducacionDto {
  institucion: string
  tituloObtenido: string
  nivelEducativo: string
}

export interface CrearExperienciaDto {
  nombre: string
  descripcion: string
  puesto: string
}

export interface CrearFichaDto {
  idPostulacion: string
  nombres: string
  apellidoPaterno: string
  apellidoMaterno: string
  tipoDocumento: string
  numeroDocumento: string
  fechaNacimiento: string
  edad: number
  direccion: string
  // El backend nombra así al departamento (sin la "o" final): el nombre viaja literal.
  departament: string
  provincia: string
  distrito: string
  numeroCelular: string
  numeroFijo: string
  email: string
  sexo: string
  estadoCivil: string
  educacion: CrearEducacionDto[] | null
  experiencia: CrearExperienciaDto[] | null
}

// FichaController responde con el id de la ficha creada.
export interface FichaRespuestaDto {
  id: string
}
