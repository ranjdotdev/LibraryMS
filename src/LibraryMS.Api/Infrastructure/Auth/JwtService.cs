using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LibraryMS.Api.Models.Entities;
using Microsoft.IdentityModel.Tokens;

namespace LibraryMS.Api.Infrastructure.Auth;

public class JwtService : IJwtService
{
  private readonly IConfiguration _config;

  public JwtService(IConfiguration config) => _config = config;

  public string GenerateToken(User user, string role)
  {
    var claims = new List<Claim>
    {
        new(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new(ClaimTypes.Role,           role),
        new(ClaimTypes.Email,          user.Email!),
        new(ClaimTypes.Name,           user.FullName),
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: _config["Jwt:Issuer"],
        audience: _config["Jwt:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.Add(AuthCookies.Lifetime),
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
  }
}
