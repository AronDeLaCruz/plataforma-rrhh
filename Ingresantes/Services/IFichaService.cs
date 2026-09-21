using Ingresantes.Dto.Ficha;

namespace Ingresantes.Services
{
    public interface IFichaService
    {
        Task<FichaRespuestaDto> subirFicha(CrearFichaDto dto);
        Task<FichaRespuestaDto> GetByIdAsync(Guid id);
    }
}