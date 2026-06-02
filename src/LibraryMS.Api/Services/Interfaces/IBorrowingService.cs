using LibraryMS.Api.Common;
using LibraryMS.Api.Models.DTOs;

namespace LibraryMS.Api.Services.Interfaces;

public interface IBorrowingService
{
  Task<Result<PagedList<BorrowingDto>>> GetAllAsync(BorrowingQueryDto query);
  Task<Result<PagedList<BorrowingDto>>> GetMyBorrowingsAsync(Guid userId, BorrowingQueryDto query);
  Task<Result<BorrowingDto>> IssueAsync(IssueBookDto dto);
  Task<Result<BorrowingDto>> ReturnAsync(Guid recordId);
}
