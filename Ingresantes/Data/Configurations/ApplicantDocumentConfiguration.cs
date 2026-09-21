using Ingresantes.Models;
using Ingresantes.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class ApplicantDocumentConfiguration : IEntityTypeConfiguration<Documentos>
{
    public void Configure(EntityTypeBuilder<Documentos> builder)
    {
        builder.Property(d => d.TipoDocumento).HasMaxLength(50).IsRequired();
        builder.Property(d => d.NombreDocumento).HasMaxLength(255).IsRequired();
        builder.Property(d => d.UrlArchivo).HasMaxLength(500).IsRequired();

        builder.HasOne<Postulante>()
            .WithMany(a => a.Documents)
            .HasForeignKey(d => d.PostulanteId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}