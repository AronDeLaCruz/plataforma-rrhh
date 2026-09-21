using Ingresantes.Data;
using Ingresantes.Dto.Ficha;
using Ingresantes.Exceptions;
using Ingresantes.Models;
using Microsoft.EntityFrameworkCore;

namespace Ingresantes.Services
{
    
    public class FichaService : IFichaService
    {
        private readonly RrhhDbContext _context;

        public FichaService(RrhhDbContext context)
        {
            _context = context;
        }

        public async Task<FichaRespuestaDto> subirFicha(CrearFichaDto dto)
        {

            //Seria bueno que busque la postulacion
            var postulacion = await _context.Postulacion.FindAsync(dto.idPostulacion)
                ?? throw new NotFoundException("Puesto no encontrado");

            var ficha = new Ficha
            {
                Id = Guid.NewGuid(),
                Nombres = dto.nombres
            };

            _context.fichas.Add(ficha);


            if (dto.Educacion is not null)
            {
                foreach (var educacion in dto.Educacion)
                {
                    _context.Educacion.Add(new Educacion
                    {
                        Id = Guid.NewGuid(),
                        Institucion = educacion.Institucion,
                        TituloObtenido = educacion.TituloObtenido,
                        NivelEducativo = educacion.NivelEducativo
                    });
                }
            }

            if (dto.Experiencia is not null)
            {
                foreach (var exp in dto.Experiencia)
                {
                    _context.Experiencias.Add(new Experiencia
                    {
                        Id = Guid.NewGuid(),
                        Nombre = exp.Nombre,
                        Descripcion = exp.Descripcion,
                        Puesto = exp.Puesto
                    });
                }
            }

            await _context.SaveChangesAsync();
            return MapToRespuestaDto(ficha);
        }

        public async Task<FichaRespuestaDto> GetByIdAsync(Guid id)
        {
            var ficha = await _context.fichas
                .FirstOrDefaultAsync(p => p.Id == id)
                ?? throw new NotFoundException("Ficha no encontrada");

            return MapToRespuestaDto(ficha);
        }

        private static FichaRespuestaDto MapToRespuestaDto(Ficha ficha) =>
            new(
                ficha.PostulacionId
            );
     }

}