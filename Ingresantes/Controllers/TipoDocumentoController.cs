
using Ingresantes.Dto.TipoDocumento;
using Ingresantes.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class TipoDocumentoController : ControllerBase
{
    private readonly ITipoDocumentoService _service;
    public TipoDocumentoController(ITipoDocumentoService service)
    {
        _service = service;
    }

    [HttpGet("postulante")]
    public async Task<ActionResult<IEnumerable<TipoDocumentoDto>>> GetDocumentoPostulante()
    {
        var result = await _service.GetAllAsync(true);
        return Ok(result);
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<TipoDocumentoDto>>> GetAll()
    {
        var result = await _service.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("Activos")]
    public async Task<ActionResult<IEnumerable<TipoDocumentoDto>>> GetActivos()
    {
        var result = await _service.GetAllAsync(soloActivos:true);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Policy = "SoloAdmin")]
    public async Task<ActionResult<TipoDocumentoDto>> Create([FromBody] CrearTipoDocumentoDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return Ok(result);
    }

    [HttpPut("{id:int}")]
    [Authorize(Policy = "SoloAdmin")]
    public async Task<ActionResult<TipoDocumentoDto>> Update(int id, [FromBody] ActualizarTipoDocumentoDto dto)
    {
        var result = await _service.UpdateAsync(id, dto);
        return Ok(result);
    }

    [HttpPatch("{id:int}/estado")]
    [Authorize(Policy = "SoloAdmin")]
    public async Task<IActionResult> CambiarEstado(int id, [FromBody] bool activo)
    {
        var result = await _service.CambiarEstadoAsync(id, activo);
        return result ? NoContent() : NotFound();
    }
        
}