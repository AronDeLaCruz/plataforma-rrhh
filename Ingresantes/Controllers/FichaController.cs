using Ingresantes.Dto.Ficha;
using Ingresantes.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class FichaController : ControllerBase
{
    private readonly IFichaService _fichaService;

    public FichaController(IFichaService fichaService)
    {
        _fichaService = fichaService;
    }

    [HttpPost]
    public async Task<ActionResult<FichaRespuestaDto>> Create([FromBody] CrearFichaDto dto)
    {
        var result = await _fichaService.subirFicha(dto);
        return CreatedAtAction(nameof(GetById), new {id = result.Id}, result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<FichaRespuestaDto>> GetById(Guid id)
    {
        var result = await _fichaService.GetByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }
}