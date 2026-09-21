using Ingresantes.Dto.Puesto;
using Ingresantes.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class PuestoController : ControllerBase
{
    
    public readonly IPuestoService _service;

    public PuestoController(IPuestoService service)
    {
        _service = service;
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<RespuestaPuestoDto>> Create([FromBody] CrearPuestoDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RespuestaPuestoDto>> GetById(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RespuestaPuestoDto>>> GetAll([FromQuery] bool soloAbiertas = false)
    {
        var result = await _service.GetAllAsync(soloAbiertas);
        return Ok(result);
    }

    [HttpPatch("{id:guid}/cerrar")]
    [Authorize]
    public async Task<IActionResult> Close(Guid id)
    {
        var closed = await _service.CloseAsync(id);
        return closed ? NoContent() : NotFound();
    }

}