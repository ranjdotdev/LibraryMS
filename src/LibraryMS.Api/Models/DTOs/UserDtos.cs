namespace LibraryMS.Api.Models.DTOs;

public record UserDto(Guid Id, string FullName, string Email, string Role, DateTime CreatedAt, int TotalCredit);

public record CreateUserDto(string FullName, string Email, string Password, string Role);

public record UpdateUserDto(string FullName, string Email, string Role);

public record UserQueryDto(string? Search = null, string? Role = null, int Page = 1, int PageSize = 20);
