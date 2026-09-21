namespace Ingresantes.Dto.Auth
{
    public record AuthResponseDto(string Token, DateTime ExpiraEn, string Nombre, string Rol);
}