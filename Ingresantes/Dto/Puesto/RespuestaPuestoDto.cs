namespace Ingresantes.Dto.Puesto
{
    public record RespuestaPuestoDto(
        Guid Id, string Titulo, string Departamento, string Modalidad, string Estado
    );
}