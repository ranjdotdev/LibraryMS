namespace LibraryMS.Api.Models.Entities;

public class Category
{
  public Guid Id { get; set; } = Guid.NewGuid();
  public string Name { get; set; } = string.Empty;
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public bool IsDeleted { get; set; } = false;

  public ICollection<Book> Books { get; set; } = [];
}
