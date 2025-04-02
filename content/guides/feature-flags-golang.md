---
title: Implementing Feature Flags with Go, Neon Postgres, and Server-Side Rendering
subtitle: Learn how to create a feature flag system using Go, Neon Postgres, and server-side rendering for controlled feature rollouts
author: bobbyiliev
enableTableOfContents: true
createdAt: '2025-03-29T00:00:00.000Z'
updatedOn: '2025-03-29T00:00:00.000Z'
---

Feature flags are a technique that allows developers to modify system behavior without changing code. They enable you to control when features are visible to specific users, perform A/B testing, and implement kill switches for problematic features.

In this guide, you'll learn how to implement a feature flag system using Go, Neon Postgres, and server-side rendering. This approach allows for feature visibility decisions to happen on the server, providing better security and performance compared to client-side feature flags.

## Prerequisites

To follow the steps in this guide, you will need the following:

- [Go](https://golang.org/dl/) 1.20 or later installed
- A [Neon](https://console.neon.tech/signup) account
- Basic familiarity with SQL and Go programming
- [Docker](https://www.docker.com/get-started) (optional, for containerization)

## Create a Neon project

First, let's create a Neon project to store our feature flag configurations.

1. Navigate to the [Neon Console](https://console.neon.tech/app/projects) and click "New Project".
2. Give your project a name, such as "feature-flags".
3. Choose your preferred region.
4. Click "Create Project".

After your project is created, you'll receive a connection string that looks like this:

```
postgres://[user]:[password]@[hostname]/[dbname]?sslmode=require
```

Save this connection string, you'll need it to connect your Go application to the Neon database.

## Set up the database schema

Now that we have our Neon project, let's create the database schema for our feature flag system. We'll need tables to store feature flags, their rules, and user segments.

Connect to your database using your preferred SQL client or the Neon SQL Editor in the console, and execute the following SQL:

```sql
-- Create feature flags table
CREATE TABLE feature_flags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    enabled BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create user segments table (for targeting specific user groups)
CREATE TABLE segments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create rules table (associates flags with segments and specifies conditions)
CREATE TABLE rules (
    id SERIAL PRIMARY KEY,
    flag_id INTEGER REFERENCES feature_flags(id) ON DELETE CASCADE,
    segment_id INTEGER REFERENCES segments(id) ON DELETE CASCADE,
    percentage INTEGER NOT NULL DEFAULT 100, -- For percentage rollouts
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT percentage_range CHECK (percentage >= 0 AND percentage <= 100),
    UNIQUE(flag_id, segment_id)
);

-- Create user attributes table (for identifying users that belong to segments)
CREATE TABLE segment_conditions (
    id SERIAL PRIMARY KEY,
    segment_id INTEGER REFERENCES segments(id) ON DELETE CASCADE,
    attribute VARCHAR(100) NOT NULL, -- e.g., "country", "email", "role"
    operator VARCHAR(20) NOT NULL, -- e.g., "equals", "contains", "startsWith"
    value TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

This schema gives us a flexible feature flag setup that can:

- Define named feature flags
- Create user segments based on attributes
- Set rules for flag visibility, including percentage rollouts
- Control which segments see which features

Let's insert some sample data to work with:

```sql
-- Insert some feature flags
INSERT INTO feature_flags (name, description, enabled) VALUES
('new_dashboard', 'New user dashboard with improved visualizations', true),
('dark_mode', 'Dark mode theme across the application', false),
('beta_api', 'New API endpoints for beta testers', true);

-- Insert some user segments
INSERT INTO segments (name, description) VALUES
('beta_testers', 'Users who opted into beta features'),
('premium_users', 'Users with paid subscription accounts'),
('internal_staff', 'Employees and contractors');

-- Associate flags with segments
INSERT INTO rules (flag_id, segment_id, percentage) VALUES
(1, 2, 100), -- new_dashboard available to 100% of premium_users
(3, 1, 100), -- beta_api available to 100% of beta_testers
(2, 3, 50);  -- dark_mode available to 50% of internal_staff

-- Define conditions for segments
INSERT INTO segment_conditions (segment_id, attribute, operator, value) VALUES
(1, 'email', 'endsWith', '@example.com'),
(2, 'subscription', 'equals', 'premium'),
(3, 'email', 'endsWith', '@ourcompany.com');
```

With our database schema and sample data in place, we're ready to create our Go application.

## Create the Go application

Let's set up a new Go application for our feature flag system. We'll use standard Go modules and a clean project structure.

Create a new directory for your project and initialize a Go module:

```bash
mkdir feature-flag-system
cd feature-flag-system
go mod init github.com/yourusername/feature-flag-system
```

Now let's install the required dependencies:

```bash
go get github.com/lib/pq               # PostgreSQL driver
go get github.com/gorilla/mux          # HTTP router
go get github.com/joho/godotenv        # Environment variable management
go get github.com/google/uuid          # For generating unique IDs
go get github.com/jmoiron/sqlx         # Enhanced database operations
```

Create a basic project structure:

```bash
mkdir -p cmd/server
mkdir -p internal/db
mkdir -p internal/featureflags
mkdir -p internal/handlers
mkdir -p web/templates
```

This structure follows an essential Go project layout:

- `cmd/server`: Entry point for the server application
- `internal`: Internal packages that aren't meant to be imported by other projects
- `web/templates`: HTML templates for server-side rendering

Now, let's create a configuration file to store our database connection details. Create a new file named `.env` in the project root:

```
DATABASE_URL=postgres://[user]:[password]@[hostname]/[dbname]?sslmode=require
SERVER_PORT=8080
```

Replace the placeholder values in `DATABASE_URL` with your actual Neon connection string.

## Implement the feature flag service

Now we'll create the core of our feature flag system, the service that checks if features should be enabled for specific users.

First, let's create the database connection layer. Create a file at `internal/db/db.go`:

```go
package db

import (
	"log"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

// DB is our database wrapper
type DB struct {
	*sqlx.DB
}

// NewDB creates a new database connection
func NewDB(connectionString string) (*DB, error) {
	db, err := sqlx.Connect("postgres", connectionString)
	if err != nil {
		return nil, err
	}

	// Test the connection
	if err := db.Ping(); err != nil {
		return nil, err
	}

	log.Println("Connected to the database successfully")
	return &DB{db}, nil
}
```

Now, let's create our feature flag models and service. Create a file at `internal/featureflags/models.go`:

```go
package featureflags

// FeatureFlag represents a feature flag in the system
type FeatureFlag struct {
	ID          int    `db:"id" json:"id"`
	Name        string `db:"name" json:"name"`
	Description string `db:"description" json:"description"`
	Enabled     bool   `db:"enabled" json:"enabled"`
}

// Segment represents a user segment
type Segment struct {
	ID          int    `db:"id" json:"id"`
	Name        string `db:"name" json:"name"`
	Description string `db:"description" json:"description"`
}

// Rule associates feature flags with segments
type Rule struct {
	ID         int `db:"id" json:"id"`
	FlagID     int `db:"flag_id" json:"flag_id"`
	SegmentID  int `db:"segment_id" json:"segment_id"`
	Percentage int `db:"percentage" json:"percentage"`
}

// Condition represents a condition for a segment
type Condition struct {
	ID        int    `db:"id" json:"id"`
	SegmentID int    `db:"segment_id" json:"segment_id"`
	Attribute string `db:"attribute" json:"attribute"`
	Operator  string `db:"operator" json:"operator"`
	Value     string `db:"value" json:"value"`
}

// User represents a user in the system for feature flag evaluation
type User struct {
	ID         string
	Attributes map[string]string
}
```

The models define the structure of our feature flags, segments, rules, and user attributes. The `User` struct will be used to represent users when checking feature flag visibility.

Now create the feature flag service at `internal/featureflags/service.go`:

```go
package featureflags

import (
	"fmt"
	"hash/fnv"
	"log"
	"strings"

	"github.com/yourusername/feature-flag-system/internal/db"
)

// Service provides methods for interacting with feature flags
type Service struct {
	db *db.DB
}

// NewService creates a new feature flag service
func NewService(db *db.DB) *Service {
	return &Service{db: db}
}

// IsEnabled checks if a feature flag is enabled for a specific user
func (s *Service) IsEnabled(flagName string, user *User) (bool, error) {
	// First, check if the flag exists and is globally enabled
	var flag FeatureFlag
	err := s.db.Get(&flag, "SELECT * FROM feature_flags WHERE name = $1", flagName)
	if err != nil {
		return false, fmt.Errorf("flag not found: %w", err)
	}

	// If the flag is disabled globally, return false immediately
	if !flag.Enabled {
		return false, nil
	}

	// Get all rules for this flag
	var rules []struct {
		Rule
		SegmentName string `db:"segment_name"`
	}
	err = s.db.Select(&rules, `
		SELECT r.*, s.name as segment_name
		FROM rules r
		JOIN segments s ON r.segment_id = s.id
		WHERE r.flag_id = $1
	`, flag.ID)
	if err != nil {
		return false, fmt.Errorf("error getting rules: %w", err)
	}

	// If no rules exist, the flag is enabled for everyone
	if len(rules) == 0 {
		return true, nil
	}

	// Check each rule to see if the user matches
	for _, rule := range rules {
		isInSegment, err := s.isUserInSegment(user, rule.SegmentID)
		if err != nil {
			log.Printf("Error checking segment: %v", err)
			continue
		}

		if isInSegment {
			// Check percentage rollout
			if rule.Percentage < 100 {
				hash := hashUserID(user.ID, flagName)
				percentage := hash % 100
				if percentage >= rule.Percentage {
					continue // Not included in the percentage rollout
				}
			}
			return true, nil
		}
	}

	// If no rules matched, the feature is disabled for this user
	return false, nil
}

// isUserInSegment checks if a user is in a specific segment
func (s *Service) isUserInSegment(user *User, segmentID int) (bool, error) {
	// Get the conditions for this segment
	var conditions []Condition
	err := s.db.Select(&conditions, "SELECT * FROM segment_conditions WHERE segment_id = $1", segmentID)
	if err != nil {
		return false, fmt.Errorf("error getting segment conditions: %w", err)
	}

	// If no conditions, segment is empty
	if len(conditions) == 0 {
		return false, nil
	}

	// Check all conditions
	for _, condition := range conditions {
		attributeValue, exists := user.Attributes[condition.Attribute]
		if !exists {
			return false, nil // User doesn't have this attribute
		}

		// Evaluate the condition
		match := false
		switch condition.Operator {
		case "equals":
			match = attributeValue == condition.Value
		case "contains":
			match = strings.Contains(attributeValue, condition.Value)
		case "startsWith":
			match = strings.HasPrefix(attributeValue, condition.Value)
		case "endsWith":
			match = strings.HasSuffix(attributeValue, condition.Value)
		default:
			return false, fmt.Errorf("unknown operator: %s", condition.Operator)
		}

		if !match {
			return false, nil
		}
	}

	return true, nil
}

// GetAllFlags returns all feature flags in the system
func (s *Service) GetAllFlags() ([]FeatureFlag, error) {
	var flags []FeatureFlag
	err := s.db.Select(&flags, "SELECT * FROM feature_flags ORDER BY name")
	if err != nil {
		return nil, fmt.Errorf("error getting flags: %w", err)
	}
	return flags, nil
}

// UpdateFlag updates a feature flag's enabled status
func (s *Service) UpdateFlag(id int, enabled bool) error {
	_, err := s.db.Exec(
		"UPDATE feature_flags SET enabled = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
		enabled, id,
	)
	if err != nil {
		return fmt.Errorf("error updating flag: %w", err)
	}
	return nil
}

// hashUserID creates a consistent hash of a user ID and flag name
// This ensures the same user gets the same behavior for a specific flag
func hashUserID(userID, flagName string) int {
	h := fnv.New32a()
	h.Write([]byte(userID + flagName))
	return int(h.Sum32() % 100)
}
```

The `Service` provides a set of methods to interact with the feature flags in the database:

- Check if a feature flag is enabled for a specific user
- Determine if a user belongs to a segment based on their attributes
- Get all feature flags in the system
- Update a feature flag's enabled status

The `IsEnabled` method is the core of our feature flag system. It:

1. Checks if the flag exists and is globally enabled
2. Gets all rules for the flag
3. For each rule, checks if the user is in the segment
4. For percentage rollouts, uses a hash of the user ID and flag name to ensure consistent behavior

## Create the web server

Now let's create the web server that will serve our application with server-side rendering. First, let's create the main server file at `cmd/server/main.go`:

```go
package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/yourusername/feature-flag-system/internal/db"
	"github.com/yourusername/feature-flag-system/internal/featureflags"
	"github.com/yourusername/feature-flag-system/internal/handlers"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .env file not found: %v", err)
	}

	// Get database connection string
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL environment variable is required")
	}

	// Set up database
	database, err := db.NewDB(dbURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Close()

	// Create feature flag service
	flagService := featureflags.NewService(database)

	// Create router
	r := mux.NewRouter()

	// Create handlers
	h := handlers.NewHandlers(flagService)

	// Register routes
	r.HandleFunc("/", h.HomePage).Methods("GET")
	r.HandleFunc("/admin", h.AdminPage).Methods("GET")
	r.HandleFunc("/api/flags", h.GetAllFlags).Methods("GET")
	r.HandleFunc("/api/flags/{id}", h.UpdateFlag).Methods("PUT")

	// Serve static files
	r.PathPrefix("/static/").Handler(
		http.StripPrefix("/static/", http.FileServer(http.Dir("./web/static"))),
	)

	// Start server
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting server on port %s", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), r))
}
```

Here we are setting up the server with the following features:

- Loading environment variables from a `.env` file using `godotenv`
- Connecting to the Neon database using the `db` package
- Creating a `featureflags.Service` instance
- Setting up routes with the `gorilla/mux` router
- Serving static files from the `web/static` directory

Next, let's create the HTML templates for our application.

## Implement server-side rendering with feature flags

Now let's create the handlers that will render our templates based on the feature flags. Create a file at `internal/handlers/handlers.go`:

```go
package handlers

import (
	"encoding/json"
	"html/template"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/yourusername/feature-flag-system/internal/featureflags"
)

// Handlers contains the HTTP handlers for the application
type Handlers struct {
	flagService *featureflags.Service
	templates   map[string]*template.Template
}

// NewHandlers creates a new Handlers instance
func NewHandlers(flagService *featureflags.Service) *Handlers {
	// Parse templates
	templates := make(map[string]*template.Template)
	templates["home"] = template.Must(template.ParseFiles(
		"web/templates/base.html",
		"web/templates/home.html",
	))
	templates["admin"] = template.Must(template.ParseFiles(
		"web/templates/base.html",
		"web/templates/admin.html",
	))

	return &Handlers{
		flagService: flagService,
		templates:   templates,
	}
}

// HomePage renders the home page with feature flags
func (h *Handlers) HomePage(w http.ResponseWriter, r *http.Request) {
	// Create a user from request information
	user := createUserFromRequest(r)

	// Check feature flags
	newDashboard, err := h.flagService.IsEnabled("new_dashboard", user)
	if err != nil {
		log.Printf("Error checking new_dashboard flag: %v", err)
		newDashboard = false
	}

	darkMode, err := h.flagService.IsEnabled("dark_mode", user)
	if err != nil {
		log.Printf("Error checking dark_mode flag: %v", err)
		darkMode = false
	}

	betaApi, err := h.flagService.IsEnabled("beta_api", user)
	if err != nil {
		log.Printf("Error checking beta_api flag: %v", err)
		betaApi = false
	}

	// Prepare template data
	data := map[string]interface{}{
		"Title":        "Feature Flag Demo",
		"User":         user,
		"NewDashboard": newDashboard,
		"DarkMode":     darkMode,
		"BetaApi":      betaApi,
	}

	// Render template
	h.templates["home"].ExecuteTemplate(w, "base", data)
}

// AdminPage renders the admin page for managing feature flags
func (h *Handlers) AdminPage(w http.ResponseWriter, r *http.Request) {
	flags, err := h.flagService.GetAllFlags()
	if err != nil {
		http.Error(w, "Error loading flags", http.StatusInternalServerError)
		log.Printf("Error loading flags: %v", err)
		return
	}

	data := map[string]interface{}{
		"Title": "Feature Flag Admin",
		"Flags": flags,
	}

	h.templates["admin"].ExecuteTemplate(w, "base", data)
}

// GetAllFlags returns all feature flags as JSON
func (h *Handlers) GetAllFlags(w http.ResponseWriter, r *http.Request) {
	flags, err := h.flagService.GetAllFlags()
	if err != nil {
		http.Error(w, "Error loading flags", http.StatusInternalServerError)
		log.Printf("Error loading flags: %v", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(flags)
}

// UpdateFlag updates a feature flag's enabled status
func (h *Handlers) UpdateFlag(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid flag ID", http.StatusBadRequest)
		return
	}

	var updateData struct {
		Enabled bool `json:"enabled"`
	}

	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if err := h.flagService.UpdateFlag(id, updateData.Enabled); err != nil {
		http.Error(w, "Error updating flag", http.StatusInternalServerError)
		log.Printf("Error updating flag %d: %v", id, err)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "success"})
}

// createUserFromRequest extracts user information from the request
func createUserFromRequest(r *http.Request) *featureflags.User {
	// In a real application, you'd get this from your authentication system
	// For demo purposes, we'll use query parameters or default values
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		userID = "anonymous"
	}

	// Create a user with attributes
	user := &featureflags.User{
		ID: userID,
		Attributes: map[string]string{
			"email":        r.URL.Query().Get("email"),
			"country":      r.URL.Query().Get("country"),
			"subscription": r.URL.Query().Get("subscription"),
		},
	}

	// Set defaults if not provided
	if user.Attributes["email"] == "" {
		// For testing segment conditions
		if userID == "premium" {
			user.Attributes["email"] = "premium@example.com"
			user.Attributes["subscription"] = "premium"
		} else if userID == "beta" {
			user.Attributes["email"] = "beta@example.com"
		} else if userID == "internal" {
			user.Attributes["email"] = "employee@ourcompany.com"
		} else {
			user.Attributes["email"] = "user@regular.com"
			user.Attributes["subscription"] = "free"
		}
	}

	if user.Attributes["country"] == "" {
		user.Attributes["country"] = "US"
	}

	return user
}
```

The handlers:

1. Render pages using Go's template package
2. Check if features should be enabled for the current user
3. Pass feature flag information to the templates
4. Provide API endpoints for the admin interface

Now, let's create the HTML templates for our application. First, create a base template at `web/templates/base.html`:

```html
<!doctype html>
<html {{if .DarkMode}}class="dark" {{end}}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{.Title}}</title>
    <!-- Add Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {},
        },
      };
    </script>
  </head>
  <body class="text-gray-800 dark:text-gray-100 dark:bg-gray-900 mx-auto max-w-7xl p-5 font-sans">
    <div
      class="border-gray-200 dark:border-gray-700 mb-8 flex items-center justify-between border-b pb-3"
    >
      <h1 class="text-2xl font-bold">{{.Title}}</h1>
      <div class="nav">
        <a href="/" class="text-blue-600 dark:text-blue-400 ml-4 no-underline hover:underline"
          >Home</a
        >
        <a href="/admin" class="text-blue-600 dark:text-blue-400 ml-4 no-underline hover:underline"
          >Admin</a
        >
      </div>
    </div>

    {{template "content" .}}

    <script>
      // Common JavaScript functionality
    </script>
  </body>
