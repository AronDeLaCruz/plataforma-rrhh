namespace Ingresantes.Dto.Postulante
{
    public record LegajoPostulanteDto(
        Guid PostulanteId,
        string NombreCompleto,
        string Dni,
        List<ResumenPostulacionDto> Postulaciones
    );
}