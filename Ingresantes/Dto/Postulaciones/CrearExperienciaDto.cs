using System.ComponentModel.DataAnnotations;

namespace Ingresantes.Dto.Postulaciones
{
    public record CrearExperienciaDto(
        [Required]
        [MaxLength(150)]
        string Nombre,
        [Required]
        [MaxLength(500)]
        string Descripcion,
        [Required]
        [MaxLength(150)]
        string Puesto
    );
}