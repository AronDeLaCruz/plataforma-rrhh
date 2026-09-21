using Ingresantes.Models;
using Ingresantes.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class EducationHistoryConfiguration: IEntityTypeConfiguration<Educacion>
{
    public void Configure(EntityTypeBuilder<Educacion> builder)
    {
         builder.Property(e => e.Institucion).HasMaxLength(150).IsRequired();
        builder.Property(e => e.TituloObtenido).HasMaxLength(150).IsRequired();
        builder.Property(e => e.NivelEducativo).HasMaxLength(50).IsRequired();

        builder.HasOne<Postulante>()
            .WithMany(a => a.Education)
            .HasForeignKey(e => e.PostulanteId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}