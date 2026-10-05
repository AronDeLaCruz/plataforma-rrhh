using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ingresantes.Migrations
{
    /// <inheritdoc />
    public partial class AgregarTiposDocumentoConfigurables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Activo",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "TiposDocumento",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Requerido = table.Column<bool>(type: "bit", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    Orden = table.Column<int>(type: "int", nullable: false),
                    ExtensionesPermitidas = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    TamanoMaximoBytes = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TiposDocumento", x => x.Id);
                }
            );

            migrationBuilder.CreateIndex(
                name: "IX_TiposDocumento_Orden",
                table: "TiposDocumento",
                column: "Orden"
            );

            migrationBuilder.InsertData(
                table: "TiposDocumento",
                columns: new[] { "Id", "Nombre", "Requerido", "Activo", "Orden", "ExtensionesPermitidas", "TamanoMaximoBytes" },
                values: new object[,]
                {
                    { 1,  "Ficha de Personal", true, true, 1, ".pdf", 10_000_000L },
                    { 2,  "Certificado de Antecedentes Policiales", true, true, 2, ".pdf", 10_000_000L },
                    { 3,  "Certificado de Antecedentes Judiciales", true, true, 3, ".pdf", 10_000_000L },
                    { 4,  "Constancia de RETCC (solo R. Civil)", false, true, 4, ".pdf", 10_000_000L },
                    { 5,  "Declaración Jurada de Domicilio", true, true, 5, ".pdf", 10_000_000L },
                    { 6,  "Declaración Jurada de Afiliación al Sistema de Pensiones", true, true, 6, ".pdf", 10_000_000L },
                    { 7,  "Declaración Jurada de Beneficiarios Seguro Vida Ley", true, true, 7, ".pdf", 10_000_000L },
                    { 8,  "Acta de Matrimonio o Reconocimiento de Unión de Hecho + DNI de cónyuge", false, true, 8, ".pdf", 10_000_000L },
                    { 9,  "Certificado de Estudios de hijos (solo R. Civil)", false, true, 9, ".pdf", 10_000_000L },
                    { 10, "Copia de DNI", true, true, 10, ".pdf,.jpg,.png", 5_000_000L },
                    { 11, "Certificado de Antecedentes Penales", true, true, 11, ".pdf", 10_000_000L },
                    { 12, "Curriculum Vitae con certificados de trabajos anteriores", true, true, 12, ".pdf", 10_000_000L },
                    { 13, "Certificado de Retención de Quinta Categoría", false, true, 13, ".pdf", 10_000_000L },
                    { 14, "DNI de cada Hijo Menor de Edad | Partida de Nacimiento hijos Mayores", false, true, 14, ".pdf,.jpg,.png", 5_000_000L },
                    { 15, "Constancia firmada / entrega Boletín informativo SPP/SNP", true, true, 15, ".pdf", 10_000_000L },
                    { 16, "Voucher Número de Cuenta", false, true, 16, ".pdf,.jpg,.png", 5_000_000L },
                }

            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TiposDocumento");

            migrationBuilder.DropColumn(
                name: "Activo",
                table: "Users");
        }
    }
}
