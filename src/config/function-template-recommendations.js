// Website editorial choices. These are recommendations, not installation dependencies.
// An entry replaces automatic selection completely. Use [] to hide the section.
// IDs are resolved against the live registry; array order is the display order.
export const MANUAL_TEMPLATE_RECOMMENDATIONS = {
  // A JSON starter grows into a data-backed app with users, files, email and jobs.
  basic: [
    'rest-api-postgres',
    'authenticated-api',
    'presigned-uploads',
    'resend-email',
    'inngest-workflow',
  ],
  // Turn web research into agent tools, persisted records, durable runs and email briefs.
  'context-dev': [
    'openai-agents',
    'rest-api-postgres',
    'inngest-workflow',
    'aiinbx',
    'rate-limit-postgres',
  ],
  // Keep uploaded originals and extracted metadata; add batch processing and user quotas.
  'image-analysis': [
    'presigned-uploads',
    'rest-api-postgres',
    'inngest-workflow',
    'authenticated-api',
    'rate-limit-postgres',
  ],
  // Give an agent database tools alongside web context, a frontend API and durable tasks.
  'mcp-postgres': [
    'openai-agents',
    'context-dev',
    'rest-api-postgres',
    'rate-limit-postgres',
    'inngest-workflow',
  ],
  // The bot already has chat history. Add web knowledge, media, durable tasks and quotas.
  'telegram-bot': [
    'context-dev',
    'image-analysis',
    'image-generation',
    'inngest-workflow',
    'rate-limit-postgres',
  ],
  // Extend CRUD with verified users, request budgets, attachments, notifications and jobs.
  'rest-api-postgres': [
    'authenticated-api',
    'rate-limit-postgres',
    'presigned-uploads',
    'resend-email',
    'inngest-workflow',
  ],
  // Generation already stores its output. Add access, budgets, gallery data and processing.
  'image-generation': [
    'authenticated-api',
    'rate-limit-postgres',
    'rest-api-postgres',
    'inngest-workflow',
    'image-analysis',
  ],
  // The /me example supplies identity; add the actual user-owned application features.
  'authenticated-api': [
    'rest-api-postgres',
    'presigned-uploads',
    'rate-limit-postgres',
    'resend-email',
    'inngest-workflow',
  ],
  // Enrich chat/extraction with web data, user identity, persisted results and file inputs.
  'tanstack-ai': [
    'context-dev',
    'authenticated-api',
    'rest-api-postgres',
    'rate-limit-postgres',
    'presigned-uploads',
  ],
  // Identify voters, constrain writes, manage poll data, invite users and finalize results.
  'websocket-live-poll': [
    'authenticated-api',
    'rate-limit-postgres',
    'rest-api-postgres',
    'resend-email',
    'inngest-workflow',
  ],
  // Supply useful workflow steps and protect the public entry point, without another engine.
  'inngest-workflow': [
    'resend-email',
    'presigned-uploads',
    'image-analysis',
    'context-dev',
    'authenticated-api',
  ],
  // The same workflow use case needs the same additions, whichever engine the user chose.
  'upstash-workflow': [
    'resend-email',
    'presigned-uploads',
    'image-analysis',
    'context-dev',
    'authenticated-api',
  ],
  // Tie transactional email to business events, recipient data, permissions and file links.
  'resend-email': [
    'inngest-workflow',
    'rest-api-postgres',
    'authenticated-api',
    'presigned-uploads',
    'rate-limit-postgres',
  ],
  // Memory and approval already exist. Add current facts, app-data tools and email actions.
  mastra: ['context-dev', 'mcp-postgres', 'aiinbx', 'authenticated-api', 'rate-limit-postgres'],
  // Give uploaded assets owners, metadata, analysis, a processing pipeline and completion mail.
  'presigned-uploads': [
    'authenticated-api',
    'rest-api-postgres',
    'image-analysis',
    'inngest-workflow',
    'resend-email',
  ],
  // Platform state already exists. Extend answers and media; verify web users and cap usage.
  'chat-sdk': [
    'context-dev',
    'authenticated-api',
    'image-analysis',
    'image-generation',
    'rate-limit-postgres',
  ],
  // Derive trusted quota keys and apply the limiter to data, AI and upload endpoints.
  'rate-limit-postgres': [
    'authenticated-api',
    'rest-api-postgres',
    'image-generation',
    'openai-agents',
    'presigned-uploads',
  ],
  // Replace demonstration tools with web/database/email actions and add end-user controls.
  'openai-agents': [
    'context-dev',
    'mcp-postgres',
    'authenticated-api',
    'rate-limit-postgres',
    'aiinbx',
  ],
  // Sending, drafts and scheduling already exist. Add personalized research and app context.
  aiinbx: [
    'mastra',
    'context-dev',
    'rest-api-postgres',
    'authenticated-api',
    'rate-limit-postgres',
  ],
  // Extend the existing read mirror with app queries, onboarding actions and notifications.
  'workos-sync': [
    'rest-api-postgres',
    'inngest-workflow',
    'resend-email',
    'mcp-postgres',
    'rate-limit-postgres',
  ],
};

// Directed category priorities, highest relevance first. The source category may
// appear anywhere in its list; if omitted, it is considered after its neighbours.
// Use functional categories from registry.json. `first-party` is not a topic.
export const TEMPLATE_CATEGORY_RECOMMENDATIONS = {
  api: ['auth', 'api', 'workflow', 'email', 'websocket', 'sync', 'storage', 'mcp'],
  auth: ['api', 'email', 'sync', 'auth', 'workflow', 'websocket'],
  ai: ['ai-infrastructure', 'storage', 'mcp', 'agents', 'ai', 'workflow', 'bots', 'auth'],
  'ai-infrastructure': ['agents', 'ai', 'mcp', 'workflow', 'storage'],
  mcp: ['agents', 'auth', 'ai', 'api', 'mcp', 'workflow', 'sync'],
  bots: ['ai-infrastructure', 'agents', 'workflow', 'email', 'storage', 'ai', 'bots', 'auth'],
  websocket: ['auth', 'api', 'workflow', 'bots', 'websocket'],
  workflow: ['email', 'api', 'storage', 'agents', 'workflow', 'sync'],
  email: ['workflow', 'auth', 'bots', 'agents', 'email', 'api'],
  agents: ['ai-infrastructure', 'mcp', 'workflow', 'email', 'storage', 'agents', 'ai'],
  storage: ['api', 'auth', 'ai', 'workflow', 'storage'],
  sync: ['auth', 'workflow', 'api', 'websocket', 'mcp', 'sync'],
};
