using LibraryMS.Api.Common;
using LibraryMS.Api.Infrastructure.Persistence;
using LibraryMS.Api.Models.DTOs;
using LibraryMS.Api.Models.Entities;
using LibraryMS.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LibraryMS.Api.Repositories;

public class BorrowingRepository : IBorrowingRepository
{
  private readonly AppDbContext _db;

  public BorrowingRepository(AppDbContext db) => _db = db;

  public async Task<PagedList<BorrowingDto>> GetAllAsync(BorrowingQueryDto query)
  {
    var q = _db.BorrowingRecords.AsQueryable();
    var totalCount = await q.CountAsync();
    var items = await q
        .OrderByDescending(br => br.BorrowedAt)
        .Skip((query.Page - 1) * query.PageSize)
        .Take(query.PageSize)
        .Select(MapToDto)
        .ToListAsync();
    return new PagedList<BorrowingDto>
    {
      Items = items,
      Page = query.Page,
      PageSize = query.PageSize,
      TotalCount = totalCount
    };
  }

  public async Task<PagedList<BorrowingDto>> GetByUserAsync(Guid userId, BorrowingQueryDto query)
  {
    var q = _db.BorrowingRecords.Where(br => br.UserId == userId);
    var totalCount = await q.CountAsync();
    var items = await q
        .OrderByDescending(br => br.BorrowedAt)
        .Skip((query.Page - 1) * query.PageSize)
        .Take(query.PageSize)
        .Select(MapToDto)
        .ToListAsync();
    return new PagedList<BorrowingDto>
    {
      Items = items,
      Page = query.Page,
      PageSize = query.PageSize,
      TotalCount = totalCount
    };
  }

  public async Task<BorrowingRecord?> GetByIdAsync(Guid id)
      => await _db.BorrowingRecords
          .Include(br => br.Book)
          .Include(br => br.User)
          .FirstOrDefaultAsync(br => br.Id == id);

  public async Task<List<BorrowingRecord>> GetOverdueActiveAsync()
      => await _db.BorrowingRecords
          .Where(br => br.ReturnedAt == null
                    && br.DueAt < DateTime.UtcNow
                    && !br.IsOverdue)
          .ToListAsync();

  public async Task<int> GetActiveCountByBookAsync(Guid bookId)
      => await _db.BorrowingRecords
          .CountAsync(br => br.BookId == bookId && br.ReturnedAt == null);

  public async Task<int> GetTotalCreditAsync(Guid userId)
      => await _db.BorrowingRecords
          .Where(br => br.UserId == userId)
          .SumAsync(br => br.RewardCredit);

  public async Task AddAsync(BorrowingRecord record)
      => await _db.BorrowingRecords.AddAsync(record);

  public async Task SaveAsync() => await _db.SaveChangesAsync();

  private static System.Linq.Expressions.Expression<Func<BorrowingRecord, BorrowingDto>>
      MapToDto => br => new BorrowingDto(
          br.Id,
          br.BookId,
          br.Book.Title,
          br.UserId,
          br.User.FullName,
          br.BorrowedAt,
          br.DueAt,
          br.ReturnedAt,
          br.IsOverdue,
          br.FineAmount,
          br.RewardCredit
      );
}
