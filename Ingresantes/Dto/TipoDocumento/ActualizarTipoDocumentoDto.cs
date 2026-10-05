namespace Ingresantes.Dto.TipoDocumento
{
    public record ActualizarTipoDocumentoDto(string Nombre, bool Requerido, int Orden, string ExtensionesPermitidas, long TamanoMaximoBytes);
}