using LibraryMS.Api.Common;
using LibraryMS.Api.Models.DTOs;
using LibraryMS.Api.Models.Entities;
using LibraryMS.Api.Repositories.Interfaces;
using LibraryMS.Api.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace LibraryMS.Api.Services;

public class UserService : IUserService
{
  private readonly IUserRepository _users;
  private readonly IBorrowingRepository _borrowings;
  private readonly UserManager<User> _userManager;
  private readonly ILogger<UserService> _logger;

  public UserService(IUserRepository users, IBorrowingRepository borrowings,
    UserManager<User> userManager, ILogger<UserService> logger)
  {
    _users = users;
    _borrowings = borrowings;
    _userManager = userManager;
    _logger = logger;
  }

  public async Task<Result<PagedList<UserDto>>> GetAllAsync(UserQueryDto query)
      => Result<PagedList<UserDto>>.Ok(await _users.GetAllAsync(query));

  public async Task<Result<UserDto>> GetByIdAsync(Guid id)
  {
    var user = await _users.GetByIdAsync(id);
    if (user is null) return Result<UserDto>.Fail("User not found.");

    var roles = await _userManager.GetRolesAsync(user);
    var role = roles.FirstOrDefault() ?? "Member";
    var totalCredit = await _borrowings.GetTotalCreditAsync(id);

    return Result<UserDto>.Ok(new UserDto(
        user.Id, user.FullName, user.Email!, role, user.CreatedAt, totalCredit));
  }

  public async Task<Result<UserDto>> CreateAsync(CreateUserDto dto)
  {
    if (dto.Role is not ("Admin" or "Member"))
      return Result<UserDto>.Fail("Role must be Admin or Member.");

    var existing = await _userManager.FindByEmailAsync(dto.Email);
    if (existing is not null)
      return Result<UserDto>.Fail("Email already in use.");

    var user = new User
    {
      FullName = dto.FullName,
      Email = dto.Email,
      UserName = dto.Email,
    };

    var create = await _userManager.CreateAsync(user, dto.Password);
    if (!create.Succeeded)
      return Result<UserDto>.Fail(create.Errors.First().Description);

    await _userManager.AddToRoleAsync(user, dto.Role);
    _logger.LogInformation("Admin created user {UserId} with role {Role}.", user.Id, dto.Role);

    return Result<UserDto>.Ok(new UserDto(
        user.Id, user.FullName, user.Email!, dto.Role, user.CreatedAt, 0));
  }

  public async Task<Result<UserDto>> UpdateAsync(Guid id, UpdateUserDto dto)
  {
    if (dto.Role is not ("Admin" or "Member"))
      return Result<UserDto>.Fail("Role must be Admin or Member.");

    var user = await _users.GetByIdAsync(id);
    if (user is null) return Result<UserDto>.Fail("User not found.");

    user.FullName = dto.FullName;
    user.Email = dto.Email;
    user.UserName = dto.Email;

    var updateResult = await _users.UpdateAsync(user);
    if (!updateResult.Succeeded)
      return Result<UserDto>.Fail(updateResult.Errors.First().Description);

    var currentRoles = await _userManager.GetRolesAsync(user);
    if (!currentRoles.Contains(dto.Role))
    {
      await _userManager.RemoveFromRolesAsync(user, currentRoles);
      await _userManager.AddToRoleAsync(user, dto.Role);
      _logger.LogInformation("User {UserId} role changed to {Role}.", id, dto.Role);
    }

    _logger.LogInformation("User {UserId} updated.", id);

    var totalCredit = await _borrowings.GetTotalCreditAsync(id);

    return Result<UserDto>.Ok(new UserDto(
        user.Id, user.FullName, user.Email!, dto.Role, user.CreatedAt, totalCredit));
  }

  public async Task<Result> DeleteAsync(Guid id)
  {
    var user = await _users.GetByIdAsync(id);
    if (user is null) return Result.Fail("User not found.");

    user.IsDeleted = true;
    var updateResult = await _users.UpdateAsync(user);
    if (!updateResult.Succeeded)
      return Result.Fail(updateResult.Errors.First().Description);

    _logger.LogInformation("User {UserId} soft-deleted.", id);
    return Result.Ok();
  }
}
