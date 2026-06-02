namespace LibraryMS.Api.Models.DTOs;

public record LoginDto(string Email, string Password);
public record RegisterDto(string FullName, string Email, string Password);


public record AuthResponseDto(Guid Id, string FullName, string Email, string Role, int TotalCredit);
