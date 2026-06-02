using System.Security.Claims;
using LibraryMS.Api.Models.DTOs;
using LibraryMS.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryMS.Api.Controllers;

[ApiController]
[Route("api/borrowing")]
[Authorize]
public class BorrowingController : ControllerBase
{
  private readonly IBorrowingService _borrowing;

  public BorrowingController(IBorrowingService borrowing) => _borrowing = borrowing;

  [HttpGet]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> GetAll([FromQuery] BorrowingQueryDto query)
      => Ok((await _borrowing.GetAllAsync(query)).Value);

  [HttpGet("my")]
  public async Task<IActionResult> GetMine([FromQuery] BorrowingQueryDto query)
  {
    var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    var result = await _borrowing.GetMyBorrowingsAsync(userId, query);
    return Ok(result.Value);
  }

  [HttpPost("issue")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> Issue(IssueBookDto dto)
  {
    var result = await _borrowing.IssueAsync(dto);
    return result.IsSuccess ? Ok(result.Value) : BadRequest(new { error = result.Error });
  }

  [HttpPut("{id:guid}/return")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> Return(Guid id)
  {
    var result = await _borrowing.ReturnAsync(id);
    return result.IsSuccess ? Ok(result.Value) : BadRequest(new { error = result.Error });
  }
}
