using LibraryMS.Api.Common;
using LibraryMS.Api.Models.DTOs;
using LibraryMS.Api.Models.Entities;
using Microsoft.AspNetCore.Identity;

namespace LibraryMS.Api.Repositories.Interfaces;

public interface IUserRepository
{
  Task<PagedList<UserDto>> GetAllAsync(UserQueryDto query);
  Task<User?> GetByIdAsync(Guid id);
  Task<IdentityResult> UpdateAsync(User user);
}
