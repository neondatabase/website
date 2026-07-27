import fs from 'fs/promises';
import os from 'os';
import path from 'path';

import { afterEach, describe, expect, it } from 'vitest';

import modelsData from '../app/models.json/data.json';
import getModelDetailPageData from '../components/pages/doc/ai-gateway-model-index/model-detail-data';
import modelRows from '../components/pages/doc/ai-gateway-model-index/model-rows';
import snippets from '../components/pages/doc/ai-gateway-model-index/snippets.json';

import {
  generateAiGatewayModelMarkdown,
  renderModelDetailMarkdown,
} from './generate-ai-gateway-model-markdown';

const tempDirs = [];
const rows = modelRows.buildRows(modelsData.neon);

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe('AI Gateway model Markdown', () => {
  it('renders model-specific about text, commands, and fields', () => {
    const row = rows.find(({ id }) => id === 'gemini-3-5-flash');
    const markdown = renderModelDetailMarkdown(row);

    expect(markdown).toContain('# Gemini 3.5 Flash');
    expect(markdown).toContain('## About');
    expect(markdown).toContain('Google provides the model');
    expect(markdown).toContain('## Command');
    expect(markdown).toContain('model: neon("gemini-3-5-flash")');
    expect(markdown).not.toContain(snippets.modelIdPlaceholder);
    expect(markdown).toContain('## Model ID\n\ngemini-3-5-flash');
    expect(markdown).toContain('## Input /M');
    expect(markdown).toContain('## Output /M');
    expect(markdown).not.toContain('### Image generation');
  });

  it('keeps the generated fields in parity with the HTML detail page', () => {
    const row = rows.find(({ id }) => id === 'gemini-3-5-flash');
    const { content } = getModelDetailPageData(row);

    expect(renderModelDetailMarkdown(row)).toContain(content);
  });

  it('includes image commands for capable models and omits unsupported Mastra commands', () => {
    const row = rows.find(({ id }) => id === 'gpt-5-3-codex');
    const markdown = renderModelDetailMarkdown(row);

    expect(markdown).toContain('### Image generation');
    expect(markdown).toContain('tools: [{ type: "image_generation" }]');
    expect(markdown).not.toContain('#### Mastra');
  });

  it('writes one file per model to the public Markdown mirror', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'neon-model-markdown-'));
    tempDirs.push(rootDir);
    const outputDir = path.join(rootDir, 'public/md/docs/ai-gateway/models');
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(path.join(outputDir, 'removed-model.md'), 'stale');

    const files = await generateAiGatewayModelMarkdown(rootDir);
    const outputPath = path.join(outputDir, 'gemini-3-5-flash.md');

    expect(files).toHaveLength(rows.length);
    expect(await fs.readFile(outputPath, 'utf8')).toContain('# Gemini 3.5 Flash');
    await expect(fs.access(path.join(outputDir, 'removed-model.md'))).rejects.toThrow();
  });
});
