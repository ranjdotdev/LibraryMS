using LibraryMS.Api.Common;
using LibraryMS.Api.Models.DTOs;
using LibraryMS.Api.Models.Entities;

namespace LibraryMS.Api.Repositories.Interfaces;

public interface IBookRepository
{
  Task<PagedList<BookDto>> GetAllAsync(BookQueryDto query);
  Task<Book?> GetByIdAsync(Guid id);
  Task AddAsync(Book book);
  Task SaveAsync();
}
