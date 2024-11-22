---
title: Authentication and Authorization in ASP.NET Core with ASP.NET Identity and Neon
subtitle: Learn how to implement secure user authentication and authorization in ASP.NET Core applications using ASP.NET Identity with Neon Postgres
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-11-03T00:00:00.000Z'
updatedOn: '2024-11-03T00:00:00.000Z'
---

In this guide, we'll explore how to implement secure authentication and authorization in an ASP.NET Core application using ASP.NET Core Identity with Neon Postgres as the database backend. We'll cover user management, role-based authorization, and JWT token generation for secure API access.

## Prerequisites

Before we begin, ensure you have:

- .NET 8.0 or later installed
- A [Neon account](https://console.neon.tech/signup)
- Basic familiarity with ASP.NET Core and Entity Framework Core

## Project Setup

First, create a new ASP.NET Core Web API project with authentication:

```bash
dotnet new webapi -n NeonApi
cd NeonApi
```

With the project created, install the necessary packages:

```bash
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.IdentityModel.Tokens
dotnet add package System.IdentityModel.Tokens.Jwt
```

The above packages provide support for ASP.NET Identity, JWT authentication, and PostgreSQL database integration.

### Configuring the Neon Database

Head over to your [Neon Dashboard](https://neon.tech) and create a new project.

Once done, grab your database connection string and add it to your `appsettings.json`:

```json
"ConnectionStrings": {
  "NeonConnection": "Host=<your-host>;Database=<your-database>;Username=<your-username>;Password=<your-password>;Port=5432"
}
```

The `appsettings.json` file is great for local development, but you should use environment variables or a secure vault for production.

While editing `appsettings.json`, add JWT configuration as well right below the connection string:

```json
"Jwt": {
  "Key": "your-very-secure-and-long-secret-key",
  "Issuer": "https://your-app.com",
  "Audience": "https://your-app.com"
}
```

The `Key` is a secret key used to sign and verify JWT tokens, while `Issuer` and `Audience` are used to validate the token's origin and intended recipient.

## Configuring ASP.NET Identity with Neon

In order to store additional information about users, we need to create a custom user class that extends the default Identity user provided by ASP.NET Core Identity.

This will allow us to add new properties, like `FirstName` and `LastName`, that are not included in the default `IdentityUser` class.

### Custom User Model

Let's create a new file named `ApplicationUser.cs` inside the `Models` folder with the following content:

```csharp
using Microsoft.AspNetCore.Identity;

public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
```

In the code above:

1. By inheriting from the `IdentityUser` class, `ApplicationUser` gets all the built-in properties like `UserName`, `Email`, `PasswordHash`, and more. This means we don't have to rewrite any of the existing authentication logic.

2. We added three new fields: `FirstName` and `LastName` allow us to store the user's personal details. And `CreatedAt` captures the date and time when the user was created, which can be helpful for tracking new sign-ups.

Why extend the `IdentityUser`? Well, the default user model is quite limited, and many real-world applications need to store more information than just usernames and emails. By creating a custom `ApplicationUser`, you can add more fields as you need to fit your application's requirements.

### Database Context Configuration

A database context is a class that represents a session with the database, allowing us to query and save data. In our case, we're setting up a context specifically for handling ASP.NET Identity and our custom `ApplicationUser` model.

Create the database context in `Data/ApplicationDbContext.cs`, inheriting from `IdentityDbContext<ApplicationUser>`:

```csharp
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Custom configurations for Identity tables
        builder.Entity<ApplicationUser>(entity =>
        {
            entity.ToTable(name: "Users");
        });

        builder.Entity<IdentityRole>(entity =>
        {
            entity.ToTable(name: "Roles");
        });
    }
}
```

In this example, we create `ApplicationDbContext` by inheriting from `IdentityDbContext<ApplicationUser>`. This base class, `IdentityDbContext`, already includes all the necessary tables for ASP.NET Identity, such as tables for users, roles, and user claims. By specifying `ApplicationUser` as the type, we're telling ASP.NET Identity to use our custom user model.

The `OnModelCreating` method provides us with a chance to further configure the database schema. Here, we customize the names of the tables used by Identity to be more straightforward:

- **Users Table**: We rename the default user table to simply `Users` for clarity.
- **Roles Table**: Similarly, we rename the default roles table to `Roles`.

These configurations allow us to have simpler, more intuitive table names in the database, while still retaining all the built-in functionality of ASP.NET Identity.

This is not a requirement, but it can be helpful for keeping your database schema organized and easy to understand.

### Registering Services

Now that we have our `ApplicationDbContext` and user model set up, it's time to configure our application's services in `Program.cs` to enable Identity and authentication.

Open `Program.cs` and update it as follows:

```csharp
var builder = WebApplication.CreateBuilder(args);

// Add Neon database context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("NeonConnection")));

builder.Services.AddControllers();

// Configure Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    // Password settings
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 8;

    // Lockout settings
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;

    // User settings
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Configure JWT authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

// Add authorization
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAdminRole", policy =>
        policy.RequireRole("Admin"));
});

var app = builder.Build();

// Add roles on startup
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    await RoleHelper.EnsureRolesCreated(roleManager);
}

// Map controllers
app.MapControllers();

// Configure middleware
app.UseAuthentication();
app.UseAuthorization();
```

We are doing quite a few things here:

1. First, we configure our database context using the connection string we defined earlier in `appsettings.json`. This connects our application to the Neon Postgres database, allowing it to store and retrieve user data.
1. Next, we set up ASP.NET Identity to manage user accounts which includes:
   - We enforce strong passwords.
   - We configure lockout settings to protect against brute force attacks.
   - We require users to have unique emails.
1. After setting up Identity, we configure the JWT authentication. This is where the `JWT` token configuration from the `appsettings.json` file comes into play as well. This allows our API to issue tokens to authenticated users, which can then be used to access secured endpoints.
1. Additionally, we define an authorization policy called `RequireAdminRole`, which restricts certain actions to users with the "Admin" role.
1. To make sure our application has the necessary roles, we include a piece of code that runs on startup to create roles like "Admin" and "User" if they don't already exist. This is done using a scoped service to access the `RoleManager`.
1. Finally, we map our controllers to handle HTTP requests and add the necessary middleware for authentication and authorization.

## Implementing Authentication Controllers

Now that we have configured our database and Identity services, let's create a controller to manage user registration and login. This controller will handle the core authentication flow for our application.

You can create this in a new file, `Controllers/AuthController.cs` with the following content:

```csharp
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto model)
    {
        var user = new ApplicationUser
        {
            UserName = model.Email,
            Email = model.Email,
            FirstName = model.FirstName,
            LastName = model.LastName
        };

        var result = await _userManager.CreateAsync(user, model.Password);
        if (result.Succeeded)
        {
            // Assign default role
            await _userManager.AddToRoleAsync(user, "User");
            return Ok(new { message = "Registration successful" });
        }

        return BadRequest(result.Errors);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
        {
            return BadRequest("Invalid credentials");
        }

        var result = await _signInManager.CheckPasswordSignInAsync(
            user, model.Password, lockoutOnFailure: false);

        if (result.Succeeded)
        {
            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }

        return BadRequest("Invalid credentials");
    }

    private string GenerateJwtToken(ApplicationUser user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(3),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
```

To begin, we create a new `AuthController` class that will handle user authentication. This includes two primary actions: user registration and user login. By using this controller, users will be able to create accounts and log in to receive a JWT, which they can use to access protected endpoints.

Here's how it works:

- The `AuthController` uses `UserManager` for user operations, `SignInManager` for handling sign-ins, and `IConfiguration` for accessing JWT settings.
- The `Register` method creates a new user with the provided details. Once created, the user is assigned the "User" role. If registration succeeds, an `Ok` response is returned; otherwise, a `BadRequest` with errors is sent.
- The `Login` method verifies if the email exists and checks the password. On success, a JWT token is generated and returned for authenticated access.
- The `GenerateJwtToken` method creates a token with the user's ID and email as claims. It signs the token using the secret key from `appsettings.json` and sets it to expire in 3 hours.

## Implementing Role-Based Authorization

To manage user roles effectively, we'll create a helper class that checks if the necessary roles are set up in your system. This is useful when you want to predefine certain roles like "Admin" or "User" and make them available as soon as the application starts instead of manually creating them.

You can create this in a new file, `Helpers/RoleHelper.cs` as follows:

```csharp
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

public static class RoleHelper
{
    public static async Task EnsureRolesCreated(RoleManager<IdentityRole> roleManager)
    {
        string[] roles = { "Admin", "User", "Manager" };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }
}
```

In the `RoleHelper` class, we define a method called `EnsureRolesCreated` which:

- Accepts a `RoleManager` instance to interact with the roles in the database.
- Defines an array of roles we want to set up ("Admin", "User", and "Manager").
- For each role, it checks if the role already exists using `RoleExistsAsync()`. If the role doesn't exist, it creates the role with `CreateAsync()`.

This way, you only need to call this method once during application startup to ensure all required roles are available for assignment.

## Authorization Policies

In this section, we're adding authorization to protect certain API endpoints, so that only authenticated users or users with specific roles can access them.

Create a protected endpoint that requires authentication, and an admin-only endpoint. You can create this in a new file, `Controllers/SecureController.cs`:

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SecureController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { message = "This is a secure endpoint" });
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpGet("admin")]
    public IActionResult AdminOnly()
    {
        return Ok(new { message = "This is an admin-only endpoint" });
    }
}
```

With the above, we created a new controller called `SecureController` with two endpoints:

1. General Protected Endpoint:

   - The `/api/secure` route is protected with `[Authorize]`, allowing access only to authenticated users with a valid JWT token.
   - If access is granted, it returns a confirmation message.

2. Admin-Only Endpoint:
   - The `/api/secure/admin` route is restricted to users with the "Admin" role using `[Authorize(Policy = "RequireAdminRole")]`.
   - Only "Admin" users can access this. Others will receive a `403 Forbidden` response.

Using the same approach, you can create additional policies for different roles or permissions. This allows you to control access to your API endpoints based on user roles.

## Database Migrations

To set up your database schema, we need to run migrations. Migrations help keep your database in sync with your data models, allowing you to make changes to your schema without losing data.

Run the following commands to create the database and apply migrations:

- Create the initial migration:

```bash
dotnet ef migrations add InitialCreate
```

- Apply the migration to the database:

```bash
dotnet ef database update
```

If you were to make changes to your data models in the future, you would create a new migration and apply it using the same commands. Via the Neon console, you will now see the tables created by ASP.NET Identity.

## Testing Authentication

You can test your authentication endpoints using Postman or `curl` to actually verify that everything is working correctly. Let's quickly do that using `curl`.

### 1. Register a New User

To create a new account, send a `POST` request to the `/api/auth/register` endpoint with the user details:

```json
curl -X POST http://localhost:5241/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
           "email": "test@example.com",
           "password": "SecurePass123!",
           "firstName": "John",
           "lastName": "Doe"
         }'
