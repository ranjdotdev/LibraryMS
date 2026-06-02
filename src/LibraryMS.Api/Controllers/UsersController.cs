using LibraryMS.Api.Models.DTOs;
using LibraryMS.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryMS.Api.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
  private readonly IUserService _users;
  public UsersController(IUserService users) => _users = users;

  [HttpGet]
  public async Task<IActionResult> GetAll([FromQuery] UserQueryDto query)
      => Ok((await _users.GetAllAsync(query)).Value);

  [HttpGet("{id:guid}")]
  public async Task<IActionResult> GetById(Guid id)
  {
    var result = await _users.GetByIdAsync(id);
    return result.IsSuccess ? Ok(result.Value) : NotFound(new { error = result.Error });
  }

  [HttpPost]
  public async Task<IActionResult> Create(CreateUserDto dto)
  {
    var result = await _users.CreateAsync(dto);
    return result.IsSuccess ? Ok(result.Value) : BadRequest(new { error = result.Error });
  }

  [HttpPut("{id:guid}")]
  public async Task<IActionResult> Update(Guid id, UpdateUserDto dto)
  {
    var result = await _users.UpdateAsync(id, dto);
    return result.IsSuccess ? Ok(result.Value) : NotFound(new { error = result.Error });
  }

  [HttpDelete("{id:guid}")]
  public async Task<IActionResult> Delete(Guid id)
  {
    var result = await _users.DeleteAsync(id);
    return result.IsSuccess ? NoContent() : NotFound(new { error = result.Error });
  }
}
