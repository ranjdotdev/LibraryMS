using LibraryMS.Api.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LibraryMS.Api.Infrastructure.Persistence;

public static class DataSeeder
{
  public static async Task SeedAsync(IServiceProvider services)
  {


    var db = services.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();

    var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
    var userManager = services.GetRequiredService<UserManager<User>>();

    foreach (var role in new[] { "Admin", "Member" })
      if (!await roleManager.RoleExistsAsync(role))
        await roleManager.CreateAsync(new IdentityRole<Guid>(role));

    const string adminEmail = "admin@library.com";
    if (await userManager.FindByEmailAsync(adminEmail) is null)
    {
      var admin = new User
      {
        FullName = "System Admin",
        Email = adminEmail,
        UserName = adminEmail,
      };

      var create = await userManager.CreateAsync(admin, "Admin1234!");
      if (!create.Succeeded)
        throw new InvalidOperationException(
            "Failed to seed admin user: " +
            string.Join(", ", create.Errors.Select(e => e.Description)));

      await userManager.AddToRoleAsync(admin, "Admin");
    }
  }
}
