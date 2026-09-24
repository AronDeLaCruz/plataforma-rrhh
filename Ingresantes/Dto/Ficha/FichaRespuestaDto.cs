using Ingresantes.Models;

namespace Ingresantes.Dto.Ficha
{
    public record FichaRespuestaDto(
        Guid Id, 
        string nombres,
        string apellidoPaterno,
        string apellidoMaterno,
        string tipoDocumento,
        string numeroDocumento,
        DateTime fechaNacimiento,
        int edad,
        string direccion,
        string departament, 
        string provincia,
        string distrito,
        string numeroCelular,
        string numeroFijo,
        string email,
        string sexo, 
        string estadoCivil,
        List<Educacion>? Educacion,
        List<Experiencia>? Experiencia
    );
}