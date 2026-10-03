namespace Ingresantes.Dto.Postulante
{
    public record ListadoLegajoPostulanteDto(
        Guid PostulanteId, string Dni, string NombreCompleto
    );
}