using Ingresantes.Dto.Postulaciones;

namespace Ingresantes.Dto.Ficha
{
    public record CrearFichaDto(
        Guid idPostulacion,
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
        int sexo, 
        int estadoCivil,
        List<CrearEducacionDto>? Educacion,
        List<CrearExperienciaDto>? Experiencia
    );
}