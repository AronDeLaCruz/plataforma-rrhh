using Ingresantes.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class VacancyConfiguration : IEntityTypeConfiguration<Puesto>
{
    public void Configure(EntityTypeBuilder<Puesto> builder)
    {
        builder.Property(v => v.Nombre).HasMaxLength(150).IsRequired();
        builder.Property(v => v.Descripcion).HasMaxLength(500).IsRequired();
        //builder.Property(v => v.Departamento).HasMaxLength(100).IsRequired();
        //builder.Property(v => v.Modalidad).HasMaxLength(50).IsRequired();
        builder.Property(v => v.Estado).HasMaxLength(20).HasDefaultValue("Abierta");

        builder.HasIndex(v => v.Estado);
    }
}