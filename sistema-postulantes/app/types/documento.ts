export interface TipoDocumentoDto {
  id: number;
  nombre: string;
  requerido: boolean;
  activo: boolean;
  orden: number;
  extensionesPermitidas: string;
  tamanoMaximoBytes: number;
}
