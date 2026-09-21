using Ingresantes.Dto.Postulaciones;
using Ingresantes.Models;

namespace Ingresantes.Services
{
    public interface IPostulacionService
    {
        
        Task<PostulacionRespuestaDto> crearPostulacion( CrearPostulacionesDto dto );
        Task<PostulacionRespuestaDto?> GetByIdAsync(Guid id);
        Task<IEnumerable<PostulacionRespuestaDto>> GetAllAsync(bool soloActivos = false);//Guid? postulacionId, string? estado);
        Task<bool> UpdateStatusAsync(Guid id, EstadoPostulacion nuevoEstado);
        Task<string> UploadDocumentAsync( Guid postulanteId, IFormFile archivo, int TipoDocumento);
        Task<PostulacionRespuestaDto> VerificarAccesoAsync(string NumeroDocumento, string CodigoAcceso);
    }
}