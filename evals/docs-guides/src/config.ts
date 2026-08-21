import { readFileSync } from 'fs';
import yaml from 'js-yaml';

export interface GuideConfig {
  doc_url: string;
}

export interface GuidesConfig {
  guides: Record<string, GuideConfig>;
}

export interface RunConfig {
  model: string;
  evalModel: string;
  guides: string[];
  configPath: string;
  localDir: string | null;
  timeout: number;  // minutes per guide
}

export function loadGuides(configPath: string): GuidesConfig {
  const raw = readFileSync(configPath, 'utf-8');
  return yaml.load(raw) as GuidesConfig;
}

export function parseArgs(): RunConfig {
  const args = process.argv.slice(2);
  let model = process.env.EVAL_WORKER_MODEL || 'claude-sonnet-4-6';
  let evalModel = process.env.EVAL_JUDGE_MODEL || 'claude-sonnet-4-6';
  let guides: string[] = [];
  let localDir: string | null = null;
  let timeout = 10; // default 10 min per guide

  const configPath = new URL('../config/guides.yaml', import.meta.url).pathname;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--guide' && args[i + 1]) {
      guides = args[i + 1].split(',');
      i++;
    } else if (args[i] === '--model' && args[i + 1]) {
      model = args[i + 1];
      i++;
    } else if (args[i] === '--eval-model' && args[i + 1]) {
      evalModel = args[i + 1];
      i++;
    } else if (args[i] === '--local' && args[i + 1]) {
      localDir = args[i + 1];
      i++;
    } else if (args[i] === '--timeout' && args[i + 1]) {
      timeout = parseInt(args[i + 1], 10);
      i++;
    }
  }

  return { model, evalModel, guides, configPath, localDir, timeout };
}
