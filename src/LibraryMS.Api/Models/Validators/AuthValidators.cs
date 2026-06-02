using FluentValidation;
using LibraryMS.Api.Models.DTOs;

namespace LibraryMS.Api.Models.Validators.Auth;

public class LoginValidator : AbstractValidator<LoginDto>
{
  public LoginValidator()
  {
    RuleFor(x => x.Email).NotEmpty().EmailAddress();
    RuleFor(x => x.Password).NotEmpty();
  }
}

public class RegisterValidator : AbstractValidator<RegisterDto>
{
  public RegisterValidator()
  {
    RuleFor(x => x.FullName).NotEmpty().MaximumLength(100);
    RuleFor(x => x.Email).NotEmpty().EmailAddress();
    RuleFor(x => x.Password)
        .NotEmpty()
        .MinimumLength(8)
        .Matches("[A-Z]").WithMessage("Password must contain an uppercase letter.")
        .Matches("[0-9]").WithMessage("Password must contain a number.");
  }
}
