using Ingresantes.Dto.Puesto;

namespace Ingresantes.Services
{
    public interface IPuestoService
    {
         Task<RespuestaPuestoDto> CreateAsync(CrearPuestoDto dto);
        Task<RespuestaPuestoDto?> GetByIdAsync(Guid id);
        Task<IEnumerable<RespuestaPuestoDto>> GetAllAsync(bool soloAbiertas = false);
        Task<bool> CloseAsync(Guid id);
    }
}