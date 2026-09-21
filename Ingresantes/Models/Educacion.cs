namespace Ingresantes.Models
{
    public class Educacion
    {
        public Guid Id { get; set;}
        public Guid PostulanteId { get; set;}
        public string Institucion { get; set; } = default!;
        public string TituloObtenido { get; set; } = default!;
        public string NivelEducativo { get; set; } = default!;
    }
}