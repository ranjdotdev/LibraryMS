using LibraryMS.Api.Common;
using LibraryMS.Api.Infrastructure.Auth;
using LibraryMS.Api.Models.Auth;
using LibraryMS.Api.Models.DTOs;
using LibraryMS.Api.Models.Entities;
using LibraryMS.Api.Repositories.Interfaces;
using LibraryMS.Api.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace LibraryMS.Api.Services;

public class AuthService : IAuthService
{
  private readonly UserManager<User> _userManager;
  private readonly SignInManager<User> _signInManager;
  private readonly IJwtService _jwt;
  private readonly IBorrowingRepository _borrowings;
  private readonly ILogger<AuthService> _logger;

  public AuthService(
    UserManager<User> userManager,
    SignInManager<User> signInManager,
    IJwtService jwt,
    IBorrowingRepository borrowings,
    ILogger<AuthService> logger
  )
  {
    _userManager = userManager;
    _signInManager = signInManager;
    _jwt = jwt;
    _borrowings = borrowings;
    _logger = logger;
  }

  public async Task<Result<AuthSuccess>> LoginAsync(LoginDto dto)
  {
    var user = await _userManager.FindByEmailAsync(dto.Email);
    if (user is null)
    {
      _logger.LogWarning("Login attempt for unknown or deleted account.");
      return Result<AuthSuccess>.Fail("Invalid credentials.");
    }

    var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
    if (!result.Succeeded)
    {
      _logger.LogWarning("Failed login attempt: {Email}", dto.Email);
      return Result<AuthSuccess>.Fail("Invalid credentials.");
    }

    var roles = await _userManager.GetRolesAsync(user);
    var role = roles.FirstOrDefault() ?? "Member";
    var token = _jwt.GenerateToken(user, role);
    var totalCredit = await _borrowings.GetTotalCreditAsync(user.Id);

    _logger.LogInformation("User {Email} logged in successfully.", dto.Email);

    return Result<AuthSuccess>.Ok(new AuthSuccess(
      token,
      new AuthResponseDto(user.Id, user.FullName, user.Email!, role, totalCredit)));
  }

  public async Task<Result<AuthSuccess>> RegisterAsync(RegisterDto dto)
  {
    var existing = await _userManager.FindByEmailAsync(dto.Email);
    if (existing is not null)
      return Result<AuthSuccess>.Fail("Email already in use.");

    var user = new User
    {
      FullName = dto.FullName,
      Email = dto.Email,
      UserName = dto.Email,
    };

    var result = await _userManager.CreateAsync(user, dto.Password);
    if (!result.Succeeded)
    {
      var errors = string.Join(", ", result.Errors.Select(e => e.Description));
      _logger.LogWarning("Registration failed: {Errors}", errors);
      return Result<AuthSuccess>.Fail(errors);
    }

    await _userManager.AddToRoleAsync(user, "Member");
    _logger.LogInformation("New user registered: {UserId}.", user.Id);

    var token = _jwt.GenerateToken(user, "Member");

    return Result<AuthSuccess>.Ok(new AuthSuccess(
      token,
      new AuthResponseDto(user.Id, user.FullName, user.Email!, "Member", 0)));
  }


  public async Task<Result<AuthResponseDto>> GetCurrentUserAsync(Guid userId)
  {
    var user = await _userManager.FindByIdAsync(userId.ToString());
    if (user is null || user.IsDeleted)
      return Result<AuthResponseDto>.Fail("User not found.");

    var roles = await _userManager.GetRolesAsync(user);
    var role = roles.FirstOrDefault() ?? "Member";
    var totalCredit = await _borrowings.GetTotalCreditAsync(userId);

    return Result<AuthResponseDto>.Ok(
      new AuthResponseDto(user.Id, user.FullName, user.Email!, role, totalCredit));
  }
}
