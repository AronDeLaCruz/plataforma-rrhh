namespace Ingresantes.Models
{
    public class Documentos
    {
        public Guid Id { get; set;}
        public string NombreDocumento { get; set;} = default!;
        public int TipoDocumento{ get; set;} = default!;
        public Guid PostulanteId { get; set;}
        public string UrlArchivo { get; set; } = default!;
    public DateTime FechaSubida { get; set; } = DateTime.UtcNow;
    }
}