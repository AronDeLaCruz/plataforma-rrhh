namespace Ingresantes.Models.Entities
{
    public class TipoDocumentoConfig
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = default!;
        public bool Requerido { get; set; }
        public bool Activo { get; set; } = true;
        public int Orden { get; set; }
        public string ExtensionesPermitidas { get; set; } = ".pdf,.jpg,.png,.docx"; // CSV simple
        public long TamanoMaximoBytes { get; set; } = 10_000_000; // 10 MB default
    }
}