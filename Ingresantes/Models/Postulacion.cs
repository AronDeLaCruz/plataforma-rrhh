using Ingresantes.Models.Entities;

namespace Ingresantes.Models
{
    
    public class Postulacion
    {
        public Guid Id { get; set; }
        public Guid IdPostulante { get; set;}
        public Postulante Postulante { get; set; } = default!;
        public Guid IdPuesto { get; set;}
        public Puesto Puesto { get; set; } = default!;

        public DateTime FechaPostulacion { get; set;} = DateTime.UtcNow;

        public EstadoPostulacion Estado { get; set; } = EstadoPostulacion.Recibido;
        
        public string? FuenteReclutamiento { get; set; }

        public decimal? SalarioPretendido { get; set; }

        public string? CodigoAccesoHash { get; set; }
 
    }

}