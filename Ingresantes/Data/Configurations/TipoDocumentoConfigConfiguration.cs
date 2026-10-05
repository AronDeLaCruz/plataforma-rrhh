using Ingresantes.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class TipoDocumentoConfigConfiguration : IEntityTypeConfiguration<TipoDocumentoConfig>
{
    public void Configure(EntityTypeBuilder<TipoDocumentoConfig> builder)
    {
        builder.Property(t => t.Nombre).HasMaxLength(150).IsRequired();
        builder.Property(t => t.ExtensionesPermitidas).HasMaxLength(200).IsRequired();
        builder.HasIndex(t => t.Orden);
    }
}