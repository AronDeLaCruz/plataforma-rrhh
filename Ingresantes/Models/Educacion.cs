namespace Ingresantes.Models
{
    public class Educacion
    {
        public Guid Id { get; set;}
        public Guid PostulacionId { get; set;}
        public string Institucion { get; set; } = default!;
        public string TituloObtenido { get; set; } = default!;
        public string NivelEducativo { get; set; } = default!;
    }
}