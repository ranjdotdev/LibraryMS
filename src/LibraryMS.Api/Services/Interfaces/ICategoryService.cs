using LibraryMS.Api.Common;
using LibraryMS.Api.Models.DTOs;

namespace LibraryMS.Api.Services.Interfaces;

public interface ICategoryService
{
  Task<Result<List<CategoryDto>>> GetAllAsync();
  Task<Result<CategoryDto>> CreateAsync(CreateCategoryDto dto);
  Task<Result<CategoryDto>> UpdateAsync(Guid id, UpdateCategoryDto dto);
  Task<Result> DeleteAsync(Guid id);
}
