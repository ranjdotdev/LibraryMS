namespace LibraryMS.Api.Models.DTOs;

public record CategoryDto(Guid Id, string Name, int BookCount);

public record CreateCategoryDto(string Name);

public record UpdateCategoryDto(string Name);
