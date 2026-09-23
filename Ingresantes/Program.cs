using Ingresantes.Services;
using Ingresantes.Data;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using System.Text.Json.Serialization;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(options =>
{
   options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});
builder.Services.AddScoped<IPostulacionService, PostulacionService>();
builder.Services.AddScoped<IPuestoService, PuestoService>();
builder.Services.AddScoped<IPostulanteService, PostulanteService>();
builder.Services.AddScoped<IFileStorageService, FileStorageService>(); // o S3, o Local
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IFichaService, FichaService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
   .AddJwtBearer(options =>
   {
      options.TokenValidationParameters = new TokenValidationParameters
      {
         ValidateIssuer = true,
         ValidateAudience = true,
         ValidateLifetime = true,
         ValidateIssuerSigningKey = true,
         ValidIssuer = builder.Configuration["Jwt:Issuer"],
         ValidAudience = builder.Configuration["Jwt:Audience"],
         IssuerSigningKey = new SymmetricSecurityKey(
               Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
      };
   });

builder.Services.AddAuthorization(options =>
{
   options.AddPolicy("SoloAdmin", policy => policy.RequireRole("Admin"));
   options.AddPolicy("SoloPostulante", policy => policy.RequireClaim("PostulanteId"));
});

builder.Services.AddDbContext<RrhhDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))); 

builder.Services.AddFluentValidationAutoValidation();
//builder.Services.AddValidatorsFromAssemblyContaining<CreateApplicationDtoValidator>();

var frontEndUrls =builder.Configuration.GetSection("Frontend:Urls").Get<string[]>()
    ?? new[] { "http://localhost:5173" };

builder.Services.AddCors(options =>
{
   options.AddPolicy("FrontendPolicy", policy =>
   {
      policy.WithOrigins(frontEndUrls)
              .AllowAnyHeader()
              .AllowAnyMethod();
   });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "RRHH API - Postulantes", Version = "v1" });
});

builder.Services.AddAuthorization();

builder.Services.AddRateLimiter(options =>
{
   options.AddFixedWindowLimiter("IngresoPolicy", opt =>
   {
      opt.PermitLimit = 5;
      opt.Window = TimeSpan.FromMinutes(1);
      opt.QueueLimit = 0; // sin cola, rechaza directo al superar el límite
   });

   options.OnRejected = async (context, cancellationToken) =>
   {
      context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
      await context.HttpContext.Response.WriteAsJsonAsync(new
      {
         mensaje = "Demasiados intentos. Esperá un minuto antes de volver a intentar."
      }, cancellationToken);
   };
});

var app = builder.Build();

var uploadsPath = Path.Combine(builder.Environment.ContentRootPath, builder.Configuration["FileStorage:LocalPath"] ?? "UploadedFiles");

if (!Directory.Exists(uploadsPath))
    Directory.CreateDirectory(uploadsPath);

app.UseStaticFiles(new StaticFileOptions
{
   FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, builder.Configuration["FileStorage:LocalPath"] ?? "UploadedFiles")),
    RequestPath = builder.Configuration["FileStorage:BaseUrl"] ?? "/files"
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
   // app.MapOpenApi();
   app.UseSwagger();
   app.UseSwaggerUI();
}
app.UseCors("FrontendPolicy");

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.UseRateLimiter();

app.MapControllers();

app.Run();
