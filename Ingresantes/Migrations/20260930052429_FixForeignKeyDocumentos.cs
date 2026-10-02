using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ingresantes.Migrations
{
    /// <inheritdoc />
    public partial class FixForeignKeyDocumentos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_documentos_Postulacion_Id",
                table: "documentos");

            migrationBuilder.CreateIndex(
                name: "IX_documentos_PostulacionId",
                table: "documentos",
                column: "PostulacionId");

            migrationBuilder.AddForeignKey(
                name: "FK_documentos_Postulacion_PostulacionId",
                table: "documentos",
                column: "PostulacionId",
                principalTable: "Postulacion",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_documentos_Postulacion_PostulacionId",
                table: "documentos");

            migrationBuilder.DropIndex(
                name: "IX_documentos_PostulacionId",
                table: "documentos");

            migrationBuilder.AddForeignKey(
                name: "FK_documentos_Postulacion_Id",
                table: "documentos",
                column: "Id",
                principalTable: "Postulacion",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
