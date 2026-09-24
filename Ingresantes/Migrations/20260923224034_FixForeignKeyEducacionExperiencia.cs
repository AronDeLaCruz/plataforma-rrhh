using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ingresantes.Migrations
{
    /// <inheritdoc />
    public partial class FixForeignKeyEducacionExperiencia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Educacion_Postulacion_Id",
                table: "Educacion");

            migrationBuilder.CreateIndex(
                name: "IX_Educacion_PostulacionId",
                table: "Educacion",
                column: "PostulacionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Educacion_Postulacion_PostulacionId",
                table: "Educacion",
                column: "PostulacionId",
                principalTable: "Postulacion",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Educacion_Postulacion_PostulacionId",
                table: "Educacion");

            migrationBuilder.DropIndex(
                name: "IX_Educacion_PostulacionId",
                table: "Educacion");

            migrationBuilder.AddForeignKey(
                name: "FK_Educacion_Postulacion_Id",
                table: "Educacion",
                column: "Id",
                principalTable: "Postulacion",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
