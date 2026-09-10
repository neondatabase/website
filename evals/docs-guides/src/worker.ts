import OpenAI from 'openai';
import { Container, dockerExec, dockerWriteFile, dockerReadFile } from './docker.js';
import { getClient } from './client.js';

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'bash',
      description: 'Run a bash command in the working directory. Returns stdout and stderr.',
      parameters: {
        type: 'object',
        properties: {
          command: { type: 'string', description: 'The bash command to execute' },
        },
        required: ['command'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'write_file',
      description: 'Write content to a file. Creates parent directories if needed.',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'The file path to write to' },
          content: { type: 'string', description: 'The content to write' },
        },
        required: ['path', 'content'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'read_file',
      description: 'Read the contents of a file.',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'The file path to read' },
        },
        required: ['path'],
      },
    },
  },
];

interface ToolInput {
  command?: string;
  path?: string;
  content?: string;
}

async function executeTool(
  name: string,
  input: ToolInput,
  container: Container,
): Promise<string> {
  switch (name) {
    case 'bash': {
      const result = await dockerExec(container, input.command!);
      let output = '';
      if (result.stdout) output += result.stdout;
      if (result.stderr) output += (output ? '\n' : '') + result.stderr;
      if (result.exitCode !== 0) output += `\nExit code: ${result.exitCode}`;
      return output || '(no output)';
    }
    case 'write_file':
      return dockerWriteFile(container, input.path!, input.content!);
    case 'read_file':
      return dockerReadFile(container, input.path!);
    default:
      return `Unknown tool: ${name}`;
  }
}

// Throttle: wait between API calls to stay under rate limits
const THROTTLE_MS = parseInt(process.env.EVAL_THROTTLE_MS || '2000', 10);
let lastCallTime = 0;

async function throttle(): Promise<void> {
  const elapsed = Date.now() - lastCallTime;
  if (elapsed < THROTTLE_MS) {
    await new Promise(r => setTimeout(r, THROTTLE_MS - elapsed));
  }
  lastCallTime = Date.now();
}

async function callWithRetry(
  client: OpenAI,
  params: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
  maxRetries = 5,
): Promise<OpenAI.Chat.Completions.ChatCompletion> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      await throttle();
      return await client.chat.completions.create(params);
    } catch (err: any) {
      if (err?.status === 429 && attempt < maxRetries) {
        const waitSec = Math.min(30 + attempt * 30, 120); // 30s, 60s, 90s, 120s, 120s
        console.log(`  Rate limited (429). Waiting ${waitSec}s before retry ${attempt + 1}/${maxRetries}...`);
        await new Promise(r => setTimeout(r, waitSec * 1000));
        continue;
      }
      throw err;
    }
  }
  throw new Error('Unreachable');
}

export interface WorkerResult {
  transcript: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  turnCount: number;
  toolCallCount: number;
  durationMs: number;
}

export async function runWorker(
  guideName: string,
  docsMarkdown: string,
  container: Container,
  model: string,
  timeoutMinutes: number,
): Promise<WorkerResult> {
  const client = getClient(model);
  const startTime = Date.now();
  const timeoutMs = timeoutMinutes * 60 * 1000;

  const prompt = [
    `Here is a documentation guide:`,
    '',
    docsMarkdown,
    '',
    `Your task: Follow this documentation to create a working application connected to Neon Postgres.`,
    '',
    'Environment:',
    '- You are in an empty /app directory on a Debian Linux system',
    '- Node.js 22 and Python 3 are pre-installed',
    '- You have root access and can install any other runtimes or tools with apt-get (e.g., golang, rustc, elixir, ruby, php, dotnet, openjdk, maven, etc.)',
    '- The DATABASE_URL environment variable is set with a valid Neon Postgres connection string',
    '- If you need a direct (non-pooled) connection string, derive it from DATABASE_URL by removing "-pooler" from the hostname',
    '',
    'Requirements:',
    '- Follow the guide closely. Do not add features beyond what the guide demonstrates.',
    '- Prioritize storing credentials in a .env file, but if the guide uses a different method such as config.exs for Elixir, appsettings.json for C#, etc., use that method as shown in the guide.',
    '- After setup is complete, verify the connection works by running the application.',
    '- If the app is a web server, start it and confirm it responds. If it is a script, run it and confirm the output shows a successful Neon connection.',
  ].join('\n');

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'user', content: prompt },
  ];

  let turnCount = 0;
  let toolCallCount = 0;
  const maxTurns = 60;

  while (turnCount < maxTurns) {
    if (Date.now() - startTime > timeoutMs) {
      console.log(`  Timeout reached (${timeoutMinutes}min)`);
      break;
    }

    turnCount++;
    const response = await callWithRetry(client, {
      model,
      max_tokens: 4096,
      tools,
      messages,
    });

    const choice = response.choices?.[0];
    if (!choice) {
      console.log('  Unexpected response (no choices)');
      break;
    }

    const assistantMsg = choice.message;
    messages.push(assistantMsg);

    if (assistantMsg.content?.trim()) {
      console.log(`  Agent: ${assistantMsg.content.slice(0, 120)}${assistantMsg.content.length > 120 ? '...' : ''}`);
    }

    if (choice.finish_reason !== 'tool_calls') break;

    const toolCalls = assistantMsg.tool_calls || [];
    for (const toolCall of toolCalls) {
      if (toolCall.type !== 'function') continue;
      toolCallCount++;
      const name = toolCall.function.name;
      const input: ToolInput = JSON.parse(toolCall.function.arguments);
      console.log(`  Tool [${name}]: ${name === 'bash' ? input.command?.slice(0, 80) : input.path}`);
      const result = await executeTool(name, input, container);
      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: result,
      });
    }
  }

  return {
    transcript: messages,
    turnCount,
    toolCallCount,
    durationMs: Date.now() - startTime,
  };
}
