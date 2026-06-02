using LibraryMS.Api.Common;
using LibraryMS.Api.Models.DTOs;

namespace LibraryMS.Api.Services.Interfaces;

public interface IUserService
{
  Task<Result<PagedList<UserDto>>> GetAllAsync(UserQueryDto query);
  Task<Result<UserDto>> GetByIdAsync(Guid id);
  Task<Result<UserDto>> CreateAsync(CreateUserDto dto);
  Task<Result<UserDto>> UpdateAsync(Guid id, UpdateUserDto dto);
  Task<Result> DeleteAsync(Guid id);
}