</html>
```

Next, create the home page template at `web/templates/home.html`:

```html
{{define "content"}}
<div
  class="border-gray-200 dark:bg-gray-800 dark:border-gray-700 mb-8 rounded-lg border bg-white p-6 shadow-sm"
>
  <h2 class="text-gray-800 dark:text-gray-100 mb-4 text-xl font-semibold">Current User</h2>

  <div class="mb-6 space-y-2">
    <p class="flex"><span class="w-32 font-medium">User ID:</span> <span>{{.User.ID}}</span></p>
    <p class="flex">
      <span class="w-32 font-medium">Email:</span> <span>{{.User.Attributes.email}}</span>
    </p>
    <p class="flex">
      <span class="w-32 font-medium">Subscription:</span>
      <span>{{.User.Attributes.subscription}}</span>
    </p>
    <p class="flex">
      <span class="w-32 font-medium">Country:</span> <span>{{.User.Attributes.country}}</span>
    </p>
  </div>

  <h3 class="text-gray-800 dark:text-gray-100 mb-2 text-lg font-medium">Active Features:</h3>
  <ul class="mb-4 list-disc space-y-1 pl-5">
    {{if .NewDashboard}}
    <li class="text-green-600 dark:text-green-400">New Dashboard</li>
    {{end}} {{if .DarkMode}}
    <li class="text-green-600 dark:text-green-400">Dark Mode</li>
    {{end}} {{if .BetaApi}}
    <li class="text-green-600 dark:text-green-400">Beta API</li>
    {{end}}
  </ul>

  <p class="text-gray-500 dark:text-gray-400 text-xs italic">
    You can simulate different users by adding query parameters:
    <code class="bg-gray-100 dark:bg-gray-700 rounded px-1 py-0.5">?user_id=premium</code> or
    <code class="bg-gray-100 dark:bg-gray-700 rounded px-1 py-0.5">?user_id=beta</code> or
    <code class="bg-gray-100 dark:bg-gray-700 rounded px-1 py-0.5">?user_id=internal</code>
  </p>
