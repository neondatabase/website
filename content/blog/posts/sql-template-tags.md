---
title: Why SQL template tags are not vulnerable to SQL injection attacks
description: >-
  Learn what SQL template tags are, how they work under the hood, and why the
  are not vulnerable to SQL injection attacks
excerpt: >-
  SQL injection is one of the most well-known security vulnerabilities, allowing
  attackers to manipulate database queries and potentially gain unauthorized
  access to sensitive data. However, using our serverless driver, you can
  continue to write queries as you always have, but feel...
date: '2023-05-09T10:56:34'
updatedOn: '2025-03-20T09:15:16'
category: community
categories:
  - community
authors:
  - mahmoud-abdelwahab
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/sql-template-tags/cover.jpg'
  alt: null
isFeatured: false
seo:
  title: Why SQL template tags are not vulnerable to SQL injection attacks - Neon
  description: >-
    Learn what SQL template tags are, how they work under the hood, and why the
    are not vulnerable to SQL injection attacks
  keywords: []
  noindex: false
  ogTitle: Why SQL template tags are not vulnerable to SQL injection attacks - Neon
  ogDescription: >-
    Learn what SQL template tags are, how they work under the hood, and why the
    are not vulnerable to SQL injection attacks
  image: 'https://cdn.neonapi.io/public/images/pages/blog/sql-template-tags/social.jpg'
---

