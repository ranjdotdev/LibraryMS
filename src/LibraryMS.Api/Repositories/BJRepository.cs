using LibraryMS.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using LibraryMS.Api.Repositories.Interfaces;

namespace LibraryMS.Api.Repositories;

public class BJRepository : IBJRepository
{
  private readonly AppDbContext _db;

  public BJRepository(AppDbContext db) => _db = db;

  public async Task RefreshAsync()
  {
    var overdue = await _db.BorrowingRecords
        .Where(br => br.ReturnedAt == null
                  && br.DueAt < DateTime.UtcNow
                  && !br.IsOverdue)
        .ToListAsync();

    if (!overdue.Any()) return;

    foreach (var record in overdue)
    {
      record.IsOverdue = true;
      record.FineAmount = Math.Round(
          (decimal)(DateTime.UtcNow - record.DueAt).TotalDays * 0.5m, 2);
    }

    await _db.SaveChangesAsync();
  }
}
