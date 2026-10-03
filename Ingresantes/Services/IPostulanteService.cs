using Ingresantes.Dto.Postulante;
using Microsoft.AspNetCore.Mvc;

namespace Ingresantes.Services
{
    public interface IPostulanteService
    {
        Task<RespuestaPostulanteDto> CrearPostulanteAsync(CrearPostulanteDto dto);
        Task<RespuestaPostulanteDto> GetByIdAsync(Guid id);
        Task<LegajoPostulanteDto?> GetLegajoAsync(string dni);
        Task<IEnumerable<ListadoLegajoPostulanteDto>> GetListaLegajos(string? letra, string? busqueda);

    }
}