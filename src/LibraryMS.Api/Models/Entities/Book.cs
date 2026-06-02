using System.ComponentModel.DataAnnotations;

namespace LibraryMS.Api.Models.Entities;

public class Book
{
  public Guid Id { get; set; } = Guid.NewGuid();
  public string Title { get; set; } = string.Empty;
  public string Author { get; set; } = string.Empty;
  public Guid CategoryId { get; set; }

  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public bool IsDeleted { get; set; } = false;

  public int TotalCopies { get; set; }

  [Timestamp]
  public byte[] RowVersion { get; set; } = null!;

  public Category Category { get; set; } = null!;
  public ICollection<BorrowingRecord> BorrowingRecords { get; set; } = [];
}
