using LibraryMS.Api.Common;
using LibraryMS.Api.Models.DTOs;
using LibraryMS.Api.Models.Entities;
using LibraryMS.Api.Repositories.Interfaces;
using LibraryMS.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LibraryMS.Api.Services;

public class BookService : IBookService
{
  private readonly IBookRepository _books;
  private readonly ICategoryRepository _categories;
  private readonly ILogger<BookService> _logger;

  public BookService(
      IBookRepository books,
      ICategoryRepository categories,
      ILogger<BookService> logger)
  {
    _books = books;
    _categories = categories;
    _logger = logger;
  }

  public async Task<Result<PagedList<BookDto>>> GetAllAsync(BookQueryDto query)
      => Result<PagedList<BookDto>>.Ok(await _books.GetAllAsync(query));

  public async Task<Result<BookDto>> GetByIdAsync(Guid id)
  {
    var book = await _books.GetByIdAsync(id);
    return book is null
      ? Result<BookDto>.Fail("Book not found.")
      : Result<BookDto>.Ok(ToDto(book));
  }

  public async Task<Result<BookDto>> CreateAsync(CreateBookDto dto)
  {
    var category = await _categories.GetByIdAsync(dto.CategoryId);
    if (category is null) return Result<BookDto>.Fail("Category not found.");

    var book = new Book
    {
      Title = dto.Title,
      Author = dto.Author,
      CategoryId = dto.CategoryId,
      TotalCopies = dto.TotalCopies,
    };

    await _books.AddAsync(book);
    await _books.SaveAsync();

    _logger.LogInformation("Book {BookId} '{Title}' created with {TotalCopies} copies.", book.Id, book.Title, book.TotalCopies);

    book.Category = category;

    return Result<BookDto>.Ok(ToDto(book));
  }

  public async Task<Result<BookDto>> UpdateAsync(Guid id, UpdateBookDto dto)
  {
    var book = await _books.GetByIdAsync(id);
    if (book is null) return Result<BookDto>.Fail("Book not found.");

    var category = await _categories.GetByIdAsync(dto.CategoryId);
    if (category is null) return Result<BookDto>.Fail("Category not found.");

    book.Title = dto.Title;
    book.Author = dto.Author;
    book.CategoryId = dto.CategoryId;
    book.Category = category;
    book.TotalCopies = dto.TotalCopies;

    try
    {
      await _books.SaveAsync();
      _logger.LogInformation("Book {BookId} updated.", id);
    }
    catch (DbUpdateConcurrencyException)
    {


      _logger.LogWarning(
          "Concurrency conflict on Book {BookId} update. Second writer rejected.", id);
      return Result<BookDto>.Fail(
          "This book was modified by another user. Please refresh and try again.");
    }

    return Result<BookDto>.Ok(ToDto(book));
  }

  public async Task<Result> DeleteAsync(Guid id)
  {
    var book = await _books.GetByIdAsync(id);
    if (book is null) return Result.Fail("Book not found.");

    book.IsDeleted = true;
    await _books.SaveAsync();

    _logger.LogInformation("Book {BookId} soft-deleted.", id);
    return Result.Ok();
  }

  private static BookDto ToDto(Book b) => new(
      b.Id, b.Title, b.Author,
      b.CategoryId, b.Category.Name,
      b.TotalCopies,
      ActiveBorrows: b.BorrowingRecords.Count(br => br.ReturnedAt == null),
      b.CreatedAt);
}
