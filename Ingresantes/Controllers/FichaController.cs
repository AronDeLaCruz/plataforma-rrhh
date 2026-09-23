using Ingresantes.Dto.Ficha;
using Ingresantes.Services;
using Microsoft.AspNetCore.Authorization;
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

    [HttpPost("{id:guid}/ficha")]
    [Authorize(Policy = "SoloPostulante")]
    public async Task<ActionResult<FichaRespuestaDto>> Create(Guid id, [FromBody] CrearFichaDto dto)
    {
        var postulanteIdDelToken = User.FindFirst("PostulanteId")?.Value;

        if (postulanteIdDelToken != id.ToString())
            return Forbid(); // el token es válido, pero no es SU perfil

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