</div>

<div class="space-y-6">
  <h2 class="text-gray-800 dark:text-gray-100 mb-6 text-2xl font-bold">
    Welcome to the Feature Flag Demo
  </h2>

  {{if .NewDashboard}}
  <div
    class="border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-lg border bg-white p-6 shadow transition-all duration-300 hover:shadow-md"
  >
    <div class="mb-4 flex items-center">
      <h3 class="text-gray-800 dark:text-gray-100 text-xl font-semibold">Analytics Dashboard</h3>
      <span class="bg-orange-500 ml-2 inline-block rounded-full px-2 py-0.5 text-xs text-white"
        >New</span
      >
    </div>
    <p class="text-gray-600 dark:text-gray-300 mb-4">
      This is the new analytics dashboard with improved visualizations. You're seeing this because
      the 'new_dashboard' feature flag is enabled for you.
    </p>
    <div
      class="text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 flex h-48 items-center justify-center rounded-lg font-medium"
    >
      [Fancy New Dashboard Chart]
    </div>
  </div>
  {{else}}
  <div
    class="border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-lg border bg-white p-6 shadow transition-all duration-300 hover:shadow-md"
  >
    <h3 class="text-gray-800 dark:text-gray-100 mb-4 text-xl font-semibold">Analytics Dashboard</h3>
    <p class="text-gray-600 dark:text-gray-300 mb-4">
      This is the classic analytics dashboard. You're seeing this because the 'new_dashboard'
      feature flag is disabled for you.
    </p>
    <div
      class="text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 flex h-36 items-center justify-center rounded-lg font-medium"
    >
      [Classic Dashboard]
    </div>
  </div>
  {{end}} {{if .BetaApi}}
  <div
    class="border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-lg border bg-white p-6 shadow transition-all duration-300 hover:shadow-md"
  >
    <div class="mb-4 flex items-center">
      <h3 class="text-gray-800 dark:text-gray-100 text-xl font-semibold">API Explorer</h3>
      <span class="bg-orange-500 ml-2 inline-block rounded-full px-2 py-0.5 text-xs text-white"
        >Beta</span
      >
    </div>
    <p class="text-gray-600 dark:text-gray-300 mb-4">
      Welcome to the API Explorer. You're seeing this because the 'beta_api' feature flag is enabled
      for you.
    </p>
    <pre
      class="text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 overflow-x-auto rounded-lg p-4 font-mono text-sm"
    >