```

This should return a response confirming that the user was successfully registered. Make sure to use a strong password and valid email format as our password policy requires it.

### 2. Log In and Get a JWT Token

Once registered, log in using the credentials you just created. Send a `POST` request to the `/api/auth/login` endpoint:

```json
curl -X POST http://localhost:5241/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
           "email": "test@example.com",
           "password": "SecurePass123!"
         }'
```

If the login is successful, you'll receive a JSON response containing a JWT access token. Save this token securely, as it will be used to access protected routes.

### 3. Access a Protected Endpoint

With the JWT token from the previous step, you can now access secured endpoints. Send a `GET` request to `/api/secure` and include the token in the `Authorization` header:

```bash
curl -X GET http://localhost:5241/api/secure \
     -H "Authorization: Bearer <your-jwt-token>"
```

If the token is valid, you'll receive a response from the protected resource. If not, you'll get an authentication error, indicating the token has expired or is invalid.

## User Session Management with Refresh Tokens

As an optional step, to improve user session management, we'll implement a two-token authentication system using both access tokens and refresh tokens:

- An access token which is a short-lived JWT used to authenticate API requests
- A longer-lived tokens used to obtain new access tokens without requiring re-login

### Setting Up the Token System

First, create a model for refresh tokens in `Models/RefreshToken.cs` with an ID, token, and expiry date:

```csharp
public class RefreshToken
{
    public int Id { get; set; }
    public string Token { get; set; }
    public DateTime ExpiryDate { get; set; } = DateTime.UtcNow.AddDays(7);
}
```

Next, update the `ApplicationUser` model to store refresh tokens:

```csharp
public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public List<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}
```

### Implementing Token Management

Modify the login endpoint to return both the access and the refresh tokens:

```csharp
[HttpPost("login")]
public async Task<IActionResult> Login(LoginDto model)
{
    var user = await _userManager.FindByEmailAsync(model.Email);
    if (user == null)
    {
        return BadRequest("Invalid credentials");
    }

    var result = await _signInManager.CheckPasswordSignInAsync(
        user, model.Password, lockoutOnFailure: false);

    if (result.Succeeded)
    {
        // Generate both tokens
        var accessToken = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        // Save refresh token to user
        user.RefreshTokens.Add(refreshToken);
        await _userManager.UpdateAsync(user);

        return Ok(new
        {
            accessToken = accessToken,
            refreshToken = refreshToken.Token
        });
    }

    return BadRequest("Invalid credentials");
}
```

Add the refresh token endpoint to obtain new tokens:

```csharp
[HttpPost("refresh-token")]
public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto refreshTokenDto)
{
    var user = await _userManager.Users
        .SingleOrDefaultAsync(u => u.RefreshTokens
            .Any(t => t.Token == refreshTokenDto.Token &&
                     t.ExpiryDate > DateTime.UtcNow));

    if (user == null)
        return BadRequest("Invalid token");

    var newAccessToken = GenerateJwtToken(user);
    var newRefreshToken = GenerateRefreshToken();

    // Remove old refresh token
    user.RefreshTokens.RemoveAll(t => t.Token == refreshTokenDto.Token);
    user.RefreshTokens.Add(newRefreshToken);
    await _userManager.UpdateAsync(user);

    return Ok(new
    {
        accessToken = newAccessToken,
        refreshToken = newRefreshToken.Token
    });
}

