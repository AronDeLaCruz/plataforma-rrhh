using Ingresantes.Data;
using Ingresantes.Dto.Common;
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
                Nombres = dto.nombres,
                PostulacionId = dto.idPostulacion,
                ApellidoMaterno = dto.apellidoMaterno,
                ApellidoPaterno = dto.apellidoPaterno,
                TipoDocumento = dto.tipoDocumento,
                NumeroDocumento = dto.numeroDocumento,
                FechaNacimiento = dto.fechaNacimiento,
                Edad = dto.edad,
                Direccion = dto.direccion,
                Departamento = dto.departament,
                Provincia = dto.provincia,
                Distrito = dto.distrito,
                NumeroCelular = dto.numeroCelular,
                NumeroFijo = dto.numeroFijo,
                Email = dto.email,
                Sexo = dto.sexo,
                EstadoCivil = dto.estadoCivil,
            };

            _context.fichas.Add(ficha);


            if (dto.Educacion is not null)
            {
                foreach (var educacion in dto.Educacion)
                {
                    _context.Educacion.Add(new Educacion
                    {
                        Id = Guid.NewGuid(),
                        PostulacionId = dto.idPostulacion,
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
                        PostulacionId = dto.idPostulacion,
                        Nombre = exp.Nombre,
                        Descripcion = exp.Descripcion,
                        Puesto = exp.Puesto
                    });
                }
            }

            await _context.SaveChangesAsync();

            var educacionCreada = await _context.Educacion
                .Where(e => e.PostulacionId == ficha.PostulacionId)
                .ToListAsync();

            var experienciaCreada = await _context.Experiencias
                .Where(e => e.PostulacionId == ficha.PostulacionId)
                .ToListAsync();


            return MapToRespuestaDto(ficha, educacionCreada,experienciaCreada);
        }

        public async Task<FichaRespuestaDto> GetByIdAsync(Guid id)
        {
            var ficha = await _context.fichas.FirstOrDefaultAsync(p => p.PostulacionId == id);

            if(ficha is null) return null;

            var educacion = await _context.Educacion
                                          .Where(e => e.PostulacionId == ficha.PostulacionId)
                                          .ToListAsync();
            
            var experiencia = await _context.Experiencias
                                .Where(e => e.PostulacionId == ficha.PostulacionId)
                                .ToListAsync();

            return MapToRespuestaDto(ficha, educacion, experiencia);
        }

        private static FichaRespuestaDto MapToRespuestaDto(
            Ficha ficha, List<Educacion> educacion, List<Experiencia> experiencia) =>
            new(
                ficha.Id,
                ficha.Nombres,
                ficha.ApellidoPaterno,
                ficha.ApellidoMaterno,
                ficha.TipoDocumento,
                ficha.NumeroDocumento,
                ficha.FechaNacimiento,
                ficha.Edad,
                ficha.Direccion,
                ficha.Departamento,
                ficha.Provincia,
                ficha.Distrito,
                ficha.NumeroCelular,
                ficha.NumeroFijo,
                ficha.Email,
                ficha.Sexo,
                ficha.EstadoCivil,
                educacion.Select(e => new EducacionDto(e.Id, e.Institucion, e.TituloObtenido, e.NivelEducativo)).ToList(),
                experiencia.Select(e => new ExperienciaDto(e.Id, e.Nombre, e.Descripcion, e.Puesto)).ToList()
            );
     }

}