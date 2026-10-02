using Ingresantes.Dto.Ficha;

namespace Ingresantes.Dto.Postulaciones
{
    public record PostulanteDetalleDto(
        Guid IdPostulacion,
        string NombreCompleto,
        string Dni,
        string Puesto,
        string EstadoPostulacion,
        FichaRespuestaDto? Ficha,
        List<DocumentoRespuestaDto> Documentos
    );

}