using Ingresantes.Data;
using Ingresantes.Models;
using Ingresantes.Models.Entities;
using Microsoft.EntityFrameworkCore;

public static class DataSeeder
{
    public static async Task SeedAsync(RrhhDbContext context)
    {
        await SeedTiposDocumentoAsync(context);
        await SeedAdminAsync(context);
        await SeedPuestosAsync(context);
    }

    private static async Task SeedTiposDocumentoAsync(RrhhDbContext context)
    {
        if (await context.TiposDocumento.AnyAsync()) return; // ya tiene datos, no duplicar

        var tipos = new List<TipoDocumentoConfig>
        {
            new() { Id = 1, Nombre = "Ficha de Personal", Requerido = true, Orden = 1, ExtensionesPermitidas = ".pdf", TamanoMaximoBytes = 10_000_000 },
            new() { Id = 2, Nombre = "Certificado de Antecedentes Policiales", Requerido = true, Orden = 2, ExtensionesPermitidas = ".pdf", TamanoMaximoBytes = 10_000_000 },
            new() { Id = 3, Nombre = "Certificado de Antecedentes Judiciales", Requerido = true, Orden = 3, ExtensionesPermitidas = ".pdf", TamanoMaximoBytes = 10_000_000 },
            new() { Id = 4, Nombre = "Constancia de RETCC (solo R. Civil)", Requerido = false, Orden = 4, ExtensionesPermitidas = ".pdf", TamanoMaximoBytes = 10_000_000 },
            new() { Id = 5, Nombre = "Declaración Jurada de Domicilio", Requerido = true, Orden = 5, ExtensionesPermitidas = ".pdf", TamanoMaximoBytes = 10_000_000 },
            new() { Id = 6, Nombre = "Declaración Jurada de Afiliación al Sistema de Pensiones", Requerido = true, Orden = 6, ExtensionesPermitidas = ".pdf", TamanoMaximoBytes = 10_000_000 },
            new() { Id = 7, Nombre = "Declaración Jurada de Beneficiarios Seguro Vida Ley", Requerido = true, Orden = 7, ExtensionesPermitidas = ".pdf", TamanoMaximoBytes = 10_000_000 },
            new() { Id = 8, Nombre = "Acta de Matrimonio o Reconocimiento de Unión de Hecho + DNI de cónyuge", Requerido = false, Orden = 8, ExtensionesPermitidas = ".pdf", TamanoMaximoBytes = 10_000_000 },
            new() { Id = 9, Nombre = "Certificado de Estudios de hijos (solo R. Civil)", Requerido = false, Orden = 9, ExtensionesPermitidas = ".pdf", TamanoMaximoBytes = 10_000_000 },
            new() { Id = 10, Nombre = "Copia de DNI", Requerido = true, Orden = 10, ExtensionesPermitidas = ".pdf,.jpg,.png", TamanoMaximoBytes = 5_000_000 },
            new() { Id = 11, Nombre = "Certificado de Antecedentes Penales", Requerido = true, Orden = 11, ExtensionesPermitidas = ".pdf", TamanoMaximoBytes = 10_000_000 },
            // completá los 5 restantes con los nombres reales que ya tenés en TIPOS_DOCUMENTO del frontend
        };

        context.TiposDocumento.AddRange(tipos);
        await context.SaveChangesAsync();
    }

    private static async Task SeedAdminAsync(RrhhDbContext context)
    {
        if (await context.Users.AnyAsync()) return; // ya existe al menos un usuario

        var admin = new User
        {
            Id = Guid.NewGuid(),
            Nombre = "Administrador",
            Email = "admin@ingresantes.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"), // cambiar tras el primer login
            Rol = "Admin",
           // Activo = true
        };

        context.Users.Add(admin);
        await context.SaveChangesAsync();
    }

    private static async Task SeedPuestosAsync(RrhhDbContext context)
    {
        if (await context.Puestos.AnyAsync()) return;

        var puestos = new List<Puesto>
        {
            new() { Id = Guid.NewGuid(), Nombre = "Desarrollador .NET", Departamento = "Tecnología", Modalidad = "Híbrido", Estado = "Abierta" },
            new() { Id = Guid.NewGuid(), Nombre = "Analista de RRHH", Departamento = "Recursos Humanos", Modalidad = "Presencial", Estado = "Abierta" },
            new() { Id = Guid.NewGuid(), Nombre = "Diseñador UX/UI", Departamento = "Producto", Modalidad = "Remoto", Estado = "Abierta" },
        };

        context.Puestos.AddRange(puestos);
        await context.SaveChangesAsync();
    }
}