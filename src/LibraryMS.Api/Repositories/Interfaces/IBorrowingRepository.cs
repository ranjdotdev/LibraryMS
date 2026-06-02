using LibraryMS.Api.Common;
using LibraryMS.Api.Models.DTOs;
using LibraryMS.Api.Models.Entities;

namespace LibraryMS.Api.Repositories.Interfaces;

public interface IBorrowingRepository
{
  Task<PagedList<BorrowingDto>> GetAllAsync(BorrowingQueryDto query);
  Task<PagedList<BorrowingDto>> GetByUserAsync(Guid userId, BorrowingQueryDto query);
  Task<BorrowingRecord?> GetByIdAsync(Guid id);
  Task<List<BorrowingRecord>> GetOverdueActiveAsync();
  Task<int> GetActiveCountByBookAsync(Guid bookId);
  Task<int> GetTotalCreditAsync(Guid userId);
  Task AddAsync(BorrowingRecord record);
  Task SaveAsync();
}
