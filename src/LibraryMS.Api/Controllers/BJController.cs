using LibraryMS.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryMS.Api.Controllers;

[ApiController]
[Route("api/bj")]
[Authorize]
public class BJController : ControllerBase
{
  private readonly IBJService _bj;
  public BJController(IBJService bj) => _bj = bj;

  [HttpPost("refresh")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> Refresh()
  {
    var result = await _bj.RefreshAsync();
    return result.IsSuccess
        ? Ok()
        : BadRequest(new { error = result.Error });
  }
}