private RefreshToken GenerateRefreshToken()
{
    return new RefreshToken
    {
        Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
        ExpiryDate = DateTime.UtcNow.AddDays(7)
    };
}

public class RefreshTokenDto
{
    [Required]
    public string Token { get; set; }
}
```

Here we've added a new endpoint `/api/auth/refresh-token` that accepts a refresh token and returns new access and refresh tokens. The refresh token is stored in the user's `RefreshTokens` list and used to generate new tokens when needed. The refresh token is valid for 7 days, after which the user will need to log in again.

### Using the Token System

Unlike the standard login flow, the new flow involves three steps:

1. User logs in with credentials:

   ```json
   curl -X POST http://localhost:5241/api/auth/login \
       -H "Content-Type: application/json" \
       -d '{
           "email": "user@example.com",
           "password": "password123"
           }'
   ```

   Response includes both tokens:

   ```json
   {
     "accessToken": "eyJhbG...",
     "refreshToken": "long-base64-string..."
   }
   ```

2. Use the access token for API requests:

   ```bash
   curl -X GET http://localhost:5241/api/protected-endpoint \
       -H "Authorization: Bearer eyJhbG..."
   ```

3. When the access token expires, use the refresh token to get new tokens:

   ```json
   curl -X POST http://localhost:5241/api/auth/refresh-token \
       -H "Content-Type: application/json" \
       -d '{
           "token": "long-base64-string..."
           }'
   ```

   This returns new access and refresh tokens:

   ```json
   {
     "accessToken": "new-eyJhbG...",
     "refreshToken": "new-long-base64-string..."
   }
   ```

As a security measure, store refresh tokens securely in your Neon database while also making sure that clients use secure methods like HTTP-only cookies. Also, keep access tokens short-lived, rotate refresh tokens on refresh, and implement token expiration and revocation to enhance security.

## Integrating Auth0 for Authentication and Authorization (Optional)

If you're looking to add an extra layer of security and use external identity providers, integrating your ASP.NET Core application with Auth0 is a good option. This allows your users to authenticate using social accounts (like Google, GitHub, etc.) or enterprise identity providers.

Auth0 offers a flexible platform for managing user authentication, with built-in JWT token support that integrates seamlessly with your existing ASP.NET Core application.

Let's quickly walk through setting up Auth0 with ASP.NET Core for secure authentication and authorization.

### Setting Up Auth0 with ASP.NET Core

To get started, follow these high-level steps:

1. Start by creating an Auth0 API:

   - Log in to your [Auth0 Dashboard](https://manage.auth0.com/).
   - Navigate to the "APIs" section and click **Create API**.
   - Provide a name and a unique identifier for your API (e.g., `https://your-app.com/api`). Keep the default signing algorithm as `RS256`.

