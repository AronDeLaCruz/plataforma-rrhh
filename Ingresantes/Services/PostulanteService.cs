using Ingresantes.Data;
using Ingresantes.Dto.Postulaciones;
using Ingresantes.Dto.Postulante;
using Ingresantes.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ingresantes.Services
{
    
    public class PostulanteService : IPostulanteService
    {
        
        private readonly RrhhDbContext _context;
        
        public PostulanteService(RrhhDbContext context)
        {
            _context = context;
        }

        public async Task<RespuestaPostulanteDto> CrearPostulanteAsync(CrearPostulanteDto dto)
        {
            var postulante = new Postulante
            {
                Id = Guid.NewGuid(),
                Nombre = dto.Nombre,
                Apellido = dto.Apellidos,
                DNI = dto.DNI
            };

            _context.Postulantes.Add(postulante);
            await _context.SaveChangesAsync();

            return MapToDto(postulante);
        }

        public async Task<RespuestaPostulanteDto?> GetByIdAsync(Guid id)
        {
            var postulante = await _context.Postulantes.FindAsync(id);
            return postulante is null ? null : MapToDto(postulante);
        }

        public async Task<LegajoPostulanteDto?> GetLegajoAsync(string dni)
        {
            var postulante = await _context.Postulantes.FirstOrDefaultAsync(p => p.DNI == dni);
            if (postulante is null) return null;

            var postulaciones = await _context.Postulacion
                                    .Where(p => p.IdPostulante == postulante.Id)
                                    .Include(p => p.Puesto)
                                    .OrderByDescending(p => p.FechaPostulacion)
                                    .ToListAsync();

            var resumenes = new List<ResumenPostulacionDto>();

            foreach (var p in postulaciones)
            {
                var tieneFicha = await _context.fichas.AnyAsync(f => f.PostulacionId == p.Id);

                var documentos = await _context.documentos
                    .Where(d => d.PostulacionId == p.Id)
                    .Select(d => new DocumentoResumenDto(d.Id,d.TipoDocumento, "ACTIVO"))
                    .ToListAsync();

                resumenes.Add(new ResumenPostulacionDto(
                    p.Id,
                    p.Puesto.Nombre,
                    p.Estado.ToString(),
                    p.FechaPostulacion,
                    tieneFicha,
                    documentos.Count,
                    documentos//,
                    //documentos.Count(d => d.Estado == EstadoDocumento.Aprobado)
                ));
            }

            return new LegajoPostulanteDto(
                postulante.Id,
                $"{postulante.Nombre} {postulante.Apellido}",
                postulante.DNI,
                resumenes
            );
        }

        public async Task<IEnumerable<ListadoLegajoPostulanteDto>> GetListaLegajos(string? letra, string? busqueda)
        {
            var query = _context.Postulantes.AsQueryable();

            if (!string.IsNullOrWhiteSpace(letra) && letra != "Todos")
                query = query.Where(p => p.Apellido.StartsWith(letra));

            if (!string.IsNullOrWhiteSpace(busqueda))
                query = query.Where(p =>
                    p.DNI.Contains(busqueda) ||
                    p.Nombre.Contains(busqueda) ||
                    p.Apellido.Contains(busqueda));

            return await query
                    .OrderBy(p => p.Apellido)
                    .ThenBy(p => p.Nombre)
                    .Select(p => new ListadoLegajoPostulanteDto(p.Id, p.DNI, $"{p.Apellido}, {p.Nombre}"))
                    .ToListAsync();
        }


        private static RespuestaPostulanteDto MapToDto(Postulante postulante) =>
            new(postulante.Id, postulante.Nombre, postulante.Apellido, postulante.DNI);

    }

}