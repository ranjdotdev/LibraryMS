using FluentValidation;
using LibraryMS.Api.Models.DTOs;

namespace LibraryMS.Api.Models.Validators;

public class CreateUserValidator : AbstractValidator<CreateUserDto>
{
  public CreateUserValidator()
  {
    RuleFor(x => x.FullName).NotEmpty().MaximumLength(120);
    RuleFor(x => x.Email).NotEmpty().EmailAddress();
    RuleFor(x => x.Password).NotEmpty().MinimumLength(8)
      .Matches("[A-Z]").WithMessage("Password must contain an uppercase letter.")
      .Matches("[0-9]").WithMessage("Password must contain a number.");
    RuleFor(x => x.Role).Must(r => r is "Admin" or "Member")
      .WithMessage("Role must be Admin or Member.");
  }
}

public class UpdateUserValidator : AbstractValidator<UpdateUserDto>
{
  public UpdateUserValidator()
  {
    RuleFor(x => x.FullName).NotEmpty().MaximumLength(120);
    RuleFor(x => x.Email).NotEmpty().EmailAddress();
    RuleFor(x => x.Role).Must(r => r is "Admin" or "Member")
      .WithMessage("Role must be Admin or Member.");
  }
}
