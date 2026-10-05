namespace Ingresantes.Dto.TipoDocumento
{
    public record CrearTipoDocumentoDto(string Nombre, bool Requerido, int Orden, string ExtensionesPermitidas, long TamanoMaximoBytes);
}