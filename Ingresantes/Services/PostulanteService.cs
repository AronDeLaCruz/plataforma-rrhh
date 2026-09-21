using Ingresantes.Data;
using Ingresantes.Dto.Postulante;
using Ingresantes.Models.Entities;
using Microsoft.AspNetCore.Mvc;

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


        private static RespuestaPostulanteDto MapToDto(Postulante postulante) =>
            new(postulante.Id, postulante.Nombre, postulante.Apellido, postulante.DNI);

    }

}