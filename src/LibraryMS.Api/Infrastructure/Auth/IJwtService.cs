using LibraryMS.Api.Models.Entities;

namespace LibraryMS.Api.Infrastructure.Auth;

public interface IJwtService
{
  string GenerateToken(User user, string role);
}
