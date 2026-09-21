using Ingresantes.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class ApplicationConfiguration : IEntityTypeConfiguration<Postulacion>
{
    public void Configure(EntityTypeBuilder<Postulacion> builder)
    {
        builder.Property(a => a.Estado)
            .HasConversion<string>()   // guarda el enum como texto legible en la BD, no como int
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(a => a.SalarioPretendido).HasColumnType("decimal(10,2)");
        builder.Property(a => a.FuenteReclutamiento).HasMaxLength(50);

        // Evita que el mismo postulante aplique dos veces a la misma vacante,
        // reforzando a nivel de BD lo que ya validamos en el service
        builder.HasIndex(a => new { a.IdPostulante, a.IdPuesto }).IsUnique();

        builder.HasOne(a => a.Postulante)
            .WithMany(ap => ap.Applications)
            .HasForeignKey(a => a.IdPostulante)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(a => a.Puesto)
            .WithMany(v => v.Applications)
            .HasForeignKey(a => a.IdPuesto)
            .OnDelete(DeleteBehavior.Restrict);
    }
}