using System.ComponentModel.DataAnnotations;

namespace Ingresantes.Models.Entities
{
    
    public class Postulante
    {
        [Key]
        public Guid Id { get; set; }
        public string Nombre { get; set;} = default!;
        public string Apellido { get; set; } = default!;
        public string TipoDocumento { get; set; } = default!;
        public string DNI { get; set; } = default!;
        
         public string Email { get; set; } = default!;
        public string Telefono { get; set; } = default!;
        public string? LinkedInUrl { get; set; }
        public bool ConsentimientoDatos { get; set; }
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        public ICollection<Postulacion> Applications { get; set; } = new List<Postulacion>();
        public ICollection<Experiencia> Experiences { get; set; } = new List<Experiencia>();
        public ICollection<Educacion> Education { get; set; } = new List<Educacion>();
        public ICollection<Documentos> Documents { get; set; } = new List<Documentos>();
    }

}