namespace Ingresantes.Dto.Puesto
{
    public record CrearPuestoDto(
        string Titulo, string Descripcion, string Requerimiento,
        string Departamento, string Modalidad
    );
}