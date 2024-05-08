import clsx from 'clsx';
import PropTypes from 'prop-types';

import { getHighlightedCodeArray } from 'lib/shiki';

import Navigation from './navigation';

const codeSnippets = [
  {
    name: 'Ruby',
    iconName: 'ruby',
    language: 'ruby',
    code: `class HelloWorld
  def initialize(name)
      @name = name.capitalize
  end
  def sayHi
      puts "Hello #{@name}!"
  end
 end
 hello = HelloWorld.new("World")
 hello.sayHi`,
  },
  {
    name: 'Python',
    iconName: 'python',
    language: 'python',
    code: `print("Hello, World!")`,
  },
  {
    name: 'Go',
    iconName: 'go',
    language: 'go',
    code: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
  },
  {
    name: 'Java',
    iconName: 'java',
    language: 'java',
    code: `public class HelloWorld {
  public static void main(String[] args) {
      System.out.println("Hello, World!");
  }
}`,
  },
  {
    name: 'Node',
    iconName: 'nodejs',
    language: 'javascript',
    code: `// app.js
const postgres = require('postgres');
require('dotenv').config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
  connection: {
    options: \`project=\${ENDPOINT_ID}\`,
  },
});

async function getPgVersion() {
  const result = await sql\`select version()\`;
  console.log(result);
}

getPgVersion();`,
  },
  {
    name: 'Prisma',
    iconName: 'prisma',
    language: 'javascript',
    code: `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
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
