namespace Ingresantes.Dto.Postulante
{
    public record RespuestaPostulanteDto(
        Guid Id, string Nombre, string Apellido, string DNI
    );
}