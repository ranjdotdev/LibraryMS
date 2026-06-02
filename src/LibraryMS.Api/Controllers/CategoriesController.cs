using LibraryMS.Api.Models.DTOs;
using LibraryMS.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryMS.Api.Controllers;

[ApiController]
[Route("api/categories")]
[Authorize]
public class CategoriesController : ControllerBase
{
  private readonly ICategoryService _categories;
  public CategoriesController(ICategoryService categories) => _categories = categories;

  [HttpGet]
  public async Task<IActionResult> GetAll()
      => Ok((await _categories.GetAllAsync()).Value);

  [HttpPost]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> Create(CreateCategoryDto dto)
  {
    var result = await _categories.CreateAsync(dto);
    return result.IsSuccess ? Ok(result.Value) : BadRequest(new { error = result.Error });
  }

  [HttpPut("{id:guid}")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> Update(Guid id, UpdateCategoryDto dto)
  {
    var result = await _categories.UpdateAsync(id, dto);
    return result.IsSuccess ? Ok(result.Value) : NotFound(new { error = result.Error });
  }

  [HttpDelete("{id:guid}")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> Delete(Guid id)
  {
    var result = await _categories.DeleteAsync(id);
    return result.IsSuccess ? NoContent() : NotFound(new { error = result.Error });
  }
}
