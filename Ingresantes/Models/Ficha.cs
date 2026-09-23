namespace Ingresantes.Models
{
    public class Ficha{
        public Guid Id { get; set; }
        public Guid PostulacionId { get; set; }
        public string Nombres {get; set;}
        public string ApellidoPaterno {get;set;}
        public string ApellidoMaterno {get; set;}
        public string TipoDocumento {get; set;}
        public string NumeroDocumento {get; set;}
        public DateTime FechaNacimiento {get; set;}
        public int Edad {get; set;}
        public string Direccion {get; set;}
        public string Departamento {get;set;}
        public string Provincia {get; set;}
        public string Distrito {get; set;}
        public string NumeroCelular {get; set;}
        public string NumeroFijo {get; set;}
        public string Email {get; set;}

        public string Sexo {get; set;}  = default!;
        public string EstadoCivil {get;set;}  = default!;


    }
}