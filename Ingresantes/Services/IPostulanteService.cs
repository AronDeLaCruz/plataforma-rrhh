using Ingresantes.Dto.Postulante;
using Microsoft.AspNetCore.Mvc;

namespace Ingresantes.Services
{
    public interface IPostulanteService
    {
        Task<RespuestaPostulanteDto> CrearPostulanteAsync(CrearPostulanteDto dto);

        Task<RespuestaPostulanteDto> GetByIdAsync(Guid id);
    }
}