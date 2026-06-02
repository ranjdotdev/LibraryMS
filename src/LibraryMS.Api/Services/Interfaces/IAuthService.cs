using LibraryMS.Api.Common;
using LibraryMS.Api.Models.Auth;
using LibraryMS.Api.Models.DTOs;

namespace LibraryMS.Api.Services.Interfaces;

public interface IAuthService
{
  Task<Result<AuthSuccess>> RegisterAsync(RegisterDto registerDto);
  Task<Result<AuthSuccess>> LoginAsync(LoginDto loginDto);
  Task<Result<AuthResponseDto>> GetCurrentUserAsync(Guid userId);
}
