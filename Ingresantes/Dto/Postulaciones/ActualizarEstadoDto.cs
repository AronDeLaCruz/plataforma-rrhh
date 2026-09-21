using System.ComponentModel.DataAnnotations;
using Ingresantes.Models;

namespace Ingresantes.Dto.Postulaciones
{
    public record ActualizarEstadoDto(
        [Required]
        [EnumDataType(typeof(EstadoPostulacion))]
        EstadoPostulacion NuevoEstado
    );
}