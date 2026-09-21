namespace Ingresantes.Models
{
    public class Experiencia
    {
        public Guid Id { get; set; }
        public string Nombre { get; set;} = default!;
        public string Descripcion { get; set;} = default!;
        public Guid PostulanteId { get; set;}
        public string Puesto { get; set; } = default!;
    }
}