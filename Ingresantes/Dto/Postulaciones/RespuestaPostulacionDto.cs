using Ingresantes.Models;

namespace Ingresantes.Dto.Postulaciones
{
    public record RespuestaPostulacionDto(
        Models.Ficha Ficha, Educacion Educacion, Experiencia Experiencia
    );
}