using Microsoft.AspNetCore.Mvc;
using Ingresantes.Dto;
using Ingresantes.Dto.Postulaciones;
using Ingresantes.Services;
using Ingresantes.Models;
using Microsoft.AspNetCore.RateLimiting;

[ApiController]
[Route("api/[controller]")]
public class PostulacionController : ControllerBase
{
    
    private readonly IPostulacionService _postulacionService;

    public PostulacionController(IPostulacionService postulacionService)
    {
        _postulacionService = postulacionService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PostulacionRespuestaDto>>> GetAll(
        bool soloActivos = false
        //[FromQuery] Guid puestoId, [FromQuery] string? estado
    )
    {
        var result = await _postulacionService.GetAllAsync(soloActivos);//puestoId, estado);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<PostulacionRespuestaDto>> Create([FromBody] CrearPostulacionesDto dto)
    {
        var result = await _postulacionService.crearPostulacion(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id}, result);
    }

    [HttpPost("ingreso")]
    [EnableRateLimiting("IngresoPolicy")]
    public async Task<ActionResult<PostulacionRespuestaDto>> Ingreso([FromBody] IngresoDto dto)
    {
        var result = await _postulacionService.VerificarAccesoAsync(dto.numeroDocumento, dto.codigoAcceso);
        return result is null ? NotFound("Código o documento inválido.") : Ok(result);
    } 

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PostulacionRespuestaDto>> GetById(Guid id)
    {
        var result = await _postulacionService.GetByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPatch("{id:guid}/estado")]
    public async Task<IActionResult> ActualizarEstado(Guid id, [FromBody] EstadoPostulacion dto)
    {
        var actualizado = await _postulacionService.UpdateStatusAsync(id, dto);
        return actualizado ? NoContent() : NotFound();
    }

}