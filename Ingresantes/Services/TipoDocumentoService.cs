using Ingresantes.Data;
using Ingresantes.Dto.TipoDocumento;
using Ingresantes.Exceptions;
using Ingresantes.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ingresantes.Services
{
    public class TipoDocumentoService : ITipoDocumentoService
    {
        private readonly RrhhDbContext _context;
        public TipoDocumentoService(RrhhDbContext context) => _context = context;

        public async Task<IEnumerable<TipoDocumentoDto>> GetAllAsync(bool soloActivos = false)
        {
            var query = _context.TiposDocumento.AsQueryable();
            if (soloActivos) query = query.Where(t => t.Activo);

            return await query
                .OrderBy(t => t.Orden)
                .Select(t => new TipoDocumentoDto(t.Id, t.Nombre, t.Requerido, t.Activo, t.Orden, t.ExtensionesPermitidas, t.TamanoMaximoBytes))
                .ToListAsync();
        }

        public async Task<TipoDocumentoDto> CreateAsync(CrearTipoDocumentoDto dto)
        {
            var tipo = new TipoDocumentoConfig
            {
                Nombre = dto.Nombre,
                Requerido = dto.Requerido,
                Orden = dto.Orden,
                ExtensionesPermitidas = dto.ExtensionesPermitidas,
                TamanoMaximoBytes = dto.TamanoMaximoBytes,
                Activo = true
            };
            _context.TiposDocumento.Add(tipo);
            await _context.SaveChangesAsync();
            return new TipoDocumentoDto(tipo.Id, tipo.Nombre, tipo.Requerido, tipo.Activo, tipo.Orden, tipo.ExtensionesPermitidas, tipo.TamanoMaximoBytes);
        }

        public async Task<TipoDocumentoDto> UpdateAsync(int id, ActualizarTipoDocumentoDto dto)
        {
            var tipo = await _context.TiposDocumento.FindAsync(id)
                ?? throw new NotFoundException("Tipo de documento no encontrado.");

            tipo.Nombre = dto.Nombre;
            tipo.Requerido = dto.Requerido;
            tipo.Orden = dto.Orden;
            tipo.ExtensionesPermitidas = dto.ExtensionesPermitidas;
            tipo.TamanoMaximoBytes = dto.TamanoMaximoBytes;

            await _context.SaveChangesAsync();
            return new TipoDocumentoDto(tipo.Id, tipo.Nombre, tipo.Requerido, tipo.Activo, tipo.Orden, tipo.ExtensionesPermitidas, tipo.TamanoMaximoBytes);
        }

        public async Task<bool> CambiarEstadoAsync(int id, bool activo)
        {
            var tipo = await _context.TiposDocumento.FindAsync(id);
            if (tipo is null) return false;
            tipo.Activo = activo;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}