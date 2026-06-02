using LibraryMS.Api.Common;
using LibraryMS.Api.Models.DTOs;
using LibraryMS.Api.Models.Entities;
using LibraryMS.Api.Repositories.Interfaces;
using LibraryMS.Api.Services.Interfaces;

namespace LibraryMS.Api.Services;

public class CategoryService : ICategoryService
{
  private readonly ICategoryRepository _categories;
  private readonly ILogger<CategoryService> _logger;

  public CategoryService(ICategoryRepository categories, ILogger<CategoryService> logger)
  {
    _categories = categories;
    _logger = logger;
  }

  public async Task<Result<List<CategoryDto>>> GetAllAsync()
      => Result<List<CategoryDto>>.Ok(await _categories.GetAllAsync());

  public async Task<Result<CategoryDto>> CreateAsync(CreateCategoryDto dto)
  {
    var category = new Category { Name = dto.Name };
    await _categories.AddAsync(category);
    await _categories.SaveAsync();

    _logger.LogInformation("Category {CategoryId} '{Name}' created.", category.Id, category.Name);
    return Result<CategoryDto>.Ok(new CategoryDto(category.Id, category.Name, 0));
  }

  public async Task<Result<CategoryDto>> UpdateAsync(Guid id, UpdateCategoryDto dto)
  {
    var category = await _categories.GetByIdAsync(id);
    if (category is null) return Result<CategoryDto>.Fail("Category not found.");

    category.Name = dto.Name;
    await _categories.SaveAsync();

    var booksCount = await _categories.GetBooksCountAsync(id);
    _logger.LogInformation("Category {CategoryId} updated.", id);
    return Result<CategoryDto>.Ok(new CategoryDto(category.Id, category.Name, booksCount));
  }

  public async Task<Result> DeleteAsync(Guid id)
  {
    var category = await _categories.GetByIdAsync(id);
    if (category is null) return Result.Fail("Category not found.");

    category.IsDeleted = true;
    await _categories.SaveAsync();

    _logger.LogInformation("Category {CategoryId} soft-deleted.", id);
    return Result.Ok();
  }
}
