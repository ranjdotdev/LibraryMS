using LibraryMS.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace LibraryMS.Api.Infrastructure.Background;

public class OverdueWorker : BackgroundService
{
  private readonly IServiceScopeFactory _scopeFactory;
  private readonly ILogger<OverdueWorker> _logger;

  public OverdueWorker(IServiceScopeFactory scopeFactory, ILogger<OverdueWorker> logger)
  {
    _scopeFactory = scopeFactory;
    _logger = logger;
  }

  protected override async Task ExecuteAsync(CancellationToken stoppingToken)
  {
    _logger.LogInformation("OverdueWorker started.");

    while (!stoppingToken.IsCancellationRequested)
    {
      try { await ProcessOverdueAsync(); }
      catch (Exception ex)
      {
        _logger.LogError(ex, "OverdueWorker encountered an error.");
      }

      await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
    }
  }

  private async Task ProcessOverdueAsync()
  {


    using var scope = _scopeFactory.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    var overdue = await db.BorrowingRecords
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

    await db.SaveChangesAsync();

    _logger.LogInformation(
        "OverdueWorker: flagged {Count} overdue records.", overdue.Count);
  }
}
