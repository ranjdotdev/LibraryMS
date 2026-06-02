
using LibraryMS.Api.Common;
using LibraryMS.Api.Models.DTOs;

namespace LibraryMS.Api.Services.Interfaces;

public interface IBookService
{
  Task<Result<PagedList<BookDto>>> GetAllAsync(BookQueryDto query);
  Task<Result<BookDto>> GetByIdAsync(Guid id);
  Task<Result<BookDto>> CreateAsync(CreateBookDto createBookDto);
  Task<Result<BookDto>> UpdateAsync(Guid id, UpdateBookDto updateBookDto);
  Task<Result> DeleteAsync(Guid id);
}
