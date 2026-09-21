


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
}