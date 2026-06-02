using LibraryMS.Api.Models.DTOs;
using LibraryMS.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryMS.Api.Controllers;

[ApiController]
[Route("api/books")]
[Authorize]
public class BooksController : ControllerBase
{
  private readonly IBookService _books;
  public BooksController(IBookService books) => _books = books;

  [HttpGet]
  public async Task<IActionResult> GetAll([FromQuery] BookQueryDto query)
      => Ok((await _books.GetAllAsync(query)).Value);

  [HttpGet("{id:guid}")]
  public async Task<IActionResult> GetById(Guid id)
  {
    var result = await _books.GetByIdAsync(id);
    return result.IsSuccess ? Ok(result.Value) : NotFound(new { error = result.Error });
  }

  [HttpPost]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> Create(CreateBookDto dto)
  {
    var result = await _books.CreateAsync(dto);
    return result.IsSuccess
        ? CreatedAtAction(nameof(GetById), new { id = result.Value!.Id }, result.Value)
        : BadRequest(new { error = result.Error });
  }

  [HttpPut("{id:guid}")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> Update(Guid id, UpdateBookDto dto)
  {
    var result = await _books.UpdateAsync(id, dto);
    return result.IsSuccess ? Ok(result.Value) : BadRequest(new { error = result.Error });
  }

  [HttpDelete("{id:guid}")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> Delete(Guid id)
  {
    var result = await _books.DeleteAsync(id);
    return result.IsSuccess ? NoContent() : NotFound(new { error = result.Error });
  }
}
