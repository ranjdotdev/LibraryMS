namespace LibraryMS.Api.Models.Entities;

public class BorrowingRecord
{
  public Guid Id { get; set; } = Guid.NewGuid();
  public Guid UserId { get; set; }
  public Guid BookId { get; set; }
  public DateTime BorrowedAt { get; set; } = DateTime.UtcNow;
  public DateTime DueAt { get; set; }
  public DateTime? ReturnedAt { get; set; }
  public bool IsOverdue { get; set; } = false;
  public decimal FineAmount { get; set; } = 0;
  public int RewardCredit { get; set; } = 0;

  public User User { get; set; } = null!;
  public Book Book { get; set; } = null!;
}
