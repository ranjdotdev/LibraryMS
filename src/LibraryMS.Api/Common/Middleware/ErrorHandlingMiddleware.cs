using System.Net;
using System.Text.Json;

namespace LibraryMS.Api.Common.Middleware;

public class ErrorHandlingMiddleware
{
  private readonly RequestDelegate _next;
  private readonly ILogger<ErrorHandlingMiddleware> _logger;
  private readonly IHostEnvironment _env;

  public ErrorHandlingMiddleware(
      RequestDelegate next,
      ILogger<ErrorHandlingMiddleware> logger,
      IHostEnvironment env)
  {
    _next = next;
    _logger = logger;
    _env = env;
  }

  public async Task InvokeAsync(HttpContext context)
  {
    try
    {
      await _next(context);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Unhandled exception: {Method} {Path}",
          context.Request.Method, context.Request.Path);

      context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
      context.Response.ContentType = "application/json";


      var payload = _env.IsDevelopment()
          ? new { error = "An unexpected error occurred.", detail = (string?)ex.Message }
          : new { error = "An unexpected error occurred.", detail = (string?)null };

      await context.Response.WriteAsync(JsonSerializer.Serialize(payload));
    }
  }
}
