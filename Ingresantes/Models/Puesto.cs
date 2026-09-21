namespace Ingresantes.Models
{
    public class Puesto
    {
        public Guid Id { get; set;}
        public string Nombre { get; set;} = default!;
        public string Departamento { get; set;} = default!;
        public string Modalidad { get; set;} = default!;
        public string Descripcion { get; set;} = default!;
        public string Requisitos { get; set;} = default!;
        public string Estado { get; set; } = "Abierta";
        public ICollection<Postulacion> Applications { get; set; } = new List<Postulacion>();

    }
}