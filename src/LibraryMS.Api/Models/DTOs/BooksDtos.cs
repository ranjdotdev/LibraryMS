using System.Text.Json.Serialization;

namespace LibraryMS.Api.Models.DTOs;

public record BookDto(
    Guid Id,
    string Title,
    string Author,
    Guid CategoryId,
    string CategoryName,
    int TotalCopies,
    [property: JsonIgnore] int ActiveBorrows,
    DateTime CreatedAt
)
{
  public int AvailableCopies => TotalCopies - ActiveBorrows;
  public bool IsAvailable => AvailableCopies > 0;
}

public record CreateBookDto(string Title, string Author, Guid CategoryId, int TotalCopies = 1);

public record UpdateBookDto(string Title, string Author, Guid CategoryId, int TotalCopies);

public record BookQueryDto(
    string? Search = null,
    Guid? CategoryId = null,
    bool? Available = null,
    int Page = 1,
    int PageSize = 20
);
