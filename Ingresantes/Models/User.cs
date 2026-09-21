namespace Ingresantes.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string PasswordHash { get; set; } = default!;
        public string Rol { get; set; } = "RRHH"; // RRHH, Admin
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    }
}