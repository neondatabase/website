import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { Container, dockerExec } from './docker.js';
import { getClient } from './client.js';

export interface DeterministicChecks {
  has_source_files: boolean;
  env_file_exists: boolean;
  no_hardcoded_creds: boolean;
  agent_verified_connection: boolean;
}

export interface EvalDimension {
  pass: boolean;
  note: string;
}

export interface EvalResult {
  overall_score: number;
  dimensions: {
    correct_packages: EvalDimension;
    best_practices: EvalDimension;
    stayed_in_scope: EvalDimension;
    no_backtracking: EvalDimension;
  };
  user_interventions: number;
  failures: string[];
  reasoning: string;
}

export interface FullEvaluation {
  deterministicChecks: DeterministicChecks;
  llmEval: EvalResult;
}

// --- Layer 1: Deterministic checks ---

export async function runDeterministicChecks(
  container: Container,
  connectionString: string,
  transcript: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
): Promise<DeterministicChecks> {
  // Check if source files were created
  const filesResult = await dockerExec(
    container,
    `find /app -type f \
      -not -path '*/node_modules/*' \
      -not -path '*/__pycache__/*' \
      -not -path '*/venv/*' \
      -not -path '*/.venv/*' \
      -not -path '*/target/*' \
      -not -name '*.class' \
      -not -name 'package-lock.json' \
      -not -name 'go.sum' \
      2>/dev/null | wc -l`,
  );
  const hasSourceFiles = parseInt(filesResult.stdout.trim(), 10) > 0;

  // Check .env file exists (anywhere under /app)
  const envCheck = await dockerExec(container, 'find /app -name ".env" -type f 2>/dev/null | head -1');
  let envFileExists = envCheck.stdout.trim().length > 0;

  // For Elixir, C# we use config.exs/dev.exs, appsettings.json, etc. as the credential store instead of .env, so we won't check for hardcoded creds if no .env file is found
  if (!envFileExists) {
    envFileExists = await dockerExec(container, 'find /app -type f \\( -name "config.exs" -o -name "dev.exs" -o -name "appsettings.json" \\) 2>/dev/null | head -1')
      .then(res => res.stdout.trim().length > 0);
  }

  // Check no hardcoded credentials in source files
  const connMatch = connectionString.match(/npg_[a-zA-Z0-9]+/);
  const searchFragment = connMatch ? connMatch[0] : '';
  let noHardcodedCreds = true;
  if (searchFragment) {
    const grepResult = await dockerExec(
      container,
      `grep -r "${searchFragment}" \
        --include="*.js" --include="*.ts" --include="*.py" \
        --include="*.go" --include="*.java" --include="*.rb" \
        /app 2>/dev/null | grep -v node_modules | grep -v '.env' | grep -v __pycache__ || true`,
    );
    noHardcodedCreds = grepResult.stdout.trim() === '';
  }

  // Check if the agent's own verification showed a successful connection
  // Look for PostgreSQL version strings or success indicators in tool results
  const transcriptText = JSON.stringify(transcript);
  const agentVerifiedConnection =
    /PostgreSQL \d+\.\d+/.test(transcriptText) ||
    /successfully connected/i.test(transcriptText) ||
    /connection.*successful/i.test(transcriptText) ||
    /rows? (affected|inserted|created|returned)/i.test(transcriptText);

  return {
    has_source_files: hasSourceFiles,
    env_file_exists: envFileExists,
    no_hardcoded_creds: noHardcodedCreds,
    agent_verified_connection: agentVerifiedConnection,
  };
}

// --- Layer 2: LLM evaluation ---

const scoringTool: OpenAI.Chat.Completions.ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'submit_evaluation',
    description: 'Submit the evaluation scores for this guide test run.',
    parameters: {
      type: 'object',
      properties: {
        overall_score: {
          type: 'number',
          description: 'Overall score from 0-10.',
        },
        dimensions: {
          type: 'object',
          properties: {
            correct_packages: {
              type: 'object',
              properties: { pass: { type: 'boolean' }, note: { type: 'string' } },
              required: ['pass', 'note'],
            },
            best_practices: {
              type: 'object',
              properties: { pass: { type: 'boolean' }, note: { type: 'string' } },
              required: ['pass', 'note'],
            },
            stayed_in_scope: {
              type: 'object',
              properties: { pass: { type: 'boolean' }, note: { type: 'string' } },
              required: ['pass', 'note'],
            },
            no_backtracking: {
              type: 'object',
              properties: { pass: { type: 'boolean' }, note: { type: 'string' } },
              required: ['pass', 'note'],
            },
          },
          required: ['correct_packages', 'best_practices', 'stayed_in_scope', 'no_backtracking'],
        },
        user_interventions: {
          type: 'integer',
          description: 'Number of user interventions needed beyond providing credentials.',
        },
        failures: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of specific failures or issues.',
        },
        reasoning: {
          type: 'string',
          description: 'Detailed reasoning for the scores given.',
        },
      },
      required: ['overall_score', 'dimensions', 'user_interventions', 'failures', 'reasoning'],
    },
  },
};

