export interface User {
  id: string;
  nombreCompleto: string;
  dni: string;
  puesto: string;
  estado: string;
  fechaPostulacion: string;
  codigoAcceso: string;
  // JWT emitido por el backend en el login: el interceptor lo reenvía como Bearer en cada request.
  token: string;
}