GET /api/v2/data
Authorization: Bearer {your_token}</pre
    >
  </div>
  {{end}}
</div>
{{end}}
```

Finally, create the admin page template at `web/templates/admin.html`:

```html
{{define "content"}}
<div class="dark:bg-gray-800 mb-8 rounded-lg bg-white p-6 shadow-md">
  <h2 class="text-gray-800 dark:text-gray-100 mb-3 text-2xl font-bold">
    Feature Flag Administration
  </h2>
  <p class="text-gray-600 dark:text-gray-300 mb-8">
    Toggle feature flags on and off. Changes take effect immediately for all users.
  </p>

  <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 md:grid-cols-2">
    {{range .Flags}}
    <div
      class="border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-lg border bg-white p-5 shadow-sm transition-all duration-300 hover:shadow"
    >
      <div class="mb-4 flex items-start justify-between">
        <h3 class="text-gray-800 dark:text-gray-100 text-lg font-semibold">{{.Name}}</h3>
        <label class="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            class="flag-toggle peer sr-only"
            data-id="{{.ID}}"
            {{if
            .Enabled}}checked{{end}}
          />
          <div
            class="bg-gray-200 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 after:border-gray-300 dark:border-gray-600 peer-checked:bg-blue-600 peer h-6 w-11 rounded-full after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4"
          ></div>
        </label>
      </div>
      <p class="text-gray-600 dark:text-gray-300 mb-3">{{.Description}}</p>
      <p class="text-gray-500 dark:text-gray-400 font-mono text-xs">ID: {{.ID}}</p>
    </div>
    {{end}}
  </div>