function buildTranscriptSummary(transcript: OpenAI.Chat.Completions.ChatCompletionMessageParam[]): string {
  const parts: string[] = [];

  for (const msg of transcript) {
    if (msg.role === 'user' && typeof msg.content === 'string') {
      if (msg.content.length > 500) {
        parts.push('[User provided documentation guide and task]');
      } else {
        parts.push(`User: ${msg.content}`);
      }
    } else if (msg.role === 'assistant') {
      const am = msg as OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam;
      if (am.content && typeof am.content === 'string') {
        parts.push(`Assistant: ${am.content}`);
      }
      if (am.tool_calls) {
        for (const tc of am.tool_calls) {
          if (tc.type !== 'function') continue;
          const args = JSON.parse(tc.function.arguments);
          if (tc.function.name === 'bash') {
            parts.push(`Tool [bash]: ${args.command}`);
          } else if (tc.function.name === 'write_file') {
            parts.push(`Tool [write_file]: ${args.path} (${args.content?.length || 0} chars)`);
          } else if (tc.function.name === 'read_file') {
            parts.push(`Tool [read_file]: ${args.path}`);
          }
        }
      }
    } else if (msg.role === 'tool') {
      const tm = msg as OpenAI.Chat.Completions.ChatCompletionToolMessageParam;
      const content = typeof tm.content === 'string' ? tm.content : '';
      const preview = content.length > 200 ? content.slice(0, 200) + '...' : content;
      parts.push(`Tool result: ${preview}`);
    }
  }

  return parts.join('\n');
}

async function callWithRetry(
  client: OpenAI,
  params: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
  maxRetries = 3,
): Promise<OpenAI.Chat.Completions.ChatCompletion> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await client.chat.completions.create(params);
    } catch (err: any) {
      if (err?.status === 429 && attempt < maxRetries) {
        const waitSec = Math.pow(2, attempt + 1) * 5;
        console.log(`  Rate limited (429). Waiting ${waitSec}s before retry ${attempt + 1}/${maxRetries}...`);
        await new Promise(r => setTimeout(r, waitSec * 1000));
        continue;
      }
      throw err;
    }
  }
  throw new Error('Unreachable');
}

export async function runLLMEvaluation(
  transcript: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  docsMarkdown: string,
  deterministicChecks: DeterministicChecks,
  evalModel: string,
): Promise<EvalResult> {
  const client = getClient(evalModel);
  const rubricPath = new URL('../config/rubric.md', import.meta.url).pathname;
  const rubric = readFileSync(rubricPath, 'utf-8');

  const transcriptSummary = buildTranscriptSummary(transcript);

  // Truncate docs to avoid overwhelming the evaluator context
  const docsPreview = docsMarkdown.length > 3000
    ? docsMarkdown.slice(0, 3000) + '\n...(truncated)'
    : docsMarkdown;

  const evalPrompt = [
    '## Documentation guide (reference)',
    '',
    docsPreview,
    '',
    '## Deterministic check results',
    '',
    `- Source files created: ${deterministicChecks.has_source_files ? 'PASS' : 'FAIL'}`,
    `- .env file exists: ${deterministicChecks.env_file_exists ? 'PASS' : 'FAIL'}`,
    `- No hardcoded credentials: ${deterministicChecks.no_hardcoded_creds ? 'PASS' : 'FAIL'}`,
    `- Agent verified connection in transcript: ${deterministicChecks.agent_verified_connection ? 'PASS' : 'FAIL'}`,
    '',
    '## Agent session transcript',
    '',
    transcriptSummary,
    '',
    `- Total turns: ${transcript.filter(m => m.role === 'assistant').length}`,
    '',
    'Based on the rubric, the documentation guide, the deterministic checks, and the full transcript,',
    'evaluate this agent session by calling the submit_evaluation tool.',
  ].join('\n');

  const response = await callWithRetry(client, {
    model: evalModel,
    max_tokens: 2048,
    messages: [
      { role: 'system', content: rubric },
      { role: 'user', content: evalPrompt },
    ],
    tools: [scoringTool],
    tool_choice: { type: 'function', function: { name: 'submit_evaluation' } },
  });

  const choice = response.choices[0];
  const toolCalls = choice?.message?.tool_calls || [];
  for (const tc of toolCalls) {
    if (tc.type === 'function' && tc.function.name === 'submit_evaluation') {
      return JSON.parse(tc.function.arguments) as EvalResult;
    }
  }

  throw new Error('Evaluator did not return a scoring result');
}

export async function evaluate(
  container: Container,
  connectionString: string,
  transcript: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  docsMarkdown: string,
  evalModel: string,
): Promise<FullEvaluation> {
  console.log('  Running deterministic checks...');
  const deterministicChecks = await runDeterministicChecks(container, connectionString, transcript);

  console.log('  Running LLM evaluation...');
  const llmEval = await runLLMEvaluation(transcript, docsMarkdown, deterministicChecks, evalModel);

  return { deterministicChecks, llmEval };
}
