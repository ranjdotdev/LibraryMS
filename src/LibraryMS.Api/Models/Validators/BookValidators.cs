using FluentValidation;
using LibraryMS.Api.Models.DTOs;

namespace LibraryMS.Api.Models.Validators.Books;

public class CreateBookValidator : AbstractValidator<CreateBookDto>
{
  public CreateBookValidator()
  {
    RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
    RuleFor(x => x.Author).NotEmpty().MaximumLength(100);
    RuleFor(x => x.CategoryId).NotEmpty();
    RuleFor(x => x.TotalCopies).GreaterThan(0).WithMessage("Must have at least one copy.");
  }
}

public class UpdateBookValidator : AbstractValidator<UpdateBookDto>
{
  public UpdateBookValidator()
  {
    RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
    RuleFor(x => x.Author).NotEmpty().MaximumLength(100);
    RuleFor(x => x.CategoryId).NotEmpty();
    RuleFor(x => x.TotalCopies).GreaterThan(0).WithMessage("Must have at least one copy.");
  }
}
