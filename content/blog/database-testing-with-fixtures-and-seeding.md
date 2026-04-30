---
title: Database testing with fixtures and seeding
description: >-
  There's a catch with testing a new database: how do you test something that's
  empty?
excerpt: >-
  To test a new database, you need data, and not just any data. You need
  consistent, reliable data that behaves the same way every time you run your
  tests. Otherwise, how can you trust that your database and code is working
  correctly? This is where the twin concepts of seeding and...
date: '2024-07-02T15:57:39'
updatedOn: '2024-07-02T15:57:40'
category: workflows
categories:
  - workflows
authors:
  - rishi-raj-jain
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/database-testing-with-fixtures-and-seeding/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Database testing with fixtures and seeding - Neon
  description: >-
    To test a new database, you need testing data that behaves consistently.
    This is where the concepts of seeding and fixtures come into play.
  keywords: []
  noindex: false
  ogTitle: Database testing with fixtures and seeding - Neon
  ogDescription: >-
    To test a new database, you need testing data that behaves consistently.
    This is where the concepts of seeding and fixtures come into play.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/database-testing-with-fixtures-and-seeding/social.jpg
source:
  wpId: 6358
  wpSlug: database-testing-with-fixtures-and-seeding
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/database-testing-with-fixtures-and-seeding/neon-database-testing-1-1024x576-40cc951e.jpg)

To test a new database, you need data, and not just any data. You need consistent, reliable data that behaves the same way every time you run your tests. Otherwise, how can you trust that your database and code is working correctly? This is where the twin concepts of seeding and fixtures come into play, each serving a role in populating your database for different purposes. One provides the foundation your application needs to function; the other sets up specific scenarios for your tests to validate.

Let’s take a closer look at each and explain why you should set up both for robust database testing.

## Seed your database with the data you’ll always need

Static seeding is where you insert predefined, fixed (i.e., “static”) data into your database. This can be helpful in two ways.<br />First, database initialization. If you’ve ever used `createsuperuser` in Django, you are statically seeding your database. You need an initial admin role for the deployment to work correctly. But you can also bucket in the broader set of data that you’ll need for your application here. Let’s say you have a dropdown for users to enter their country and state. You also need to seed this information into the database. How are you going to do that? In Python, it’s pretty straightforward:

```python
from your_app.models import Country, State

def seed_countries_and_states():
    # Seed countries
    usa = Country.objects.create(name="United States")
    canada = Country.objects.create(name="Canada")

    # Seed states for USA
    us_states = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California",
        # ... other states ...
        "Wisconsin", "Wyoming"
    ]
    for state_name in us_states:
        State.objects.create(name=state_name, country=usa)

    # Seed provinces for Canada
    canadian_provinces = [
        "Alberta", "British Columbia", "Manitoba", "New Brunswick",
        "Newfoundland and Labrador", "Nova Scotia", "Ontario",
        "Prince Edward Island", "Quebec", "Saskatchewan"
    ]
    for province_name in canadian_provinces:
        State.objects.create(name=province_name, country=canada)

# Call this function in your Django management command or migration
seed_countries_and_states()
```

In Ruby on Rails, it is even easier thanks to `rails db:seed`:

```java
# db/seeds.rb
require 'csv'

# Ensure we have the necessary models
# app/models/country.rb
class Country < ApplicationRecord
  has_many :states
end

# app/models/state.rb
class State < ApplicationRecord
  belongs_to :country
end

puts "Seeding countries and states..."

# Read countries from CSV
countries = {}
CSV.foreach(Rails.root.join('db', 'seed_data', 'countries.csv'), headers: true) do |row|
  country = Country.create!(name: row['name'])
  countries[row['code']] = country
end

# Read states/provinces from CSV
CSV.foreach(Rails.root.join('db', 'seed_data', 'states.csv'), headers: true) do |row|
  country = countries[row['country_code']]
  country.states.create!(name: row['name'])
end

puts "Seeding completed!"

# To run this seed file, use:
# rails db:seed
```

To run this seed file, you then use:

```bash
rails db:seed
```

The fact that Rails has a command expressly for this shows the importance of seeding.

The second reason you’ll need seeding is testing. By seeding your test database with a known set of data, you can write predictable and repeatable tests.

Let’s say you’re building an e-commerce platform. You might want to seed your test database with various products, users, and orders to test different scenarios. Here’s how you might approach this in Rails:

```java
# db/seeds/test_seeds.rb

puts "Seeding test data..."

# Create test users
alice = User.create!(username: 'alice', email: 'alice@example.com', password: 'password123')
bob = User.create!(username: 'bob', email: 'bob@example.com', password: 'password456')

# Create some products
laptop = Product.create!(name: "Laptop", price: 999.99, stock: 10)
phone = Product.create!(name: "Smartphone", price: 499.99, stock: 20)
headphones = Product.create!(name: "Wireless Headphones", price: 149.99, stock: 30)

# Create some orders
Order.create!(user: alice, product: laptop, quantity: 1)
Order.create!(user: bob, product: phone, quantity: 2)
Order.create!(user: alice, product: headphones, quantity: 1)

puts "Test data seeded successfully!"
```

