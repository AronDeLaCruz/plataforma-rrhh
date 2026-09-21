using Ingresantes.Data;
using Ingresantes.Dto.Postulaciones;
using Ingresantes.Exceptions;
using Ingresantes.Models;
using Ingresantes.Models.Entities;
using Microsoft.EntityFrameworkCore;


namespace Ingresantes.Services
{
    
    public class PostulacionService: IPostulacionService
    {

        private readonly RrhhDbContext _context;
        private readonly IFileStorageService _fileStorage;
        private readonly ILogger<PostulacionService> _logger;

        public PostulacionService(RrhhDbContext context, IFileStorageService fileStorage, ILogger<PostulacionService> logger)
        {
            _context = context;
            _fileStorage = fileStorage;
            _logger = logger;
        }

        private static string GenerarCodigoAcceso()
        {
            var random = new Random();
            return random.Next(1000, 9999).ToString();

        }

        public async Task<PostulacionRespuestaDto> crearPostulacion(CrearPostulacionesDto dto)
        {
            
            var puesto = await _context.Puestos.FindAsync(dto.IdPuesto)
                    ?? throw new NotFoundException("Puesto no encontrado");

            if (puesto.Estado != "Abierta")
            {
                throw new BusinessRuleException($"El puesto no está disponible para postular. Estado actual: '{puesto.Estado}'");
            }

            var postulante = await _context.Postulantes
                .FirstOrDefaultAsync(p => p.DNI == dto.NumeroDocumento);

            if ( postulante is null)
            {
                postulante = new Postulante
                {
                    Id = Guid.NewGuid(),
                    Nombre = dto.Nombre,
                    Apellido = dto.Apellido,
                    DNI = dto.NumeroDocumento,
                    Email = dto.Email,
                    Telefono = dto.Telefono,
                    TipoDocumento = dto.TipoDocumento
                };
                _context.Postulantes.Add(postulante);
            }

            var yaPostulo = await _context.Postulacion
                .AnyAsync( a => a.IdPostulante == postulante.Id && a.IdPuesto == dto.IdPuesto);

            if (yaPostulo)
            {
                throw new InvalidOperationException("");
            }

            var codigoAcceso = GenerarCodigoAcceso();

            var postulacion = new Postulacion
            {
                Id = Guid.NewGuid(),
                IdPostulante = postulante.Id,
                IdPuesto = dto.IdPuesto,
                Estado = EstadoPostulacion.Recibido,
                CodigoAccesoHash = codigoAcceso//BCrypt.Net.BCrypt.HashPassword(codigoAcceso)
            };

            _context.Postulacion.Add(postulacion);

            if (dto.Educacion is not null)
            {
                foreach (var educacion in dto.Educacion)
                {
                    _context.Educacion.Add(new Educacion
                    {
                        Id = Guid.NewGuid(),
                        PostulanteId = postulante.Id,
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
                        PostulanteId = postulante.Id,
                        Nombre = exp.Nombre,
                        Descripcion = exp.Descripcion,
                        Puesto = exp.Puesto
                    });
                }
            }

            await _context.SaveChangesAsync();

            _logger.LogInformation("Nueva postulación {ApplicationId} de {ApplicantId} a vacante {VacancyId}",
                postulacion.Id, postulante.Id, dto.IdPuesto);

            return MapToRespuestDto(postulante, postulacion);
        }


        public async Task<PostulacionRespuestaDto?> VerificarAccesoAsync(string numeroDoc, string codigo)
        {
            var postulante = await _context.Postulacion
                                    .Include(a => a.Postulante)
                                    .Include(p => p.Puesto)
                                    .FirstOrDefaultAsync(p => p.Postulante.DNI == numeroDoc && p.CodigoAccesoHash == codigo);

            //if (postulante?.CodigoAccesoHash is not string codigoAccesoHash) return null;
            //if ((codigo, codigoAccesoHash)) return null;//!BCrypt.Net.BCrypt.Verify
 

            return MapToRespuestDto(postulante.Postulante,postulante);
        }

        public async Task<PostulacionRespuestaDto?> GetByIdAsync(Guid id)
        {
            var postulacion = await _context.Postulacion
                .Include(p => p.Postulante)
                .FirstOrDefaultAsync(p => p.Id == id);
            
            return postulacion is null ? null : MapToRespuestDto(postulacion.Postulante, postulacion);
        }

        public async Task<IEnumerable<PostulacionRespuestaDto>> GetAllAsync(bool soloActivos = false)//Guid? vacancyId, string? estado)
        {
            var query = _context.Postulacion
                .Include(a => a.Postulante)
                .Include(p => p.Puesto)
                .AsQueryable();

        //    if (vacancyId.HasValue)
         //       query = query.Where(a => a.Id == vacancyId.Value);

//            if (!string.IsNullOrEmpty(estado) && Enum.TryParse<EstadoPostulacion>(estado, true, out var parsedEstado))
  //              query = query.Where(a => a.Estado == parsedEstado);

            var applications = await query
                .OrderByDescending(a => a.FechaPostulacion)
                .ToListAsync();

            return applications.Select(a => MapToRespuestDto( a.Postulante, a));
        }

        public async Task<bool> UpdateStatusAsync(Guid id, EstadoPostulacion nuevoEstado)
        {
            var application = await _context.Postulacion.FindAsync(id);//.Applications.FindAsync(id);
            if (application is null) return false;

            application.Estado = nuevoEstado;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<string> UploadDocumentAsync(Guid applicantId, IFormFile file, int tipoDocumento)
        {
            var applicant = await _context.Postulantes.FindAsync(applicantId)
                ?? throw new NotFoundException("Postulante no encontrado.");

            var url = await _fileStorage.UploadAsync(file, $"applicants/{applicantId}");

            _context.documentos.Add(new Documentos
            {
                Id = Guid.NewGuid(),
                PostulanteId = applicantId,
                TipoDocumento = tipoDocumento,
                NombreDocumento = file.FileName,
                UrlArchivo = url
            });

            await _context.SaveChangesAsync();
            return url;
        }

        private static PostulacionRespuestaDto MapToRespuestDto(Postulante postulante, Postulacion postulacion) =>
            new(postulacion.Id, 
                $"{postulante.Nombre} {postulante.Apellido}", 
                postulante.DNI,
                postulacion.Puesto?.Nombre ?? "",
                postulacion.Estado.ToString(),
                postulacion.FechaPostulacion,
                postulacion.CodigoAccesoHash
            );
        
    }
}