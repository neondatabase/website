import clsx from 'clsx';
import PropTypes from 'prop-types';
import { memo } from 'react';

import { getHighlightedCodeArray } from 'lib/shiki';

import Navigation from './navigation';

const codeSnippets = [
  {
    name: 'Next.js',
    iconName: 'nextjs',
    language: 'javascript',
    code: `import { neon } from '@neondatabase/serverless';

export async function GET() {
    const sql = neon(process.env.DATABASE_URL);

    const rows = await sql("SELECT * FROM posts");

    return Response.json({ rows })
}`,
  },
  {
    name: 'Drizzle',
    iconName: 'drizzle',
    language: 'javascript',
    code: `import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
    
const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql);
    
const result = await db.select().from(...);`,
  },
  {
    name: 'Prisma',
    iconName: 'prisma',
    language: 'javascript',
    code: `import { neon } from '@neondatabase/serverless'
import { PrismaNeonHTTP } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

const sql = neon(process.env.DATABASE_URL)

const adapter = new PrismaNeonHTTP(sql)

const prisma = new PrismaClient({ adapter })`,
  },
  {
    name: 'Python',
    iconName: 'python',
    language: 'python',
    code: `import os
import psycopg2

# Load the environment variable
database_url = os.getenv('DATABASE_URL')

# Connect to the PostgreSQL database
conn = psycopg2.connect(database_url)

with conn.cursor() as cur:
    cur.execute("SELECT version()")
    print(cur.fetchone())

# Close the connection
conn.close()`,
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
];

const MemoizedNavigation = memo(Navigation);

const CodeTabs = async ({ className = null }) => {
  const highlightedCodeSnippets = await getHighlightedCodeArray(codeSnippets);

  return (
    <div className={clsx(className, 'rounded-[10px] bg-black-new')}>
      <MemoizedNavigation
        codeSnippets={codeSnippets}
        highlightedCodeSnippets={highlightedCodeSnippets}
      />
    </div>
  );
};

CodeTabs.propTypes = {
  className: PropTypes.string,
};

export default CodeTabs;
