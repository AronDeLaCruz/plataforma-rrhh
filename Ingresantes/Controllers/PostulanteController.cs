


using Ingresantes.Dto.Postulante;
using Ingresantes.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class PostulanteController : ControllerBase
{

    private readonly IPostulanteService _service;

    public PostulanteController(IPostulanteService service)
    {
        _service = service;
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<RespuestaPostulanteDto>> Create([FromBody] CrearPostulanteDto dto)
    {
        var result = await _service.CrearPostulanteAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RespuestaPostulanteDto>> GetById(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet("{dni}/legajo")]
    [Authorize]
    public async Task<ActionResult<LegajoPostulanteDto>> GetLegajoByDni(string dni)
    {
        var result = await _service.GetLegajoAsync(dni);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<ListadoLegajoPostulanteDto>>> GetListado(
    [FromQuery] string? letra, [FromQuery] string? busqueda)
    {
        var result = await _service.GetListaLegajos(letra, busqueda);
        return Ok(result);
    }
}