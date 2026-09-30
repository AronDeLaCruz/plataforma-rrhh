using Ingresantes.Dto.Postulaciones;
using Ingresantes.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class DocumentoController : ControllerBase
{
    private readonly IDocumentoService _service;

    public DocumentoController(IDocumentoService service)
    {
        _service = service;
    }

    [HttpPost("{idPostulacion:guid}")]
    [Authorize(Policy = "SoloPostulante")]
    [RequestSizeLimit(10_000_000)]
    public async Task<ActionResult<DocumentoRespuestaDto>> Subir(
        Guid idPostulacion, IFormFile file, [FromForm] int tipoDocumento
    )
    {
        var postulacionIdDelToken = User.FindFirst("PostulacionId")?.Value;
        if (postulacionIdDelToken != idPostulacion.ToString())
            return Forbid();

        if (file.Length == 0)
            return BadRequest("Archivo vacío.");

        var extensionesPermitidas = new[] { ".pdf", ".docx", ".jpg", ".png" };
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!extensionesPermitidas.Contains(ext))
            return BadRequest("Formato no permitido. Solo PDF, DOCX, JPG o PNG.");

        var result = await _service.SubirDocumentoAsync(idPostulacion, file, tipoDocumento);
        return Ok(result);
    }

    [HttpGet("{idPostulacion:guid}")]//cambiar
    public async Task<ActionResult<IEnumerable<DocumentoRespuestaDto>>> GetByPostulacion(Guid idPostulacion)
    {
        var postulacionIdDelToken = User.FindFirst("PostulacionId")?.Value;
        if (postulacionIdDelToken != idPostulacion.ToString())
            return Forbid();

        var result = await _service.GetByCodigoAsync(idPostulacion);
        return Ok(result);
    }
}