using LibraryMS.Api.Infrastructure.Persistence;
using LibraryMS.Api.Models.DTOs;
using LibraryMS.Api.Models.Entities;
using LibraryMS.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LibraryMS.Api.Repositories;

public class CategoryRepository : ICategoryRepository
{
  private readonly AppDbContext _db;

  public CategoryRepository(AppDbContext db) => _db = db;

  public async Task<List<CategoryDto>> GetAllAsync() => await _db.Categories
      .Select(c => new CategoryDto(
        c.Id,
        c.Name,
        c.Books.Count()
      ))
      .ToListAsync();

  public async Task<Category?> GetByIdAsync(Guid id) => await _db.Categories.FindAsync(id);

  public async Task<int> GetBooksCountAsync(Guid id) => await _db.Books.CountAsync(b => b.CategoryId == id);

  public async Task AddAsync(Category category) => await _db.Categories.AddAsync(category);

  public async Task SaveAsync() => await _db.SaveChangesAsync();
}
