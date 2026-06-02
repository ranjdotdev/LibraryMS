
using LibraryMS.Api.Models.DTOs;
using LibraryMS.Api.Models.Entities;

namespace LibraryMS.Api.Repositories.Interfaces;

public interface ICategoryRepository
{
  Task<List<CategoryDto>> GetAllAsync();
  Task<Category?> GetByIdAsync(Guid id);
  Task<int> GetBooksCountAsync(Guid id);
  Task AddAsync(Category category);
  Task SaveAsync();
}
