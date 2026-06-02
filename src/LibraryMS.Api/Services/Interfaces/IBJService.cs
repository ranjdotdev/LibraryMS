using LibraryMS.Api.Common;

namespace LibraryMS.Api.Services.Interfaces;

public interface IBJService
{
  Task<Result> RefreshAsync();
}
