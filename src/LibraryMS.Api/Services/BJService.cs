using LibraryMS.Api.Common;
using LibraryMS.Api.Services.Interfaces;
using LibraryMS.Api.Repositories.Interfaces;

namespace LibraryMS.Api.Services;

public class BJService : IBJService
{
  private readonly IBJRepository _bj;

  public BJService(IBJRepository bj)
  {
    _bj = bj;
  }

  public async Task<Result> RefreshAsync()
  {
    await _bj.RefreshAsync();
    return Result.Ok();
  }
}
