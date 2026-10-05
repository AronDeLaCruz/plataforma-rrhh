using Ingresantes.Dto.User;
using Ingresantes.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
[Authorize]//(Policy = "SoloAdmin")
public class UsuarioController : ControllerBase
{
    private readonly IUsuarioService _service;
    public UsuarioController(IUsuarioService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UsuarioResumenDto>>> GetAll() =>
        Ok(await _service.GetAllAsync());

    [HttpPost]
    public async Task<ActionResult<UsuarioResumenDto>> Create([FromBody] CrearUsuarioDto dto) =>
        Ok(await _service.CreateAsync(dto));

    [HttpPatch("{id:guid}/rol")]
    public async Task<IActionResult> CambiarRol(Guid id, [FromBody] CambiarRolDto dto) =>
        await _service.CambiarRolAsync(id, dto.NuevoRol) ? NoContent() : NotFound();

    [HttpPatch("{id:guid}/estado")]
    public async Task<IActionResult> CambiarEstado(Guid id, [FromBody] bool activo) =>
        await _service.CambiarEstadoAsync(id, activo) ? NoContent() : NotFound();
}