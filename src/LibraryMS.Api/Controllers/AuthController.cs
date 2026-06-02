using System.Security.Claims;
using LibraryMS.Api.Infrastructure.Auth;
using LibraryMS.Api.Models.DTOs;
using LibraryMS.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryMS.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
  private readonly IAuthService _auth;
  public AuthController(IAuthService auth) => _auth = auth;

  [HttpPost("login")]
  public async Task<IActionResult> Login(LoginDto dto)
  {
    var result = await _auth.LoginAsync(dto);
    if (!result.IsSuccess)
      return Unauthorized(new { error = result.Error });

    IssueAuthCookie(result.Value!.Token);
    return Ok(result.Value.User);
  }

  [HttpPost("register")]
  public async Task<IActionResult> Register(RegisterDto dto)
  {
    var result = await _auth.RegisterAsync(dto);
    if (!result.IsSuccess)
      return BadRequest(new { error = result.Error });

    IssueAuthCookie(result.Value!.Token);
    return Ok(result.Value.User);
  }


  [HttpGet("me")]
  [Authorize]
  public async Task<IActionResult> Me()
  {
    var userId = GetUserIdFromClaims();
    if (userId is null)
      return Unauthorized(new { error = "Invalid token." });

    var result = await _auth.GetCurrentUserAsync(userId.Value);
    return result.IsSuccess
      ? Ok(result.Value)
      : Unauthorized(new { error = result.Error });
  }


  [HttpPost("logout")]
  public IActionResult Logout()
  {
    Response.Cookies.Delete(AuthCookies.TokenCookie, AuthCookies.Clear());
    return NoContent();
  }


  private void IssueAuthCookie(string token) =>
    Response.Cookies.Append(AuthCookies.TokenCookie, token, AuthCookies.Issue());

  private Guid? GetUserIdFromClaims()
  {
    var raw = User.FindFirstValue(ClaimTypes.NameIdentifier);
    return Guid.TryParse(raw, out var id) ? id : null;
  }
}
