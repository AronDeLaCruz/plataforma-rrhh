using Ingresantes.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class FichaConfiguration : IEntityTypeConfiguration<Ficha>
{
    public void Configure(EntityTypeBuilder<Ficha> builder)
    {
        builder.Property(f => f.Sexo).HasMaxLength(2).IsRequired();
        builder.Property(f => f.EstadoCivil).HasMaxLength(2).IsRequired();
    }
}