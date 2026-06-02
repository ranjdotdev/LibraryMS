using LibraryMS.Api.Models.DTOs;

namespace LibraryMS.Api.Models.Auth;


public record AuthSuccess(string Token, AuthResponseDto User);