2. In the API settings, you can define permissions (scopes) to control access to your API endpoints. For example, you can create a `read:messages` permission to restrict access to certain routes.

3. Open your `appsettings.json` and add the following configuration:

   ```json
   "Auth0": {
     "Domain": "your-auth0-domain",
     "Audience": "https://your-app.com/api"
   }
   ```

4. Make sure you have the required packages installed if you haven't already as in the previous steps:

   ```bash
   dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
   ```

5. Update the `Program.cs` file to add the authentication middleware:

   ```csharp
   var builder = WebApplication.CreateBuilder(args);
   var domain = $"https://{builder.Configuration["Auth0:Domain"]}/";

   builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
       .AddJwtBearer(options =>
       {
           options.Authority = domain;
           options.Audience = builder.Configuration["Auth0:Audience"];
           options.TokenValidationParameters = new TokenValidationParameters
           {
               NameClaimType = ClaimTypes.NameIdentifier
           };
       });

   builder.Services.AddAuthorization(options =>
   {
       options.AddPolicy("read:messages", policy =>
           policy.Requirements.Add(new HasScopeRequirement("read:messages", domain)));
   });

   builder.Services.AddSingleton<IAuthorizationHandler, HasScopeHandler>();

   var app = builder.Build();
   app.UseAuthentication();
   app.UseAuthorization();
   app.MapControllers();
   ```

