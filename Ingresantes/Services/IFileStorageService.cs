namespace Ingresantes.Services
{
    public interface IFileStorageService
    {
        Task<string> UploadAsync(IFormFile file, string folder);
    }
}