using FluentValidation;
using LibraryMS.Api.Models.DTOs;

namespace LibraryMS.Api.Models.Validators.Borrowing;

public class IssueBookValidator : AbstractValidator<IssueBookDto>
{
  public IssueBookValidator()
  {
    RuleFor(x => x.BookId).NotEmpty();
    RuleFor(x => x.UserId).NotEmpty();
    RuleFor(x => x.DueDays).InclusiveBetween(1, 120);
  }
}
