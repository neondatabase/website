import {
  SiAstro,
  SiBash,
  SiCplusplus,
  SiCsharp,
  SiCss3,
  SiElixir,
  SiGo,
  SiGraphql,
  SiJava,
  SiJavascript,
  SiJson,
  SiKotlin,
  SiMarkdown,
  SiPhp,
  SiPostgresql,
  SiPowershell,
  SiPrisma,
  SiPython,
  SiRuby,
  SiRust,
  SiSvelte,
  SiTerraform,
  SiToml,
  SiTypescript,
  SiYaml,
} from 'react-icons/si';

const LANGUAGE_ICON_MAP = {
  // TypeScript
  typescript: SiTypescript,
  ts: SiTypescript,
  tsx: SiTypescript,
  // JavaScript
  javascript: SiJavascript,
  js: SiJavascript,
  jsx: SiJavascript,
  // Python
  python: SiPython,
  py: SiPython,
  // Shell / Bash
  bash: SiBash,
  shell: SiBash,
  zsh: SiBash,
  // SQL / Postgres
  sql: SiPostgresql,
  psql: SiPostgresql,
  // JSON
  json: SiJson,
  // YAML
  yaml: SiYaml,
  yml: SiYaml,
  // Rust
  rust: SiRust,
  // Go
  go: SiGo,
  // Ruby
  ruby: SiRuby,
  erb: SiRuby,
  // PHP
  php: SiPhp,
  // Java
  java: SiJava,
  // Kotlin
  kotlin: SiKotlin,
  // C#
  csharp: SiCsharp,
  // C++
  'c++': SiCplusplus,
  cpp: SiCplusplus,
  // Elixir
  elixir: SiElixir,
  // Terraform
  terraform: SiTerraform,
  // GraphQL
  graphql: SiGraphql,
  // CSS
  css: SiCss3,
  // Svelte
  svelte: SiSvelte,
  // Prisma
  prisma: SiPrisma,
  // Astro
  astro: SiAstro,
  // Markdown / MDX
  markdown: SiMarkdown,
  md: SiMarkdown,
  mdx: SiMarkdown,
  // TOML / INI
  toml: SiToml,
  // PowerShell
  powershell: SiPowershell,
};

const getLanguageIcon = (language) => {
  const Icon = LANGUAGE_ICON_MAP[language?.toLowerCase()];
  if (!Icon) return null;

  return <Icon className="size-3.5 shrink-0" aria-hidden />;
};

export default getLanguageIcon;
