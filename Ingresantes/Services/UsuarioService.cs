using Ingresantes.Data;
using Ingresantes.Dto.User;
using Ingresantes.Exceptions;
using Ingresantes.Models;
using Microsoft.EntityFrameworkCore;

namespace Ingresantes.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly RrhhDbContext _context;
        public UsuarioService(RrhhDbContext context) => _context = context;

        public async Task<IEnumerable<UsuarioResumenDto>> GetAllAsync() =>
            await _context.Users
                .Select(u => new UsuarioResumenDto(u.Id, u.Nombre, u.Email, u.Rol, u.Activo, u.FechaCreacion))
                .ToListAsync();

        public async Task<UsuarioResumenDto> CreateAsync(CrearUsuarioDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                throw new ConflictException("Ya existe un usuario con ese email.");

            var user = new User
            {
                Id = Guid.NewGuid(),
                Nombre = dto.Nombre,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Rol = dto.Rol, // "RRHH" o "Admin"
                Activo = true
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UsuarioResumenDto(user.Id, user.Nombre, user.Email, user.Rol, user.Activo, user.FechaCreacion);
        }

        public async Task<bool> CambiarRolAsync(Guid id, string nuevoRol)
        {
            var user = await _context.Users.FindAsync(id);
            if (user is null) return false;
            user.Rol = nuevoRol;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CambiarEstadoAsync(Guid id, bool activo)
        {
            var user = await _context.Users.FindAsync(id);
            if (user is null) return false;
            user.Activo = activo;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}