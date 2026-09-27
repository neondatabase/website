import { writeFileSync, mkdirSync } from 'fs';
import type { FullEvaluation } from './evaluator.js';
import type { WorkerResult } from './worker.js';
import type { FileSnapshot } from './docker.js';
import type OpenAI from 'openai';

export interface GuideResult {
  guide: string;
  model: string;
  evaluation: FullEvaluation;
  worker: {
    turnCount: number;
    toolCallCount: number;
    durationMs: number;
  };
  transcript: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  fileSnapshots: FileSnapshot[];
  timestamp: string;
  source: 'remote' | 'local';
}

export function printResults(results: GuideResult[]): void {
  console.log('\n' + '='.repeat(80));
  console.log('EVALUATION RESULTS');
  console.log('='.repeat(80));

  // Summary table
  console.log('\n| Guide | Score | Connection | .env | No Hardcoded Creds | Scope | Backtrack | Source |');
  console.log('|-------|-------|------------|------|-------------------|-------|-----------|--------|');

  for (const r of results) {
    const e = r.evaluation.llmEval;
    const d = r.evaluation.deterministicChecks;
    const dims = e.dimensions || {};
    const p = (v: boolean | undefined) => v ? 'PASS' : 'FAIL';
    console.log(
      `| ${r.guide} ` +
      `| **${e.overall_score}/10** ` +
      `| ${p(d.agent_verified_connection)} ` +
      `| ${p(d.env_file_exists)} ` +
      `| ${p(d.no_hardcoded_creds)} ` +
      `| ${p(dims.stayed_in_scope?.pass)} ` +
      `| ${p(dims.no_backtracking?.pass)} ` +
      `| ${r.source} |`,
    );
  }

  // Detailed results
  for (const r of results) {
    const e = r.evaluation.llmEval;
    const d = r.evaluation.deterministicChecks;
    const dims = e.dimensions || {};
    console.log(`\n--- ${r.guide} (${r.model}) ---`);
    console.log(`Score: ${e.overall_score}/10`);
    console.log(`Duration: ${Math.round(r.worker.durationMs / 1000)}s | Turns: ${r.worker.turnCount} | Tool calls: ${r.worker.toolCallCount}`);
    console.log(`\nDeterministic checks:`);
    console.log(`  Agent verified connection: ${d.agent_verified_connection ? 'PASS' : 'FAIL'}`);
    console.log(`  Source files created: ${d.has_source_files ? 'PASS' : 'FAIL'}`);
    console.log(`  .env file exists: ${d.env_file_exists ? 'PASS' : 'FAIL'}`);
    console.log(`  No hardcoded creds: ${d.no_hardcoded_creds ? 'PASS' : 'FAIL'}`);
    if (dims.correct_packages && typeof dims.correct_packages === 'object') {
      console.log(`\nDimensions:`);
      for (const [k, v] of Object.entries(dims)) {
        if (typeof v === 'object' && v !== null && 'pass' in v) {
          const dim = v as { pass?: boolean; note?: string };
          console.log(`  ${k}: ${dim?.pass ? 'PASS' : 'FAIL'}${dim?.note ? ` — ${dim.note}` : ''}`);
        }
      }
    }
    if (e.failures?.length > 0) {
      console.log(`\nFailures:`);
      for (const f of e.failures) console.log(`  - ${f}`);
    }
    console.log(`\nReasoning: ${e.reasoning}`);
  }

  console.log('\n' + '='.repeat(80));
}

export function saveResults(results: GuideResult[]): void {
  const resultsDir = new URL('../results', import.meta.url).pathname;
  const historyDir = `${resultsDir}/history`;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const runDir = `${historyDir}/${timestamp}`;
  mkdirSync(runDir, { recursive: true });

  // Save summary (without transcript/snapshots for readability)
  const summary = results.map(r => ({
    guide: r.guide,
    model: r.model,
    evaluation: r.evaluation,
    worker: r.worker,
    timestamp: r.timestamp,
    source: r.source,
  }));
  writeFileSync(`${resultsDir}/latest.json`, JSON.stringify(summary, null, 2));
  writeFileSync(`${runDir}/summary.json`, JSON.stringify(summary, null, 2));

  // Save per-guide artifacts
  for (const r of results) {
    const guideDir = `${runDir}/${r.guide}`;
    mkdirSync(guideDir, { recursive: true });

    // Transcript as readable text
    const transcriptLines: string[] = [];
    for (const msg of r.transcript) {
      if (msg.role === 'user' && typeof msg.content === 'string') {
        if (msg.content.length > 500) {
          transcriptLines.push('[USER] (provided documentation guide and task)\n');
        } else {
          transcriptLines.push(`[USER] ${msg.content}\n`);
        }
      } else if (msg.role === 'assistant') {
        const am = msg as any;
        if (am.content) transcriptLines.push(`[ASSISTANT] ${am.content}\n`);
        if (am.tool_calls) {
          for (const tc of am.tool_calls) {
            if (tc.type !== 'function') continue;
            const args = JSON.parse(tc.function.arguments);
            if (tc.function.name === 'bash') {
              transcriptLines.push(`[TOOL bash] ${args.command}\n`);
            } else if (tc.function.name === 'write_file') {
              transcriptLines.push(`[TOOL write_file] ${args.path}\n${args.content}\n`);
            } else if (tc.function.name === 'read_file') {
              transcriptLines.push(`[TOOL read_file] ${args.path}\n`);
            }
          }
        }
      } else if (msg.role === 'tool') {
        const tm = msg as any;
        const content = typeof tm.content === 'string' ? tm.content : '';
        transcriptLines.push(`[TOOL RESULT] ${content.slice(0, 500)}${content.length > 500 ? '...' : ''}\n`);
      }
    }
    writeFileSync(`${guideDir}/transcript.txt`, transcriptLines.join('\n'));

    // File snapshots — write each file the agent created
    if (r.fileSnapshots.length > 0) {
      const snapshotDir = `${guideDir}/files`;
      mkdirSync(snapshotDir, { recursive: true });
      for (const snap of r.fileSnapshots) {
        const safePath = snap.path.replace(/\//g, '__');
        writeFileSync(`${snapshotDir}/${safePath}`, snap.content);
      }
      // Also write an index
      const index = r.fileSnapshots.map(s => s.path).join('\n');
      writeFileSync(`${guideDir}/files-index.txt`, index);
    }

    // Raw transcript JSON (for programmatic access)
    writeFileSync(`${guideDir}/transcript.json`, JSON.stringify(r.transcript, null, 2));
  }

  console.log(`\nResults saved to:`);
  console.log(`  results/latest.json (summary)`);
  console.log(`  results/history/${timestamp}/ (full artifacts)`);
  for (const r of results) {
    console.log(`    ${r.guide}/transcript.txt`);
    console.log(`    ${r.guide}/files/ (${r.fileSnapshots.length} files)`);
  }
}
