namespace Ingresantes.Dto.User
{
    public record UsuarioResumenDto(Guid Id, string Nombre, string Email, string Rol, bool Activo, DateTime FechaCreacion);
}