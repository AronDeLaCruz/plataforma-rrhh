using Ingresantes.Data;
using Ingresantes.Dto.Postulaciones;
using Ingresantes.Exceptions;
using Ingresantes.Models;
using Microsoft.EntityFrameworkCore;

namespace Ingresantes.Services
{
    public class DocumentoService : IDocumentoService
    {
        private readonly RrhhDbContext _context;
        private readonly IFileStorageService _fileStorage;


        public  DocumentoService(RrhhDbContext context, IFileStorageService fileStorage)
        {
            _context = context;
            _fileStorage = fileStorage;
        }

        public async Task<DocumentoRespuestaDto> SubirDocumentoAsync(Guid idPostulacion, IFormFile file, int tipoDocumento)
        {
            var postulacion = await _context.Postulacion.FindAsync(idPostulacion)
                    ?? throw new NotFoundException("Postulación no encontrada.");   

            var url = await _fileStorage.UploadAsync(file,  $"postulaciones/{idPostulacion}");

            var documento = new Documentos
            {
                Id = Guid.NewGuid(),
                PostulacionId = idPostulacion,
                TipoDocumento = tipoDocumento,
                NombreDocumento = file.FileName,
                UrlArchivo = url
            };

            _context.documentos.Add(documento);
            await _context.SaveChangesAsync();
            return new DocumentoRespuestaDto(documento.Id, documento.TipoDocumento, 
                    documento.NombreDocumento, documento.UrlArchivo, documento.FechaSubida);
        }

        public async Task<IEnumerable<DocumentoRespuestaDto>> GetByCodigoAsync(Guid idDocumento)
        {
            return await _context.documentos
                            .Where(d => d.Id == idDocumento)
                            .Select(d => new DocumentoRespuestaDto(d.Id, d.TipoDocumento, 
                                        d.NombreDocumento, d.UrlArchivo, d.FechaSubida))
                            .ToListAsync();
        }
    }
}