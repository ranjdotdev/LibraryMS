using LibraryMS.Api.Common;
using LibraryMS.Api.Infrastructure.Persistence;
using LibraryMS.Api.Models.DTOs;
using LibraryMS.Api.Models.Entities;
using LibraryMS.Api.Repositories.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LibraryMS.Api.Repositories;

public class UserRepository : IUserRepository
{
  private readonly AppDbContext _db;
  private readonly UserManager<User> _userManager;
  public UserRepository(AppDbContext db, UserManager<User> userManager)
  {
    _db = db;
    _userManager = userManager;
  }

  public async Task<PagedList<UserDto>> GetAllAsync(UserQueryDto query)
  {
    var q = from u in _db.Users
            join ur in _db.UserRoles on u.Id equals ur.UserId
into userRoles
            from ur in userRoles.DefaultIfEmpty()
            join r in _db.Roles on ur.RoleId equals r.Id into roles
            from r in roles.DefaultIfEmpty()
            select new { u, RoleName = r.Name ?? "Member" };

    if (!string.IsNullOrWhiteSpace(query.Search))
      q = q.Where(row => row.u.FullName.Contains(query.Search)
                      || row.u.Email!.Contains(query.Search));

    if (!string.IsNullOrWhiteSpace(query.Role))
      q = q.Where(row => row.RoleName == query.Role);

    var totalCount = await q.CountAsync();

    var items = await q
        .OrderBy(row => row.u.FullName)
        .Skip((query.Page - 1) * query.PageSize)
        .Take(query.PageSize)
        .Select(row => new UserDto(row.u.Id, row.u.FullName, row.u.Email!, row.RoleName, row.u.CreatedAt,
            row.u.BorrowingRecords.Sum(br => br.RewardCredit)))
        .ToListAsync();

    return new PagedList<UserDto>
    {
      Items = items,
      Page = query.Page,
      PageSize = query.PageSize,
      TotalCount = totalCount
    };
  }

  public async Task<User?> GetByIdAsync(Guid id)
      => await _userManager.FindByIdAsync(id.ToString());

  public async Task<IdentityResult> UpdateAsync(User user)
      => await _userManager.UpdateAsync(user);
}
