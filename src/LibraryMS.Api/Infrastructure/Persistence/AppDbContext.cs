using LibraryMS.Api.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LibraryMS.Api.Infrastructure.Persistence;

public class AppDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

  public DbSet<Book> Books { get; set; }
  public DbSet<Category> Categories { get; set; }
  public DbSet<BorrowingRecord> BorrowingRecords { get; set; }

  protected override void OnModelCreating(ModelBuilder builder)
  {


    base.OnModelCreating(builder);


    builder.Entity<Book>().HasQueryFilter(b => !b.IsDeleted);
    builder.Entity<Category>().HasQueryFilter(c => !c.IsDeleted);
    builder.Entity<User>().HasQueryFilter(u => !u.IsDeleted);

    builder.Entity<Book>().Property(b => b.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
    builder.Entity<Category>().Property(b => b.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
    builder.Entity<User>().Property(b => b.CreatedAt).HasDefaultValueSql("GETUTCDATE()");


    builder.Entity<Book>()
      .Property(b => b.RowVersion)
      .IsRowVersion();

    builder.Entity<Book>()
      .HasOne(b => b.Category)
      .WithMany(c => c.Books)
      .HasForeignKey(b => b.CategoryId)
      .OnDelete(DeleteBehavior.Restrict);


    builder.Entity<Category>()
      .HasIndex(c => c.Name)
      .IsUnique();

    builder.Entity<BorrowingRecord>()
      .HasIndex(br => new { br.BookId, br.ReturnedAt });

    builder.Entity<BorrowingRecord>()
      .Property(br => br.FineAmount).HasPrecision(18, 2);

    builder.Entity<BorrowingRecord>()
      .HasQueryFilter(br => !br.Book.IsDeleted && !br.User.IsDeleted);
  }
}
