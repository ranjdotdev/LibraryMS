using LibraryMS.Api.Common;
using LibraryMS.Api.Models.DTOs;
using LibraryMS.Api.Models.Entities;
using LibraryMS.Api.Repositories.Interfaces;
using LibraryMS.Api.Services.Interfaces;

namespace LibraryMS.Api.Services;

public class BorrowingService : IBorrowingService
{
  private readonly IBorrowingRepository _borrowings;
  private readonly IBookRepository _books;
  private readonly IUserRepository _users;
  private readonly ILogger<BorrowingService> _logger;

  public BorrowingService(
      IBorrowingRepository borrowings,
      IBookRepository books,
      IUserRepository users,
      ILogger<BorrowingService> logger)
  {
    _borrowings = borrowings;
    _books = books;
    _users = users;
    _logger = logger;
  }

  public async Task<Result<PagedList<BorrowingDto>>> GetAllAsync(BorrowingQueryDto query)
      => Result<PagedList<BorrowingDto>>.Ok(await _borrowings.GetAllAsync(query));

  public async Task<Result<PagedList<BorrowingDto>>> GetMyBorrowingsAsync(Guid userId, BorrowingQueryDto query)
      => Result<PagedList<BorrowingDto>>.Ok(await _borrowings.GetByUserAsync(userId, query));

  public async Task<Result<BorrowingDto>> IssueAsync(IssueBookDto dto)
  {
    var user = await _users.GetByIdAsync(dto.UserId);
    if (user is null) return Result<BorrowingDto>.Fail("User not found.");

    var book = await _books.GetByIdAsync(dto.BookId);
    if (book is null) return Result<BorrowingDto>.Fail("Book not found.");

    var activeCount = await _borrowings.GetActiveCountByBookAsync(dto.BookId);
    if (activeCount >= book.TotalCopies)
      return Result<BorrowingDto>.Fail("No copies currently available.");

    var record = new BorrowingRecord
    {
      UserId = dto.UserId,
      BookId = dto.BookId,
      BorrowedAt = DateTime.UtcNow,
      DueAt = DateTime.UtcNow.AddDays(dto.DueDays)
    };

    await _borrowings.AddAsync(record);
    await _borrowings.SaveAsync();

    _logger.LogInformation("Book {BookId} issued to user {UserId}.", dto.BookId, dto.UserId);

    return Result<BorrowingDto>.Ok(new BorrowingDto(
        record.Id,
        record.BookId,
        book.Title,
        record.UserId,
        user.FullName,
        record.BorrowedAt,
        record.DueAt,
        null,
        false,
        0,
        0));
  }

  public async Task<Result<BorrowingDto>> ReturnAsync(Guid recordId)
  {
    var record = await _borrowings.GetByIdAsync(recordId);
    if (record is null) return Result<BorrowingDto>.Fail("Borrowing record not found.");
    if (record.ReturnedAt is not null) return Result<BorrowingDto>.Fail("Book already returned.");

    var returnedAt = DateTime.UtcNow;
    var isOverdue = returnedAt > record.DueAt;

    var allowedDays = Math.Max(1, (int)Math.Round((record.DueAt - record.BorrowedAt).TotalDays));
    var actualDays = (int)Math.Floor((returnedAt - record.BorrowedAt).TotalDays);
    var daysEarly = Math.Max(0, allowedDays - actualDays);

    record.ReturnedAt = returnedAt;
    record.IsOverdue = isOverdue;
    record.RewardCredit = isOverdue ? 0 : (int)Math.Ceiling(10.0 * daysEarly / allowedDays);

    if (isOverdue)
      record.FineAmount = Math.Round(0.5m * (decimal)(returnedAt - record.DueAt).TotalDays, 2);

    await _borrowings.SaveAsync();

    _logger.LogInformation("Book {BookId} returned by user {UserId}.", record.BookId, record.UserId);

    return Result<BorrowingDto>.Ok(new BorrowingDto(
        record.Id,
        record.BookId,
        record.Book.Title,
        record.UserId,
        record.User.FullName,
        record.BorrowedAt,
        record.DueAt,
        record.ReturnedAt,
        record.IsOverdue,
        record.FineAmount,
        record.RewardCredit
        ));
  }
}
