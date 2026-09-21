using Microsoft.EntityFrameworkCore;
using Ingresantes.Models;
using Ingresantes.Models.Entities;

namespace Ingresantes.Data
{
    
    public class RrhhDbContext: DbContext
    {
        public RrhhDbContext(DbContextOptions<RrhhDbContext> options) : base(options){}
    
        public DbSet<Postulante> Postulantes => Set<Postulante>();
        public DbSet<Puesto> Puestos => Set<Puesto>();
        public DbSet<Postulacion> Postulacion => Set<Postulacion>();
        public DbSet<Experiencia> Experiencias => Set<Experiencia>();
        public DbSet<Educacion> Educacion => Set<Educacion>();
        public DbSet<Documentos> documentos => Set<Documentos>();
        public DbSet<Ficha> fichas => Set<Ficha>();
        public DbSet<User> Users => Set<User>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(RrhhDbContext).Assembly);
            //base.OnModelCreating(modelBuilder);
        
        }

    }
}