You can then load this test seed data in your test setup:

```java
# In your test helper or spec helper
Rails.application.load_seed
load "#{Rails.root}/db/seeds/test_seeds.rb"
```

By using static seeding for your tests, you ensure that they work with the same set of data every time they run. This makes your tests more reliable and easier to reason about. If a test fails, you know it’s because of a change in your code, not because of a difference in the test data.

When creating your static seeding data, some key aspects to consider are:

1. Deterministic data: The seed data is pre-determined and doesn’t change unless explicitly modified in the seed script or configuration.
2. Version control: Seed data is stored in version-controlled files (e.g., JSON, YAML, CSV, or SQL scripts) alongside the application code.
3. Idempotency: Well-designed seed scripts are idempotent, meaning they can be run multiple times without changing the result beyond the initial application.
4. Environment independence: Static seeds provide consistent data across different environments (development, staging, testing), ensuring reproducibility.

If we’re going to the trouble of naming this “static” seeding, does that suggest there is also a dynamic version? Yes.

Dynamic seeding involves generating random or varied data. This can be useful for stress testing or uncovering edge cases you might not have thought of with your hand-crafted static data. An example might be generating users with varied characteristics or creating products with random prices and stock levels. This approach can help simulate more realistic scenarios and potentially uncover issues that might not be apparent with a small, fixed dataset.

