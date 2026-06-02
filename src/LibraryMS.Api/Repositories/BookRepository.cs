using LibraryMS.Api.Common;
using LibraryMS.Api.Infrastructure.Persistence;
using LibraryMS.Api.Models.DTOs;
using LibraryMS.Api.Models.Entities;
using LibraryMS.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LibraryMS.Api.Repositories;

public class BookRepository : IBookRepository
{
  private readonly AppDbContext _db;

  public BookRepository(AppDbContext db) => _db = db;

  public async Task<PagedList<BookDto>> GetAllAsync(BookQueryDto query)
  {
    var q = _db.Books.AsQueryable();

    if (!string.IsNullOrWhiteSpace(query.Search))
      q = q.Where(b => b.Title.Contains(query.Search)
                     || b.Author.Contains(query.Search));

    if (query.CategoryId.HasValue)
      q = q.Where(b => b.CategoryId == query.CategoryId);

    if (query.Available.HasValue)
    {
      q = query.Available.Value
          ? q.Where(b =>
              b.TotalCopies > b.BorrowingRecords.Count(br => br.ReturnedAt == null))
          : q.Where(b =>
              b.TotalCopies <= b.BorrowingRecords.Count(br => br.ReturnedAt == null));
    }

    var totalCount = await q.CountAsync();

    var items = await q
        .OrderBy(b => b.Title)
        .Skip((query.Page - 1) * query.PageSize)
        .Take(query.PageSize)
        .Select(b => new BookDto(
            b.Id,
            b.Title,
            b.Author,
            b.CategoryId,
            b.Category.Name,
            b.TotalCopies,
            b.BorrowingRecords.Count(br => br.ReturnedAt == null),
            b.CreatedAt
        ))
        .ToListAsync();

    return new PagedList<BookDto>
    {
      Items = items,
      Page = query.Page,
      PageSize = query.PageSize,
      TotalCount = totalCount
    };
  }

  public async Task<Book?> GetByIdAsync(Guid id)
      => await _db.Books
          .Include(b => b.Category)
          .Include(b => b.BorrowingRecords)
          .FirstOrDefaultAsync(b => b.Id == id);

  public async Task AddAsync(Book book) => await _db.Books.AddAsync(book);

  public async Task SaveAsync() => await _db.SaveChangesAsync();
}
