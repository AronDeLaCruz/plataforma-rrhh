using Ingresantes.Dto.Postulaciones;

namespace Ingresantes.Dto.Postulante
{
    public record ResumenPostulacionDto(
        Guid Id,
        string Puesto,
        string Estado,
        DateTime FechaPostulacion,
        bool TieneFicha,
        int DocumentosSubidos,
        List<DocumentoResumenDto> Documentos
        //,
        //int DocumentosAprobados
    );
}