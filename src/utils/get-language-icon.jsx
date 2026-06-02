import {
  SiAstro,
  SiCplusplus,
  SiCss,
  SiElixir,
  SiGo,
  SiGnubash,
  SiGraphql,
  SiJavascript,
  SiJson,
  SiKotlin,
  SiMarkdown,
  SiOpenjdk,
  SiPhp,
  SiPostgresql,
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
import { TbBrandCSharp } from 'react-icons/tb';

const LANGUAGE_ICON_MAP = {
  typescript: SiTypescript,
  ts: SiTypescript,
  tsx: SiTypescript,
  javascript: SiJavascript,
  js: SiJavascript,
  jsx: SiJavascript,
  python: SiPython,
  py: SiPython,
  bash: SiGnubash,
  shell: SiGnubash,
  zsh: SiGnubash,
  sql: SiPostgresql,
  psql: SiPostgresql,
  json: SiJson,
  yaml: SiYaml,
  yml: SiYaml,
  rust: SiRust,
  go: SiGo,
  ruby: SiRuby,
  erb: SiRuby,
  php: SiPhp,
  java: SiOpenjdk,
  kotlin: SiKotlin,
  csharp: TbBrandCSharp,
  'c#': TbBrandCSharp,
  cpp: SiCplusplus,
  elixir: SiElixir,
  terraform: SiTerraform,
  graphql: SiGraphql,
  css: SiCss,
  svelte: SiSvelte,
  prisma: SiPrisma,
  astro: SiAstro,
  markdown: SiMarkdown,
  md: SiMarkdown,
  mdx: SiMarkdown,
  toml: SiToml,
};

const getLanguageIcon = (language) => {
  const Icon = LANGUAGE_ICON_MAP[language?.toLowerCase()];
  if (!Icon) return null;

  return <Icon className="size-3.5 shrink-0" aria-hidden />;
};

export default getLanguageIcon;