SQL injection is one of the most well-known security vulnerabilities, allowing attackers to manipulate database queries and potentially gain unauthorized access to sensitive data. However, using our [serverless driver](https://neon.tech/docs/serverless/serverless-driver), you can continue to write queries as you always have, but feel confident you’re not leaving your application open to malicious attacks.

To learn more, check out the docs for the [@neondatabase/serverless](https://www.npmjs.com/package/@neondatabase/serverless) driver, which lets you securely connect to your database from serverless and edge environments.

If you use [node-postgres](https://node-postgres.com/), there are typically two ways to connect to a Postgres database:

1. Creating a `Client()` instance, which creates an individual client.
2. Creating a `Pool()` instance, which allows you to have a reusable pool of clients.

```javascript
import { Pool, Client } from 'pg'

// connection details will be pulled from environment variables
const pool = new Pool()
const res = await pool.query('SELECT NOW()')
ctx.waitUntil(pool.end())

// connection details will be pulled from environment variables
const client = new Client()
await client.connect()
const res = await client.query('SELECT NOW()')
ctx.waitUntil(client.end())
```

However, in addition to the two options mentioned above, `@neondatabase/serverless` offers another way to connect to a database and send queries:

```javascript
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

const id = 100;
const { rows } = await sql `SELECT * FROM users WHERE id = ${userId};`;
```

Many people who are unfamiliar with this syntax, think the code above is vulnerable to SQL injection attacks. Fortunately, this is not the case.

This article will explain this syntax, how it works under the hood, and why it is _not_ vulnerable to SQL injection attacks.

<blockquote>
<p>Note: this pattern is used by several Postgres clients/query builders (e.g. <a href="https://kysely-org.github.io/kysely-apidoc/interfaces/Sql.html">Kysely</a>, <a href="https://www.npmjs.com/package/postgres">Postgres.js</a>, and more) and is safe to use.</p>
</blockquote>

## Overview of SQL injection attacks

A SQL injection is an attack where a malicious query is passed and executed by the database. These queries can allow the attacker to access or modify data within the database.

Here is an example:

```javascript
 const { rows } = await client.query(
`SELECT * from USERS where user_id='${params.userId}'`
);
```

This SQL query is vulnerable to SQL injection attacks because the query builds the SQL statement by directly inserting user input into the query string without proper sanitization and validation (if you are unfamiliar with this syntax, it is using [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals), which allow for [string interpolation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#string_interpolation)).

An attacker can then pass a value that will execute a SQL query. For example, if `params.user` has a value of `"'; DROP TABLE USERS; --";`, the resulting query would become:

```sql
SELECT * from USERS where user_id=''; DROP TABLE USERS; --' 
```

This query would execute the SELECT statement but also execute a SQL injection attack and drop the USERS table, causing data loss.

To properly pass parameters to a query, you must use a [parameterized query](https://node-postgres.com/features/queries#parameterized-query):

```javascript
client.query(query, [parameter])
```

The `client.query()` function takes two arguments: a SQL query string and an array of values that will be used in the query. Parameters in the query string are denoted by a dollar sign followed by their order in the parameter array.

```javascript
client.query("SELECT * from USERS where user_id = $1", [params.user_id])
```

`$1` will be sanitized and safely replaced by the first parameter in the parameter array, in this case, the user ID.

So, how is writing `sql` followed by a string wrapped in backticks not vulnerable to an injection? The reason is that this is not a regular template literal but a template literal combined with a **tag function.**

## Understanding template literal tag functions

In JavaScript, you can define a function that processes a string literal. This is known as a “tag function”.

Here is an example of a function that takes a `name` parameter and outputs a greeting message.

```javascript
let name = "Jane"
function greeting(name){
	return `Hello, ${name}`
}
greeting(name) // "Hello, Jane"
```

It can be rewritten as a tag function:

```javascript
let name = "Jane"
function greeting(strings, name){
	console.log(strings) // []
	return `Hello, ${name}`
}
greeting `${name}` // "Hello, Jane"
```

The first argument received by the tag function is an array of strings. It will contain the template literal split by the values which will be interpolated (so anything wrapped in $\{…\}). The second argument is the value that will be interpolated.

```javascript
let name = "Jane"
function greeting(strings, name){
	console.log(strings) // ["Testing", "this"]
	return `Hello, ${name}`
}
greeting `Testing ${name} this` // "Hello, Jane". The strings "Testing" and "this" do nothing here, but are passed to the tag function
```

Notice that you can now call the function by writing the function name followed by the string delimited by backticks. This improves readability and makes it easier to understand your code.

But what if you want to create a tag function that can accept an unknown number of arguments? Here is how you would do it:

```javascript
let firstName = "Jane"
let lastName = "Smith"

function greeting(strings, ...values){
console.log(values) // ["Jane","Smith"]
let str = 'Hello,';
strings.forEach((string, i) => {
str += `${string} ${values[i] || ''}`;
  	});
  	return str;
}
greeting `${firstName} ${lastName}` // "Hello, Jane Smith"
```

The first argument remains unchanged. As for the second argument, rather than use a fixed set of variables to pass to the template literal, we use the rest parameter syntax to capture all the values passed into the template literal and store them in an array called “values”.

The function loops through the `strings` array using the `forEach` method and appends each string to a variable called `str`. It then checks if there is a corresponding value in the `values` array for each string, and if one is found, appends it to the greeting message.

Finally, the function returns the greeting message.

The `@neondatabase/serverless` package uses the same concept for defining the `sql` function, which uses a custom tag function:

```javascript
export type Primitive = string | number | boolean | undefined | null;

// custom tag function
export function sqlTemplate(
  strings: TemplateStringsArray,
  ...values: Primitive []
): [string, Primitive []] {
// This ensures that the function is called correctly
  if (!isTemplateStringsArray(strings) ||!Array.isArray(values)) {
    throw new Error(
      'incorrect_tagged_template_call',
      "It looks like you tried to call `sql` as a function. Make sure to use it as a tagged template.\n\tExample: sql `SELECT *FROM users`, not sql('SELECT* FROM users')",
    );
  }
  let result = strings [0]?? '';
  for (let i = 1; i < strings.length; i++) {
    result += `$${i}${strings[i] ?? ''}`;
  }
  return [result, values]; // returns the template literal and the values that will be interpolated as an array.
}

// the `sql` function uses the `sqlTemplate` function. It returns a parametrized query, which is safe from SQL injection attacks.
  async sql<O extends QueryResultRow>(
    strings: TemplateStringsArray,
    ...values: Primitive []
  ): Promise<QueryResult<O>> {
    const [query, params] = sqlTemplate(strings, ...values);
    return this.query(query, params); 
 }
```

The difference is rather than returning a string, the function returns two values: the query and the parameters that were passed to the template literal.

These two values are then passed to the `query()` function, following the parametrized query approach, which prevents SQL injection attacks.

This is a common pattern in modern JS SQL libraries and is not just specific to the `@neondatabase/serverless` SDK.

## Conclusion

In this post, you learned about SQL injection attacks, how SQL template tags work, and why they are not vulnerable to SQL injection attacks.

To learn more about the `@neondatabase/serverless` driver, refer to the [API Reference](https://neon.tech/docs/serverless/serverless-driver).

If you are new to Neon, you can [sign up today](https://console.neon.tech) for free. No credit card required.
