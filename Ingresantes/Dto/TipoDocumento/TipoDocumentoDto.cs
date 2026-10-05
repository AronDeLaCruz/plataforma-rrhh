namespace Ingresantes.Dto.TipoDocumento
{
    public record TipoDocumentoDto(int Id, string Nombre, bool Requerido, bool Activo, int Orden, string ExtensionesPermitidas, long TamanoMaximoBytes);
}