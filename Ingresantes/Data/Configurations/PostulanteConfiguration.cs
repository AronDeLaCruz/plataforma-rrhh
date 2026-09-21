using Ingresantes.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class PostulanteConfiguration : IEntityTypeConfiguration<Postulante>
{
    public void Configure(EntityTypeBuilder<Postulante> builder)
    {
        builder.HasIndex( a => a.DNI).IsUnique();///revisar si es necesario

    }
}