using Microsoft.AspNetCore.Http;

namespace Ingresantes.Services
{
    public class FileStorageService : IFileStorageService
    {   
        private readonly string _basePath;
        private readonly string _baseUrl;

        public FileStorageService(IConfiguration configuration, IWebHostEnvironment env)
        {
            // Carpeta física donde se guardan los archivos
            _basePath = Path.Combine(env.ContentRootPath, configuration["FileStorage:LocalPath"] ?? "UploadedFiles");
            _baseUrl = configuration["FileStorage:BaseUrl"] ?? "/files";

            if (!Directory.Exists(_basePath))
                Directory.CreateDirectory(_basePath);
        }

        public async Task<string> UploadAsync(IFormFile file, string folder)
        {
            var folderPath = Path.Combine(_basePath, folder);
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            // Nombre único para evitar sobrescribir archivos con el mismo nombre
            var extension = Path.GetExtension(file.FileName);
            var uniqueFileName = $"{Guid.NewGuid()}{extension}";
            var fullPath = Path.Combine(folderPath, uniqueFileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Devolvemos una URL relativa que se pueda usar para acceder al archivo después
            return $"{_baseUrl}/{folder}/{uniqueFileName}";
        }
    }

}