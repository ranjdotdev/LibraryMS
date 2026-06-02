using FluentValidation;
using LibraryMS.Api.Models.DTOs;

namespace LibraryMS.Api.Models.Validators.Categories;

public class CreateCategoryValidator : AbstractValidator<CreateCategoryDto>
{
  public CreateCategoryValidator()
  {
    RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
  }
}

public class UpdateCategoryValidator : AbstractValidator<UpdateCategoryDto>
{
  public UpdateCategoryValidator()
  {
    RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
  }
}
