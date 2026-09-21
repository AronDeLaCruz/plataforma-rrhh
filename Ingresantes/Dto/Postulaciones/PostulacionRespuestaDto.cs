namespace Ingresantes.Dto.Postulaciones
{
    public record PostulacionRespuestaDto(
        Guid Id,
        string NombreCompleto,
        string DNI,
        string Puesto,
        string Estado,
        DateTime FechaPostulacion,
        string codigoAcceso
    );
}