For this, you can use libraries such as [Faker](https://faker.readthedocs.io/en/master/) to generate data on the fly:

```python
from django.contrib.auth.models import User
from your_app.models import Product, Order
from faker import Faker
from random import choice, randint
from decimal import Decimal

# Initialize Faker
fake = Faker()

def seed_dynamic_data(num_users=50, num_products=100, num_orders=200):
    # Create users
    users = []
    for _ in range(num_users):
        user = User.objects.create_user(
            username=fake.user_name(),
            email=fake.email(),
            password=fake.password(length=12)
        )
        user.first_name = fake.first_name()
        user.last_name = fake.last_name()
        user.save()
        users.append(user)

    # Create products
    products = []
    for _ in range(num_products):
        product = Product.objects.create(
            name=fake.catch_phrase(),
            description=fake.paragraph(),
            price=Decimal(fake.pydecimal(left_digits=3, right_digits=2, positive=True)),
            stock=randint(0, 100)
        )
        products.append(product)

    # Create orders
    for _ in range(num_orders):
        user = choice(users)
        product = choice(products)
        quantity = randint(1, 5)

        Order.objects.create(
            user=user,
            product=product,
            quantity=quantity,
            order_date=fake.date_time_this_year()
        )

    print(f"Created {num_users} users, {num_products} products, and {num_orders} orders.")

# Usage
if __name__ == "__main__":
    seed_dynamic_data()
```

Dynamic seeding offers several benefits:

1. Scalability testing: You can easily generate large amounts of data to test how your application performs under load.
2. Edge case discovery: Random data may uncover scenarios you didn’t anticipate when writing your static seeds.
3. Realistic data distribution: Adjusting the random generators to mimic real-world distributions can create more realistic test scenarios.
4. Stress testing: You can generate extreme cases (like products with zero stock or very high prices) to ensure your application handles them correctly.

Use static seeds for core data your application needs to function and dynamic seeds for additional data to test various scenarios.

## Use fixtures to test the specifics of your data model

Here’s a fixture:

![Image](https://cdn.neonapi.io/public/images/pages/blog/database-testing-with-fixtures-and-seeding/ad4nxftstzgkqc7fycr6wcfwflscstw1cilnstghxzseraop3sdmjekfjvlpve8oe1rpdxufeekqktxskzd6hxbcl0rlssvlpbtiyz3vsktwu9zbkx7ghs-o1xadczzjj9uwffgezhcmlqqqza8osiayke4u-c5b9b7a5.jpg)

In engineering (the physical kind), fixtures securely hold a workpiece in a precise position during testing. They ” fix” them, ensuring consistency and repeatability.

This is effectively what fixtures are in database testing. They are a fixed state of a set of data for consistent test execution.

- Whereas static seeding can be used for testing but is more broadly about adding startup data to your application, fixtures are a specific testing concept that allows you to create a known, consistent environment for running tests.
- Whereas static seeds are loaded from JSONs or CSVs and are implemented via scripts (like above) or database migrations, fixtures are usually integrated into testing frameworks and defined in specific formats supported by the testing tool.
- Whereas the point of seeding is to persist data in your database, fixtures are usually loaded at the beginning of a test and cleaned up after.

Some examples:

1. In Django (Python), fixtures are typically defined in JSON or YAML files and can be loaded using the loaddata management command or within test cases.
2. In Rails (Ruby), fixtures are defined in YAML files and are automatically loaded for tests unless configured otherwise.
3. In Jest (JavaScript), fixtures can be defined as JavaScript objects or loaded from JSON files using Jest’s require function.
4. In JUnit (Java), fixtures are often defined using annotations like @BeforeEach or @BeforeAll to set up test data.
5. In NUnit (C#), fixtures can be set up using the [SetUp] attribute on methods that prepare the test environment.

Using fixtures in your tests allows you to ensure consistency across test runs, isolate tests from each other by providing a fresh set of data for each test, and improve test readability by separating test data from test logic.

Let’s say we’re working in Django. Then, a fixture definition in YAML might look like this:

```javascript
# products.yaml
- model: myapp.Product
  pk: 1
  fields:
    name: Laptop
    price: 999.99
    description: A high-performance laptop

- model: myapp.Product
  pk: 2
  fields:
    name: Smartphone
    price: 499.99
    description: The latest smartphone model

# users.yaml
- model: auth.User
  pk: 1
  fields:
    username: johndoe
    email: john@example.com
    password: pbkdf2_sha256$...  # This should be a hashed password

- model: auth.User
  pk: 2
  fields:
    username: janedoe
    email: jane@example.com
    password: pbkdf2_sha256$...  # This should be a hashed password

# orders.yaml
- model: myapp.Order
  pk: 1
  fields:
    user: 1
    product: 1
    quantity: 2
    order_date: "2023-06-26T10:00:00Z"

- model: myapp.Order
  pk: 2
  fields:
    user: 2
    product: 2
    quantity: 1
    order_date: "2023-06-26T11:00:00Z"
```

We can then use that data in our tests.py:

```python
# tests.py

from django.test import TestCase
from django.contrib.auth.models import User
from myapp.models import Product, Order

class OrderTestCase(TestCase):
    fixtures = ['products.yaml', 'users.yaml', 'orders.yaml']

    def test_order_creation(self):
        # Check if fixtures are loaded correctly
        self.assertEqual(Product.objects.count(), 2)
        self.assertEqual(User.objects.count(), 2)
        self.assertEqual(Order.objects.count(), 2)

        # Test specific order details
        order = Order.objects.get(pk=1)
        self.assertEqual(order.user.username, 'johndoe')
        self.assertEqual(order.product.name, 'Laptop')
        self.assertEqual(order.quantity, 2)

    def test_total_order_value(self):
        order = Order.objects.get(pk=1)
        expected_total = order.product.price * order.quantity
        self.assertEqual(order.total_value(), expected_total)

    def test_user_order_count(self):
        user = User.objects.get(username='johndoe')
        self.assertEqual(user.order_set.count(), 1)
```

If all is good, this returns:

```bash
Creating test database for alias 'default'...
System check identified no issues (0 silenced).
...
----------------------------------------------------------------------
Ran 3 tests in 0.789s

OK
Destroying test database for alias 'default'...
```

The subtle differences between seeding and fixtures are starting to come to light. Seeding typically provides initial data for an application to function correctly in various environments. In contrast, fixtures are specifically designed for testing scenarios, providing a controlled and consistent dataset that can be easily reset between test runs.

In practice, the line between seeding and fixtures can sometimes blur, especially in development environments. Some teams might use the terms interchangeably. However, understanding the nuanced differences can help choose the right approach for different scenarios in your development and testing processes.

## Branching: the next level of database testing

While seeding and fixtures are great tools for populating your database with consistent data, [database branching](https://neon.tech/docs/introduction/branching) in Neon offers a powerful UX enhancement to these practices.

1. **Instantaneous data cloning.** Branching allows for a quick copy of your database. You create a branch (available immediately) and run your tests. If anything goes wrong, you can simply reset the branch to its original state, restore it to a point in time, or start afresh.
2. **Isolated test environments.** Branches act like isolated environments: you can create a separate branch of your database for each feature you’re developing or bug you’re fixing.
3. **Parallel development.** Multiple branches allow different team members to work on various features or fixes simultaneously.
4. **Effortless rollbacks.** If you get to an unexpected state, you can quickly revert to a previous state. This ability to roll back changes provides a safety net, making your development process more robust.

## Seeds, Fixtures, and Everything in Between

Database testing is challenging. This is one of the reasons we created [branching](https://neon.tech/docs/introduction/branching) in Neon: to give database developers more maneuverability when testing new databases, schema changes, and queries.

But seeding and fixtures, and the tooling around them, are ideal starting points for robust database design. Seeding sets the stage with your app’s essential data, while fixtures give you a focused test environment.