</div>

<script>
  // Add JavaScript to handle toggle switches
  document.addEventListener('DOMContentLoaded', function () {
    const toggles = document.querySelectorAll('.flag-toggle');

    toggles.forEach((toggle) => {
      toggle.addEventListener('change', function () {
        const flagId = this.dataset.id;
        const enabled = this.checked;

        fetch(`/api/flags/${flagId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            enabled: enabled,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to update flag');
            }
            return response.json();
          })
          .then((data) => {
            console.log('Flag updated:', data);
          })
          .catch((error) => {
            console.error('Error:', error);
            // Revert the toggle state on error
            this.checked = !enabled;
            alert('Error updating feature flag. Please try again.');
          });
      });
    });
  });
</script>
{{end}}
```

## Create an admin interface

The admin interface we've built allows administrators to toggle feature flags on and off through the UI. It includes:

1. A list of all feature flags in the system
2. Toggle switches for enabling/disabling flags
3. JavaScript to update flags via API calls

The admin interface is already integrated into our application with the `AdminPage` handler and `admin.html` template.

## Test the feature flag system

Now let's test our feature flag system by running the application and trying different user scenarios.

First, create a directory for static files:

```bash
mkdir -p web/static
```

Run the application:

```bash
go run cmd/server/main.go
```

Visit `http://localhost:8080` in your browser to see the home page with feature flags in action.

Try these different user scenarios by adding query parameters:

1. Regular user: `http://localhost:8080`
2. Premium user: `http://localhost:8080?user_id=premium`
3. Beta tester: `http://localhost:8080?user_id=beta`
4. Internal staff: `http://localhost:8080?user_id=internal`

Each user should see different features based on the rules we set up:

- Premium users should see the new dashboard
- Beta testers should see the beta API
- 50% of internal staff should see dark mode (based on the user ID hash)

You can also visit the admin interface at `http://localhost:8080/admin` to toggle features on and off.

## Deploy the application

To deploy the application, we'll package it in a Docker container and prepare it for deployment to your preferred platform.

Create a `Dockerfile` in the project root:

```dockerfile
FROM golang:1.20-alpine AS builder

WORKDIR /app

# Copy go.mod and go.sum first to leverage Docker cache
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd/server

# Use a smaller image for the final container
FROM alpine:latest

WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/server .
COPY --from=builder /app/web ./web

# Expose the port the server runs on
EXPOSE 8080

# Set environment variables
ENV SERVER_PORT=8080

# Run the server
CMD ["./server"]
```

Build the Docker image:

```bash
docker build -t feature-flag-system .
```

You can run the container locally to test it:

```bash
docker run -p 8080:8080 --env-file .env feature-flag-system
```

To deploy to production, push the container to your container registry and deploy it to your preferred cloud platform (AWS, GCP, Azure, etc.).

Remember to set the `DATABASE_URL` environment variable in your deployment environment to point to your Neon database.

## Summary

In this guide, you built a server-rendered feature flag system using Go and Neon Postgres. You implemented a way to define flags and user segments in the database, control feature visibility based on user attributes, and gradually roll out features using percentage-based targeting.

By handling feature flag logic on the server, you ensure that users only see what they're meant to, making the system both secure and performant. This approach gives you full control over feature exposure without relying on client-side logic.

## Additional Resources

- [Neon Documentation](/docs)
- [Go Documentation](https://golang.org/doc/)
- [Feature Toggles (Martin Fowler)](https://martinfowler.com/articles/feature-toggles.html)

<NeedHelp />
