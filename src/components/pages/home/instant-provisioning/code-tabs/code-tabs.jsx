import clsx from 'clsx';
import PropTypes from 'prop-types';

import { getHighlightedCodeArray } from 'lib/shiki';

import Navigation from './navigation';

const codeSnippets = [
  {
    name: 'Next.js',
    iconName: 'nextjs',
    language: 'javascript',
    code: `import postgres from 'postgres';

async function getData() {
  const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
  const response = await sql\`SELECT version()\`;
  console.log(response);
  return response;
}

export default async function Page() {
  const data = await getData();
}`,
  },
  {
    name: 'Node',
    iconName: 'nodejs',
    language: 'javascript',
    code: `const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL);

async function getPgVersion() {
  const result = await sql\`select version()\`;
  console.log(result);
}

getPgVersion();`,
  },
  {
    name: 'Bun',
    iconName: 'bun',
    language: 'javascript',
    code: `// Use the Neon Serverless Driver
import { neon } from "@neondatabase/serverless";

// Bun automatically loads the DATABASE_URL from .env.local
// Refer to: https://bun.sh/docs/runtime/env for more information
const sql = neon(process.env.DATABASE_URL);

const rows = await sql\`SELECT version()\`;

console.log(rows[0].version);`,
  },
  {
    name: 'Python',
    iconName: 'python',
    language: 'python',
    code: `import os
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv
load_dotenv()

# Get the connection string from the environment variable
conn_str = os.getenv('DATABASE_URL')
if not conn_str:
    raise ValueError("No DATABASE_URL environment variable set")

# Connect to the PostgreSQL database
try:
    with psycopg2.connect(conn_str) as conn:
        with conn.cursor() as cur:

            # Execute a query, fetch and print result
            cur.execute("SELECT version()")
            version = cur.fetchone()
            print(f"PostgreSQL version: {version[0]}")

except Exception as e:
    print(f"Error: {e}")`,
  },
  {
    name: 'Go',
    iconName: 'go',
    language: 'go',
    code: `package main
import (
    "database/sql"
    "fmt"
    "log"
    "os"

    _ "github.com/lib/pq"
    "github.com/joho/godotenv"
)

func main() {
    err := godotenv.Load()
    if err != nil {
        log.Fatalf("Error loading .env file: %v", err)
    }

    connStr := os.Getenv("DATABASE_URL")
    if connStr == "" {
        panic("DATABASE_URL environment variable is not set")
    }

    db, err := sql.Open("postgres", connStr)
    if err != nil {
        panic(err)
    }
    defer db.Close()

    var version string
    if err := db.QueryRow("select version()").Scan(&version); err != nil {
        panic(err)
    }
    fmt.Printf("version=%s\\n", version)
}`,
  },
  {
    name: 'Ruby',
    iconName: 'ruby',
    language: 'ruby',
    code: `require 'pg'
require 'dotenv'

# Load environment variables from .env file
Dotenv.load

# Connect to the PostgreSQL database using the environment variable
conn = PG.connect(ENV['DATABASE_URL'])

# Execute a query
conn.exec("SELECT version()") do |result|
  result.each do |row|
    puts "Result = #{row['version']}"
  end
end

# Close the connection
conn.close`,
  },
  {
    name: 'Rust',
    iconName: 'rust',
    language: 'rust',
    code: `use postgres::Client;
use openssl::ssl::{SslConnector, SslMethod};
use postgres_openssl::MakeTlsConnector;
use std::error;
use std::env;
use dotenv::dotenv;

fn main() -> Result<(), Box<dyn error::Error>> {
    // Load environment variables from .env file
    dotenv().ok();

    // Get the connection string from the environment variable
    let conn_str = env::var("DATABASE_URL")?;

    let builder = SslConnector::builder(SslMethod::tls())?;
    let connector = MakeTlsConnector::new(builder.build());
    let mut client = Client::connect(&conn_str, connector)?;

    for row in client.query("select version()", &[])? {
        let ret: String = row.get(0);
        println!("Result = {}", ret);
    }
    Ok(())
}`,
  },
];

const CodeTabs = async ({ className = null }) => {
  const highlightedCodeSnippets = await getHighlightedCodeArray(codeSnippets);

  return (
    <div className={clsx(className, 'rounded-[10px] bg-black-new')}>
      <Navigation codeSnippets={codeSnippets} highlightedCodeSnippets={highlightedCodeSnippets} />
    </div>
  );
};

CodeTabs.propTypes = {
  className: PropTypes.string,
};

export default CodeTabs;
