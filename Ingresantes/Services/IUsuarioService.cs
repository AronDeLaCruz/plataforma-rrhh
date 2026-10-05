using Ingresantes.Dto.User;

namespace Ingresantes.Services
{
    public interface IUsuarioService
    {
        Task<IEnumerable<UsuarioResumenDto>> GetAllAsync();
        Task<UsuarioResumenDto> CreateAsync(CrearUsuarioDto dto);
        Task<bool> CambiarRolAsync(Guid id, string nuevoRol);
        Task<bool> CambiarEstadoAsync(Guid id, bool activo);
    }
}