using Ingresantes.Data;
using Ingresantes.Dto.Puesto;
using Ingresantes.Models;
using Microsoft.EntityFrameworkCore;

namespace Ingresantes.Services
{
    public class PuestoService : IPuestoService
    {
        private readonly RrhhDbContext _context;

        public PuestoService(RrhhDbContext context)
        {
            _context = context;
        }

        public async Task<RespuestaPuestoDto> CreateAsync(CrearPuestoDto dto)
        {
            var vacancy = new Puesto
            {
                Id = Guid.NewGuid(),
                Nombre = dto.Titulo,
                Descripcion = dto.Descripcion, //dto.
                Requisitos = dto.Requerimiento,
                Departamento = dto.Departamento,
                Modalidad = dto.Modalidad,
                Estado = "Abierta"
            };

            _context.Puestos.Add(vacancy);
            await _context.SaveChangesAsync();

            return MapToDto(vacancy);
        }

        public async Task<RespuestaPuestoDto?> GetByIdAsync(Guid id)
        {
            var vacancy = await _context.Puestos.FindAsync(id);
            return vacancy is null ? null : MapToDto(vacancy);
        }

        public async Task<IEnumerable<RespuestaPuestoDto>> GetAllAsync(bool soloAbiertas = false)
        {
            var query = _context.Puestos.AsQueryable();

            if (soloAbiertas)
                query = query.Where(v => v.Estado == "Abierta");

            var vacancies = await query.ToListAsync();
            return vacancies.Select(MapToDto);
        }

        public async Task<bool> CloseAsync(Guid id)
        {
            var vacancy = await _context.Puestos.FindAsync(id);
            if (vacancy is null) return false;

            vacancy.Estado = "Cerrada";
            await _context.SaveChangesAsync();
            return true;
        }

        private static RespuestaPuestoDto MapToDto(Puesto puesto) =>
            new(puesto.Id, puesto.Nombre, puesto.Departamento, puesto.Modalidad, puesto.Estado);

    }
}