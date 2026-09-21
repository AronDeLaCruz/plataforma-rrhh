using Ingresantes.Data;
using Ingresantes.Dto.Auth;
using Ingresantes.Models;
using Ingresantes.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Ingresantes.Services
{
    public class AuthService : IAuthService
    {

        private readonly RrhhDbContext _context;
        private readonly ITokenService _token;

        public AuthService(RrhhDbContext context, ITokenService token)
        {
            _context = context;
            _token = token;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            var existe = await _context.Users.AnyAsync(u => u.Email == dto.Email);
            if (existe)
                throw new ConflictException("Ya existe un usuario con ese email.");

            var user = new User
            {
                Id = Guid.NewGuid(),
                Nombre = dto.Nombre,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Rol = "RRHH"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _token.GenerateToken(user, out var expiraEn);
            return new AuthResponseDto(token, expiraEn, user.Nombre, user.Rol);

        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email)
            ?? throw new NotFoundException("Credenciales inválidas.");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new NotFoundException("Credenciales inválidas."); // mismo mensaje que arriba, no reveles cuál fue el error

            var token = _token.GenerateToken(user, out var expiraEn);
            return new AuthResponseDto(token, expiraEn, user.Nombre, user.Rol);
        }
    }
}