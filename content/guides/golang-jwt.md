---
title: Creating a Secure Authentication System with Go, JWT, and Neon Postgres
subtitle: Learn how to build a secure authentication system using Go, JWT tokens, and Neon Postgres
author: bobbyiliev
enableTableOfContents: true
createdAt: '2025-03-29T00:00:00.000Z'
updatedOn: '2025-03-29T00:00:00.000Z'
---

Authentication is the foundation of web applications, it ensures that users are who they claim to be. In this guide, you'll learn how to create a secure authentication system using Go, JSON Web Tokens (JWT), and Neon Postgres.

We'll focus on the essential concepts and patterns for implementing a robust authentication system, including user registration, secure password storage, token-based authentication, and protected routes.

## Prerequisites

To follow the steps in this guide, you will need:

- [Go](https://go.dev/dl/) 1.20 or later installed
- A [Neon](https://console.neon.tech/signup) account
- Basic familiarity with SQL, Go programming, and authentication concepts

## Understanding JWT in Our Go Authentication System

Before we dive into the implementation details, let's understand how JSON Web Tokens (JWT) work and why they're a popular choice for authentication systems.

JWT provides a compact, self-contained way to securely transmit information as a JSON object. In our Go authentication system, we'll use JWTs to maintain user sessions without server-side storage.

### JWT Structure

A JWT consists of three parts encoded in `Base64URL` format and separated by dots:

```go
Header.Payload.Signature
```

For example:

```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZXhwIjoxNjgwMDAwMDAwfQ.8Gj_9bJjAqQ-5j3iCKMzVnlg-d1Kk-fXnOKC1Vt2fGc
```

1. The header identifies the algorithm used for signing:

   ```go
   // In Go, the header is typically handled by the JWT library
   token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
   ```

2. The payload contains claims about the user like ID, roles, and expiration time

   ```go
   // Creating claims in Go
   claims := jwt.MapClaims{
       "sub": user.ID.String(),
       "username": user.Username,
       "exp": time.Now().Add(15 * time.Minute).Unix(),
   }
   ```

3. The signature verifies the token hasn't been tampered with
   ```go
   // Signing the token with our secret
   tokenString, err := token.SignedString([]byte(jwtSecret))
   ```

### How Our JWT Flow Works

To understand how JWT fits into our Go authentication system, let's walk through the flow of a user logging in and accessing protected routes:

1. When a user successfully authenticates, our Go service:

   - Validates credentials against Neon Postgres
   - Creates JWT with appropriate claims and expiration
   - Signs the token with a secret key

2. The client:

   - Stores the JWT (typically in `localStorage` or a secure cookie)
   - Includes the token in the `Authorization` header for subsequent requests

   ```
   Authorization: Bearer eyJhbGciOiJIUzI1Ni...
   ```

3. Our middleware:

   - Extracts the JWT from the request header
   - Validates the signature using our secret key
   - Checks that the token hasn't expired
   - Extracts the user identity from claims
   - Adds the user ID to the request context

4. Since the token contains all necessary user information, our server can authenticate requests without maintaining session state or additional database queries.

The security of this system relies on keeping the signing key secret and using short-lived access tokens. If a token is compromised, it's only valid for a limited time, reducing the risk of unauthorized access.

## Create a Neon project

First, let's create a Neon project to store our authentication data.

1. Navigate to the [Neon Console](https://console.neon.tech/app/projects) and click New Project.
2. Give your project a name, such as "auth-system".
3. Choose your preferred region.
4. Click Create Project.

Once your project is created, you'll receive a connection string that looks like this:

```
postgres://[user]:[password]@[hostname]/[dbname]?sslmode=require
```

Save this connection string, you'll need it to connect your Go application to the Neon database.

## Set up the database schema

Now we'll create a database schema that securely stores user information and authentication tokens. Connect to your Neon database and run the following SQL to create the necessary tables:

```sql
-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create refresh_tokens table
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create indexes for fast lookups
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
```

This schema includes several key features for security and performance:

- Using **UUIDs** for primary keys instead of sequential integers, making it harder to guess or enumerate IDs
- Storing only **password hashes**, never plain-text passwords
- Creating a separate table for **refresh tokens** with an expiration date
- Using a **token revocation flag** to invalidate tokens when needed
- Including appropriate **indexes** for performance optimization

## Create the Go application structure

Let's set up a new Go application with the necessary dependencies. Create a new directory and initialize a Go module:

```bash
mkdir auth-system
cd auth-system
go mod init github.com/yourusername/auth-system
```

Make sure to replace `yourusername` with your GitHub username or organization name. This will be the base path for your Go modules.

Install the essential packages:

```bash
go get github.com/lib/pq               # PostgreSQL driver
go get github.com/gorilla/mux          # HTTP router
go get github.com/golang-jwt/jwt/v5    # JWT library
go get golang.org/x/crypto/bcrypt      # Password hashing
go get github.com/google/uuid          # UUID generation
go get github.com/joho/godotenv        # Load environment variables
```

For this guide, let's focus on the key components we'll need:

1. Database connection
2. User model and repository
3. Authentication service
4. HTTP handlers
5. Middleware for route protection

Let's start with a connection to our Neon database:

```go
// db/db.go
package db

import (
    "database/sql"
    "log"

    _ "github.com/lib/pq"
)

// Connect establishes a connection to the Postgres database
func Connect(connectionString string) (*sql.DB, error) {
    db, err := sql.Open("postgres", connectionString)
    if err != nil {
        return nil, err
    }

    // Test the connection
    if err := db.Ping(); err != nil {
        return nil, err
    }

    log.Println("Connected to the database successfully")
    return db, nil
}
```

This simple function connects to our Neon Postgres database and verifies the connection with a ping.

## Implement password handling

Let's create functions to hash passwords during registration and verify them during login:

```go
// auth/passwords.go
package auth

import (
    "golang.org/x/crypto/bcrypt"
)

// HashPassword creates a bcrypt hash from a plain-text password
func HashPassword(password string) (string, error) {
    // The cost determines how computationally expensive the hash is
    // Higher is more secure but slower (default is 10)
    hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    if err != nil {
        return "", err
    }
    return string(hashedBytes), nil
}

// VerifyPassword checks if the provided password matches the stored hash
func VerifyPassword(hashedPassword, providedPassword string) error {
    return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(providedPassword))
}
```

Bcrypt is used for password hashing because:

1. It's slow by design, making brute-force attacks impractical
2. It automatically includes a salt to protect against rainbow table attacks
3. It has an adjustable cost factor to increase security as hardware gets faster
4. It's a one-way function that can't be reversed to obtain the original password

When a user registers, we'll hash their password before storing it. When they log in, we'll compare their provided password against the stored hash.

Now, let's create a simple user model and repository to interact with our database:

```go
// models/user.go
package models

import (
    "database/sql"
    "time"

    "github.com/google/uuid"
)

// User represents a user in our system
type User struct {
    ID           uuid.UUID
    Email        string
    Username     string
    PasswordHash string
    CreatedAt    time.Time
    LastLogin    *time.Time
}

// UserRepository handles database operations for users
type UserRepository struct {
    db *sql.DB
}

// NewUserRepository creates a new user repository
func NewUserRepository(db *sql.DB) *UserRepository {
    return &UserRepository{db: db}
}

// CreateUser adds a new user to the database
func (r *UserRepository) CreateUser(email, username, passwordHash string) (*User, error) {
    user := &User{
        ID:           uuid.New(),
        Email:        email,
        Username:     username,
        PasswordHash: passwordHash,
        CreatedAt:    time.Now(),
    }

    query := `
        INSERT INTO users (id, email, username, password_hash, created_at)
        VALUES ($1, $2, $3, $4, $5)
    `

    _, err := r.db.Exec(query, user.ID, user.Email, user.Username, user.PasswordHash, user.CreatedAt)
    if err != nil {
        return nil, err
    }

    return user, nil
}

// GetUserByEmail retrieves a user by their email address
func (r *UserRepository) GetUserByEmail(email string) (*User, error) {
    query := `SELECT id, email, username, password_hash, created_at, last_login FROM users WHERE email = $1`

    var user User
    var lastLogin sql.NullTime

    err := r.db.QueryRow(query, email).Scan(
        &user.ID,
        &user.Email,
        &user.Username,
        &user.PasswordHash,
        &user.CreatedAt,
        &lastLogin,
    )

    if err != nil {
        return nil, err
    }

    if lastLogin.Valid {
        user.LastLogin = &lastLogin.Time
    }

    return &user, nil
}

// GetUserByID retrieves a user by their ID
func (r *UserRepository) GetUserByID(id uuid.UUID) (*User, error) {
    query := `SELECT id, email, username, password_hash, created_at, last_login FROM users WHERE id = $1`

    var user User
    var lastLogin sql.NullTime

    err := r.db.QueryRow(query, id).Scan(
        &user.ID,
        &user.Email,
        &user.Username,
        &user.PasswordHash,
        &user.CreatedAt,
        &lastLogin,
    )

    if err != nil {
        return nil, err
    }

    if lastLogin.Valid {
        user.LastLogin = &lastLogin.Time
    }

    return &user, nil
}
```

This simple repository provides methods to create new users and retrieve existing users by email, which we'll need for our authentication logic. The `User` struct represents the core user data we'll store in the database.

Additionally, we store the `last_login` timestamp to track user activity along with the creation timestamp.

## Create the JWT authentication system

With the database and user handling in place, let's implement the core of our authentication system using JWT. We'll create a service that handles login verification and token generation:

```go
// auth/service.go
package auth

import (
    "database/sql"
    "errors"
    "time"

    "github.com/golang-jwt/jwt/v5"
    "github.com/yourusername/auth-system/models"
)

var (
    ErrInvalidCredentials = errors.New("invalid credentials")
    ErrInvalidToken       = errors.New("invalid token")
    ErrExpiredToken       = errors.New("token has expired")
    ErrEmailInUse         = errors.New("email already in use")
)

// AuthService provides authentication functionality
type AuthService struct {
    userRepo         *models.UserRepository
    refreshTokenRepo *models.RefreshTokenRepository
    jwtSecret        []byte
    accessTokenTTL   time.Duration
}

// NewAuthService creates a new authentication service
func NewAuthService(userRepo *models.UserRepository, refreshTokenRepo *models.RefreshTokenRepository, jwtSecret string, accessTokenTTL time.Duration) *AuthService {
    return &AuthService{
        userRepo:         userRepo,
        refreshTokenRepo: refreshTokenRepo,
        jwtSecret:        []byte(jwtSecret),
        accessTokenTTL:   accessTokenTTL,
    }
}

// Register creates a new user with the provided credentials
func (s *AuthService) Register(email, username, password string) (*models.User, error) {
    // Check if user already exists
    _, err := s.userRepo.GetUserByEmail(email)
    if err == nil {
        return nil, ErrEmailInUse
    }

    // Only proceed if the error was "user not found"
    if !errors.Is(err, sql.ErrNoRows) {
        return nil, err
    }

    // Hash the password
    hashedPassword, err := HashPassword(password)
    if err != nil {
        return nil, err
    }

    // Create the user
    user, err := s.userRepo.CreateUser(email, username, hashedPassword)
    if err != nil {
        return nil, err
    }

    return user, nil
}

// Login authenticates a user and returns an access token
func (s *AuthService) Login(email, password string) (string, error) {
    // Get the user from the database
    user, err := s.userRepo.GetUserByEmail(email)
    if err != nil {
        return "", ErrInvalidCredentials
    }

    // Verify the password
    if err := VerifyPassword(user.PasswordHash, password); err != nil {
        return "", ErrInvalidCredentials
    }

    // Generate an access token
    token, err := s.generateAccessToken(user)
    if err != nil {
        return "", err
    }

    return token, nil
}

// generateAccessToken creates a new JWT access token
func (s *AuthService) generateAccessToken(user *models.User) (string, error) {
    // Set the expiration time
    expirationTime := time.Now().Add(s.accessTokenTTL)

    // Create the JWT claims
    claims := jwt.MapClaims{
        "sub":      user.ID.String(),      // subject (user ID)
        "username": user.Username,         // custom claim
        "email":    user.Email,            // custom claim
        "exp":      expirationTime.Unix(), // expiration time
        "iat":      time.Now().Unix(),     // issued at time
    }

    // Create the token with claims
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

    // Sign the token with our secret key
    tokenString, err := token.SignedString(s.jwtSecret)
    if err != nil {
        return "", err
    }

    return tokenString, nil
}

// ValidateToken verifies a JWT token and returns the claims
func (s *AuthService) ValidateToken(tokenString string) (jwt.MapClaims, error) {
    // Parse the token
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        // Validate the signing method
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, ErrInvalidToken
        }
        return s.jwtSecret, nil
    })

    if err != nil {
        if errors.Is(err, jwt.ErrTokenExpired) {
            return nil, ErrExpiredToken
        }
        return nil, ErrInvalidToken
    }

    // Extract and validate claims
    if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
        return claims, nil
    }

    return nil, ErrInvalidToken
}
```

This authentication service handles three key functions:

1. **Login**: Verifies a user's credentials and issues an access token
2. **Token Generation**: Creates a JWT with appropriate claims and expiration
3. **Token Validation**: Verifies that a token is valid and not expired

Now let's create HTTP handlers to expose these authentication features via an API:

```go
// handlers/auth.go
package handlers

import (
    "encoding/json"
    "errors"
    "net/http"

    "github.com/yourusername/auth-system/auth"
)

// AuthHandler contains HTTP handlers for authentication
type AuthHandler struct {
    authService *auth.AuthService
}

// NewAuthHandler creates a new auth handler
func NewAuthHandler(authService *auth.AuthService) *AuthHandler {
    return &AuthHandler{
        authService: authService,
    }
}

// RegisterRequest represents the registration payload
type RegisterRequest struct {
    Email    string `json:"email"`
    Username string `json:"username"`
    Password string `json:"password"`
}

// RegisterResponse contains the user data after successful registration
type RegisterResponse struct {
    ID       string `json:"id"`
    Email    string `json:"email"`
    Username string `json:"username"`
}

// Register handles user registration
func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
    // Parse the request body
    var req RegisterRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "Invalid request payload", http.StatusBadRequest)
        return
    }

    // Validate input
    if req.Email == "" || req.Username == "" || req.Password == "" {
        http.Error(w, "Email, username, and password are required", http.StatusBadRequest)
        return
    }

    // Call the auth service to register the user
    user, err := h.authService.Register(req.Email, req.Username, req.Password)
    if err != nil {
        if errors.Is(err, auth.ErrEmailInUse) {
            http.Error(w, "Email already in use", http.StatusConflict)
            return
        }

        http.Error(w, "Error creating user", http.StatusInternalServerError)
        return
    }

    // Return the created user (without sensitive data)
    response := RegisterResponse{
        ID:       user.ID.String(),
        Email:    user.Email,
        Username: user.Username,
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(response)
}

// LoginRequest represents the login payload
type LoginRequest struct {
    Email    string `json:"email"`
    Password string `json:"password"`
}

// LoginResponse contains the JWT token after successful login
type LoginResponse struct {
    Token string `json:"token"`
}

// Login handles user login
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
    // Parse the request body
    var req LoginRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "Invalid request payload", http.StatusBadRequest)
        return
    }

    // Attempt to login
    token, err := h.authService.Login(req.Email, req.Password)
    if err != nil {
        if errors.Is(err, auth.ErrInvalidCredentials) {
            http.Error(w, "Invalid credentials", http.StatusUnauthorized)
        } else {
            http.Error(w, "Internal server error", http.StatusInternalServerError)
        }
        return
    }

    // Return the token
    response := LoginResponse{Token: token}
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}
```

This handler exposes a simple login endpoint that accepts an email and password, verifies the credentials, and returns a JWT token on success.

## Implement refresh tokens

Short-lived access tokens are more secure, but they require users to log in frequently.

To improve user experience while maintaining security, we can implement a refresh token system. This essentially creates a two-tier authentication system, where a long-lived refresh token is used to obtain short-lived access tokens.

The refresh token can be revoked if needed allowing for better control over user sessions.

First, let's add support for refresh tokens to our database operations:

```go
// models/refresh_token.go
package models

import (
    "database/sql"
    "time"

    "github.com/google/uuid"
)

// RefreshToken represents a refresh token in the system
type RefreshToken struct {
    ID        uuid.UUID
    UserID    uuid.UUID
    Token     string
    ExpiresAt time.Time
    CreatedAt time.Time
    Revoked   bool
}

// RefreshTokenRepository handles database operations for refresh tokens
type RefreshTokenRepository struct {
    db *sql.DB
}

// NewRefreshTokenRepository creates a new refresh token repository
func NewRefreshTokenRepository(db *sql.DB) *RefreshTokenRepository {
    return &RefreshTokenRepository{db: db}
}

// CreateRefreshToken creates a new refresh token for a user
func (r *RefreshTokenRepository) CreateRefreshToken(userID uuid.UUID, ttl time.Duration) (*RefreshToken, error) {
    // Generate a unique token identifier
    tokenID := uuid.New()
    expiresAt := time.Now().Add(ttl)

    token := &RefreshToken{
        ID:        tokenID,
        UserID:    userID,
        Token:     tokenID.String(), // Use the UUID as the token
        ExpiresAt: expiresAt,
        CreatedAt: time.Now(),
        Revoked:   false,
    }

    query := `
        INSERT INTO refresh_tokens (id, user_id, token, expires_at, created_at, revoked)
        VALUES ($1, $2, $3, $4, $5, $6)
    `

    _, err := r.db.Exec(query, token.ID, token.UserID, token.Token, token.ExpiresAt, token.CreatedAt, token.Revoked)
    if err != nil {
        return nil, err
    }

    return token, nil
}

// GetRefreshToken retrieves a refresh token by its token string
func (r *RefreshTokenRepository) GetRefreshToken(tokenString string) (*RefreshToken, error) {
    query := `
        SELECT id, user_id, token, expires_at, created_at, revoked
        FROM refresh_tokens
        WHERE token = $1
    `

    var token RefreshToken
    err := r.db.QueryRow(query, tokenString).Scan(
        &token.ID,
        &token.UserID,
        &token.Token,
        &token.ExpiresAt,
        &token.CreatedAt,
        &token.Revoked,
    )

    if err != nil {
        return nil, err
    }

    return &token, nil
}

// RevokeRefreshToken marks a refresh token as revoked
func (r *RefreshTokenRepository) RevokeRefreshToken(tokenString string) error {
    query := `
        UPDATE refresh_tokens
        SET revoked = true
        WHERE token = $1
    `

    _, err := r.db.Exec(query, tokenString)
    return err
}
```

Now let's extend our `AuthService` to handle refresh tokens:

```go
// auth/service.go (existing methods)

// LoginWithRefresh authenticates a user and returns both access and refresh tokens
func (s *AuthService) LoginWithRefresh(email, password string, refreshTokenTTL time.Duration) (accessToken string, refreshToken string, err error) {
    // Get the user from the database
    user, err := s.userRepo.GetUserByEmail(email)
    if err != nil {
        return "", "", ErrInvalidCredentials
    }

    // Verify the password
    if err := VerifyPassword(user.PasswordHash, password); err != nil {
        return "", "", ErrInvalidCredentials
    }

    // Generate an access token
    accessToken, err = s.generateAccessToken(user)
    if err != nil {
        return "", "", err
    }

    // Create a refresh token
    token, err := s.refreshTokenRepo.CreateRefreshToken(user.ID, refreshTokenTTL)
    if err != nil {
        return "", "", err
    }

    return accessToken, token.Token, nil
}

// RefreshAccessToken creates a new access token using a refresh token
func (s *AuthService) RefreshAccessToken(refreshTokenString string) (string, error) {
    // Retrieve the refresh token
    token, err := s.refreshTokenRepo.GetRefreshToken(refreshTokenString)
    if err != nil {
        return "", ErrInvalidToken
    }

    // Check if the token is valid
    if token.Revoked {
        return "", ErrInvalidToken
    }

    // Check if the token has expired
    if time.Now().After(token.ExpiresAt) {
        return "", ErrExpiredToken
    }

    // Get the user
    user, err := s.userRepo.GetUserByID(token.UserID)
    if err != nil {
        return "", err
    }

    // Generate a new access token
    accessToken, err := s.generateAccessToken(user)
    if err != nil {
        return "", err
    }

    return accessToken, nil
}
```

The main benefit of refresh tokens is that they:

1. Allow access tokens to be short-lived (e.g., 15 minutes), which reduces the risk if they're leaked
2. Enable longer sessions without requiring frequent logins
3. Can be revoked server-side if needed, such as on logout or if a security breach is detected

Let's add an HTTP handler for refreshing tokens:

```go
// handlers/auth.go (existing methods)

// RefreshRequest represents the refresh token payload
type RefreshRequest struct {
    RefreshToken string `json:"refresh_token"`
}

// RefreshResponse contains the new access token
type RefreshResponse struct {
    Token string `json:"token"`
}

// RefreshToken handles access token refresh
func (h *AuthHandler) RefreshToken(w http.ResponseWriter, r *http.Request) {
    // Parse the request body
    var req RefreshRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "Invalid request payload", http.StatusBadRequest)
        return
    }

    // Attempt to refresh the token
    token, err := h.authService.RefreshAccessToken(req.RefreshToken)
    if err != nil {
        if errors.Is(err, auth.ErrInvalidToken) || errors.Is(err, auth.ErrExpiredToken) {
            http.Error(w, "Invalid or expired refresh token", http.StatusUnauthorized)
        } else {
            http.Error(w, "Internal server error", http.StatusInternalServerError)
        }
        return
    }

    // Return the new access token
    response := RefreshResponse{Token: token}
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}
```

The additional `RefreshToken` method allows clients to obtain a new access token using a valid refresh token. This endpoint is useful for maintaining user sessions without requiring frequent logins.

## Create protected routes

Now let's create middleware to protect routes that require authentication:

```go
// middleware/auth.go
package middleware

import (
    "context"
    "net/http"
    "strings"

    "github.com/google/uuid"
    "github.com/yourusername/auth-system/auth"
)

// Key type for context values
type contextKey string

const (
    // UserIDKey is the key for user ID in the request context
    UserIDKey contextKey = "userID"
)

// AuthMiddleware checks JWT tokens and adds user info to the request context
func AuthMiddleware(authService *auth.AuthService) func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            // Extract token from Authorization header
            authHeader := r.Header.Get("Authorization")
            if authHeader == "" {
                http.Error(w, "Authorization header required", http.StatusUnauthorized)
                return
            }

            // Check Bearer token format
            parts := strings.Split(authHeader, " ")
            if len(parts) != 2 || parts[0] != "Bearer" {
                http.Error(w, "Invalid authorization format", http.StatusUnauthorized)
                return
            }

            tokenString := parts[1]

            // Validate the token
            claims, err := authService.ValidateToken(tokenString)
            if err != nil {
                http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
                return
            }

            // Extract user ID from claims
            userIDStr, ok := claims["sub"].(string)
            if !ok {
                http.Error(w, "Invalid token claims", http.StatusUnauthorized)
                return
            }

            userID, err := uuid.Parse(userIDStr)
            if err != nil {
                http.Error(w, "Invalid user ID in token", http.StatusUnauthorized)
                return
            }

            // Add user ID to request context
            ctx := context.WithValue(r.Context(), UserIDKey, userID)

            // Call the next handler with the enhanced context
            next.ServeHTTP(w, r.WithContext(ctx))
        })
    }
}

// GetUserID retrieves the user ID from the request context
func GetUserID(r *http.Request) (uuid.UUID, bool) {
    userID, ok := r.Context().Value(UserIDKey).(uuid.UUID)
    return userID, ok
}
```

This middleware extracts the JWT token from the `Authorization` header, validates it, and adds the user ID to the request context. This allows subsequent handlers to access the authenticated user's identity.

Now we can create a protected endpoint that requires authentication:

```go
// handlers/user.go
package handlers

import (
    "encoding/json"
    "net/http"

    "github.com/yourusername/auth-system/middleware"
    "github.com/yourusername/auth-system/models"
)

// UserHandler contains HTTP handlers for user-related endpoints
type UserHandler struct {
    userRepo *models.UserRepository
}

// NewUserHandler creates a new user handler
func NewUserHandler(userRepo *models.UserRepository) *UserHandler {
    return &UserHandler{
        userRepo: userRepo,
    }
}

// UserResponse represents the user data returned to clients
type UserResponse struct {
    ID       string  `json:"id"`
    Email    string  `json:"email"`
    Username string  `json:"username"`
}

// Profile returns the authenticated user's profile
func (h *UserHandler) Profile(w http.ResponseWriter, r *http.Request) {
    // Get user ID from request context (set by auth middleware)
    userID, ok := middleware.GetUserID(r)
    if !ok {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    // Get user from database
    user, err := h.userRepo.GetUserByID(userID)
    if err != nil {
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }

    // Return user profile (excluding sensitive data)
    response := UserResponse{
        ID:       user.ID.String(),
        Email:    user.Email,
        Username: user.Username,
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}
```

The auth middleware handles a few key tasks:

1. Extracting the JWT token from the Authorization header
2. Validating the token signature and expiration
3. Adding the authenticated user's ID to the request context
4. Rejecting requests with invalid or missing tokens

To wire everything up, we need to register our routes with the appropriate middleware:

```go
// main.go

package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/yourusername/auth-system/auth"
	"github.com/yourusername/auth-system/db"
	"github.com/yourusername/auth-system/handlers"
	"github.com/yourusername/auth-system/middleware"
	"github.com/yourusername/auth-system/models"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

// loadEnv loads environment variables from .env file
func loadEnv() {
    // Load .env file if it exists
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found, using environment variables")
    }

    // Check required variables
    requiredVars := []string{"DATABASE_URL", "JWT_SECRET"}
    for _, v := range requiredVars {
        if os.Getenv(v) == "" {
            log.Fatalf("Required environment variable %s is not set", v)
        }
    }
}

func main() {
    // Load environment variables
    loadEnv()

    // Connect to the database
    database, err := db.Connect(os.Getenv("DATABASE_URL"))
    if err != nil {
        log.Fatalf("Failed to connect to database: %v", err)
    }

    r := mux.NewRouter()

    // Create repositories
    userRepo := models.NewUserRepository(database)
    refreshTokenRepo := models.NewRefreshTokenRepository(database)

    // Create services
    authService := auth.NewAuthService(userRepo, refreshTokenRepo, os.Getenv("JWT_SECRET"), 15*time.Minute)

    // Create handlers
    authHandler := handlers.NewAuthHandler(authService)
    userHandler := handlers.NewUserHandler(userRepo)

    // Public routes
    r.HandleFunc("/api/auth/register", authHandler.Register).Methods("POST")
    r.HandleFunc("/api/auth/login", authHandler.Login).Methods("POST")
    r.HandleFunc("/api/auth/refresh", authHandler.RefreshToken).Methods("POST")

    // Protected routes
    protected := r.PathPrefix("/api").Subrouter()
    protected.Use(middleware.AuthMiddleware(authService))

    protected.HandleFunc("/profile", userHandler.Profile).Methods("GET")

    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }
    log.Printf("Server starting on port %s", port)
    log.Fatal(http.ListenAndServe(":"+port, r))
}
```

## Test and deploy the application

Before testing our authentication system, we need to set up environment variables and start the application.

### Setting environment variables

Create a `.env` file in the root of your project with the following variables:

```
# Database connection
DATABASE_URL=postgres://[user]:[password]@[hostname]/[dbname]?sslmode=require

# JWT configuration
JWT_SECRET=your-very-secure-jwt-secret-key
REFRESH_SECRET=your-very-secure-refresh-secret-key
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Server configuration
PORT=8080
```

Replace the `DATABASE_URL` with your actual Neon connection string. The JWT secrets should be strong, random strings in production (at least 32 characters). For testing purposes, you can use simpler values.

### Starting the application

To start the application, first, make sure you've built your Go binary:

```bash
go build -o auth-server main.go
```

Then, run the binary:

```bash
./auth-server
```

Alternatively, you can use `go run`:

```bash
go run main.go
```

You should see output similar to:

```
2025/03/30 12:34:56 Connected to the database successfully
2025/03/30 12:34:56 Server starting on port 8080
```

The server is now running and ready to accept requests.

### Testing with curl

Now let's test our authentication system using curl commands:

1. First, register a new user:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "SecureP@ssw0rd!"
  }'
```

Expected response:

```json
{
  "id": "a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890",
  "email": "user@example.com",
  "username": "testuser"
}
```

2. Next, log in to get access and refresh tokens:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecureP@ssw0rd!"
  }'
```

Expected response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "c3d4e5f6-7890-a1b2-c3d4-e5f67890a1b2"
}
```

3. Save the access token and use it to access a protected endpoint:

```bash
export ACCESS_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:8080/api/profile \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

Expected response:

```json
{
  "id": "a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890",
  "email": "user@example.com",
  "username": "testuser"
}
```

4. When your access token expires, refresh it using the refresh token:

```bash
export REFRESH_TOKEN="c3d4e5f6-7890-a1b2-c3d4-e5f67890a1b2"

curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "'$REFRESH_TOKEN'"
  }'
```

Expected response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

5. You can also test an invalid token to see the authentication fail:

```bash
curl -X GET http://localhost:8080/api/profile \
  -H "Authorization: Bearer invalid-token"
```

Expected response:

```
Invalid or expired token
```

These tests verify that our authentication system is working correctly.

You can use tools like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) for more advanced API testing with a graphical interface.

## Summary

In this guide, you built a secure authentication system using Go, JWT, and Neon Postgres. The system includes secure password hashing, token-based authentication, refresh token support, middleware-protected routes, and basic rate limiting to prevent brute-force attacks. Security headers were also added to protect against common web vulnerabilities.

By using Neon Postgres as the database, you gain the scalability and performance of a serverless Postgres platform, without sacrificing the reliability and flexibility developers expect from PostgreSQL. It's an ideal foundation for authentication systems that need to scale securely and efficiently.

## Additional Resources

- [Neon Documentation](/docs)
- [Go Documentation](https://go.dev/doc/)
- [JWT Introduction](https://jwt.io/introduction)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

<NeedHelp />
