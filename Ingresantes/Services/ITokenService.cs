

using Ingresantes.Models;

namespace Ingresantes.Services
{
    public interface ITokenService
    {
        string GenerateToken(User user, out DateTime expiraEn);
        string GenerateTokenPostulante(Guid postulanteId, out DateTime expiraEn);
    }
}