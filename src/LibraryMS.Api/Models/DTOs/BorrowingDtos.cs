namespace LibraryMS.Api.Models.DTOs;

public record BorrowingDto(
    Guid Id,
    Guid BookId,
    string BookTitle,
    Guid UserId,
    string UserFullName,
    DateTime BorrowedAt,
    DateTime DueAt,
    DateTime? ReturnedAt,
    bool IsOverdue,
    decimal FineAmount,
    int RewardCredit
);

public record IssueBookDto(Guid BookId, Guid UserId, int DueDays);

public record BorrowingQueryDto(int Page = 1, int PageSize = 20);
