using Ingresantes.Dto.TipoDocumento;

namespace Ingresantes.Services
{
    public interface ITipoDocumentoService
    {
        Task<IEnumerable<TipoDocumentoDto>> GetAllAsync(bool soloActivos = false);
        Task<TipoDocumentoDto> CreateAsync(CrearTipoDocumentoDto dto);
        Task<TipoDocumentoDto> UpdateAsync(int id, ActualizarTipoDocumentoDto dto);
        Task<bool> CambiarEstadoAsync(int id, bool activo);
    }
}
