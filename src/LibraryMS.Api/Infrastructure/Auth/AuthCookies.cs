namespace LibraryMS.Api.Infrastructure.Auth;


public static class AuthCookies
{
  public const string TokenCookie = "auth_token";

  public static readonly TimeSpan Lifetime = TimeSpan.FromDays(7);


  public static CookieOptions Issue() => new()
  {
    HttpOnly = true,
    Secure = true,
    SameSite = SameSiteMode.Strict,
    Path = "/",
    Expires = DateTimeOffset.UtcNow.Add(Lifetime),
  };


  public static CookieOptions Clear() => new()
  {
    HttpOnly = true,
    Secure = true,
    SameSite = SameSiteMode.Strict,
    Path = "/",
  };
}
