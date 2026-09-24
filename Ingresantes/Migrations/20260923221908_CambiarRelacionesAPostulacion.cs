using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ingresantes.Migrations
{
    /// <inheritdoc />
    public partial class CambiarRelacionesAPostulacion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_documentos_Postulantes_PostulanteId",
                table: "documentos");

            migrationBuilder.DropForeignKey(
                name: "FK_Educacion_Postulantes_PostulanteId",
                table: "Educacion");

            migrationBuilder.DropForeignKey(
                name: "FK_Experiencias_Postulantes_PostulanteId",
                table: "Experiencias");

            migrationBuilder.AlterColumn<Guid>(
                name: "PostulanteId",
                table: "Experiencias",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<Guid>(
                name: "PostulacionId",
                table: "Experiencias",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AlterColumn<Guid>(
                name: "PostulanteId",
                table: "Educacion",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<Guid>(
                name: "PostulacionId",
                table: "Educacion",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AlterColumn<Guid>(
                name: "PostulanteId",
                table: "documentos",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<Guid>(
                name: "PostulacionId",
                table: "documentos",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddForeignKey(
                name: "FK_documentos_Postulacion_Id",
                table: "documentos",
                column: "Id",
                principalTable: "Postulacion",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_documentos_Postulantes_PostulanteId",
                table: "documentos",
                column: "PostulanteId",
                principalTable: "Postulantes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Educacion_Postulacion_Id",
                table: "Educacion",
                column: "Id",
                principalTable: "Postulacion",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Educacion_Postulantes_PostulanteId",
                table: "Educacion",
                column: "PostulanteId",
                principalTable: "Postulantes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Experiencias_Postulantes_PostulanteId",
                table: "Experiencias",
                column: "PostulanteId",
                principalTable: "Postulantes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_documentos_Postulacion_Id",
                table: "documentos");

            migrationBuilder.DropForeignKey(
                name: "FK_documentos_Postulantes_PostulanteId",
                table: "documentos");

            migrationBuilder.DropForeignKey(
                name: "FK_Educacion_Postulacion_Id",
                table: "Educacion");

            migrationBuilder.DropForeignKey(
                name: "FK_Educacion_Postulantes_PostulanteId",
                table: "Educacion");

            migrationBuilder.DropForeignKey(
                name: "FK_Experiencias_Postulantes_PostulanteId",
                table: "Experiencias");

            migrationBuilder.DropColumn(
                name: "PostulacionId",
                table: "Experiencias");

            migrationBuilder.DropColumn(
                name: "PostulacionId",
                table: "Educacion");

            migrationBuilder.DropColumn(
                name: "PostulacionId",
                table: "documentos");

            migrationBuilder.AlterColumn<Guid>(
                name: "PostulanteId",
                table: "Experiencias",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "PostulanteId",
                table: "Educacion",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "PostulanteId",
                table: "documentos",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_documentos_Postulantes_PostulanteId",
                table: "documentos",
                column: "PostulanteId",
                principalTable: "Postulantes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Educacion_Postulantes_PostulanteId",
                table: "Educacion",
                column: "PostulanteId",
                principalTable: "Postulantes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Experiencias_Postulantes_PostulanteId",
                table: "Experiencias",
                column: "PostulanteId",
                principalTable: "Postulantes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
