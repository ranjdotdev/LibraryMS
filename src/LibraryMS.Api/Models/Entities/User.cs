using Microsoft.AspNetCore.Identity;

namespace LibraryMS.Api.Models.Entities;

public class User : IdentityUser<Guid>
{
  public string FullName { get; set; } = string.Empty;
  public bool IsDeleted { get; set; } = false;
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

  public ICollection<BorrowingRecord> BorrowingRecords { get; set; } = [];
}