With all that in place, you can secure your API endpoints using Auth0, use the `[Authorize]` attribute:

```csharp
[ApiController]
[Route("api")]
public class ApiController : ControllerBase
{
    // Requires authentication
    [HttpGet("private")]
    [Authorize]
    public IActionResult PrivateEndpoint()
    {
        return Ok(new { Message = "Hello from a private endpoint!" });
    }

    // Requires specific scope
    [HttpGet("private-scoped")]
    [Authorize("read:messages")]
    public IActionResult ScopedEndpoint()
    {
        return Ok(new { Message = "Hello from a scoped endpoint!" });
    }
}
```

For a more information on integrating Auth0 with ASP.NET Core, refer to the [Auth0 Documentation](https://auth0.com/docs/quickstart/backend/aspnet-core-webapi/01-authorization). The documentation covers everything from setting up your Auth0 tenant to configuring scopes and securing your APIs.

## Conclusion

In this guide, we implemented a secure authentication and authorization system in an ASP.NET Core application using ASP.NET Identity with Neon Postgres as the backend. We walked through setting up user registration and login endpoints, securing API routes with JWT tokens, and implementing role-based authorization.

For more information, check out:

- [ASP.NET Core Identity Documentation](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity)
- [JWT Authentication in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/jwt-bearer)
- [Neon Documentation](/docs)

<NeedHelp />
