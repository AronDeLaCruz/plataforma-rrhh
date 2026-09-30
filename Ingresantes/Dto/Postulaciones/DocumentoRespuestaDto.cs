namespace Ingresantes.Dto.Postulaciones
{
    public record DocumentoRespuestaDto(
        Guid Id, int TipoDocumento, 
        string NombreDocumento, string UrlArchivo, 
        DateTime FechaSubida
    );
}