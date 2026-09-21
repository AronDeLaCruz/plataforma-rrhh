using System.ComponentModel.DataAnnotations;

namespace Ingresantes.Dto.Postulaciones
{
    public record CrearEducacionDto(
        [Required(ErrorMessage = "La institución es obligatoria")]
        [MaxLength(150)]
        string Institucion, 
        [Required(ErrorMessage = "El titulo obtenido es obligatorio")]
        [MaxLength(150)]
        string TituloObtenido,
        [Required(ErrorMessage = "El nivel educativo es obligatoria")]
        [MaxLength(150)]
        string NivelEducativo
    );
}