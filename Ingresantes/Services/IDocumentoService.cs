using Ingresantes.Dto.Postulaciones;

namespace Ingresantes.Services
{
    public interface IDocumentoService
    {
        Task<DocumentoRespuestaDto> SubirDocumentoAsync(Guid idPostulacion, IFormFile file, int tipoDocumento);
        Task<IEnumerable<DocumentoRespuestaDto>> GetByCodigoAsync(Guid idDocumento);
    }
}