using LibraryMS.Api.Common.Middleware;
using LibraryMS.Api.Infrastructure.Auth;
using LibraryMS.Api.Infrastructure.Background;
using LibraryMS.Api.Infrastructure.Persistence;
using LibraryMS.Api.Models.Entities;
using LibraryMS.Api.Repositories;
using LibraryMS.Api.Repositories.Interfaces;
using LibraryMS.Api.Services;
using LibraryMS.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

builder.Services
    .AddIdentity<User, IdentityRole<Guid>>(opt =>
    {
      opt.Password.RequireDigit = true;
      opt.Password.RequiredLength = 8;
      opt.Password.RequireNonAlphanumeric = false;
      opt.Password.RequireUppercase = true;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

builder.Services
    .AddAuthentication(opt =>
    {
      opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
      opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(opt =>
    {
      opt.TokenValidationParameters = new TokenValidationParameters
      {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
              Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!))
      };


      opt.Events = new JwtBearerEvents
      {
        OnMessageReceived = ctx =>
        {
          if (ctx.Request.Cookies.TryGetValue(AuthCookies.TokenCookie, out var token))
            ctx.Token = token;
          return Task.CompletedTask;
        }
      };
    });

builder.Services
    .AddFluentValidationAutoValidation()
    .AddValidatorsFromAssemblyContaining<Program>();


builder.Services.AddCors(opt =>
    opt.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()));

builder.Services.AddScoped<IBookRepository, BookRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IBorrowingRepository, BorrowingRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IBJRepository, BJRepository>();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IBookService, BookService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IBorrowingService, BorrowingService>();
builder.Services.AddScoped<IBJService, BJService>();

builder.Services.AddScoped<IJwtService, JwtService>();

builder.Services.AddHostedService<OverdueWorker>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
  await DataSeeder.SeedAsync(scope.ServiceProvider);

app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
