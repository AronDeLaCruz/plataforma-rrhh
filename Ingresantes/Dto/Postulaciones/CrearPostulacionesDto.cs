namespace Ingresantes.Dto.Postulaciones
{
    public record CrearPostulacionesDto(
        string Nombre,
        string Apellido,
        string TipoDocumento,
        string NumeroDocumento,
        string Email,
        string Telefono,
        Guid IdPuesto,
        List<CrearEducacionDto>? Educacion,
        List<CrearExperienciaDto>? Experiencia
    );
}