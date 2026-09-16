This read-only endpoint returns the AI Gateway host for a branch as `base_url`. No dialect path is included, so append the route your client needs, for example `/v1` for chat completions. Each branch gets its own host, so requests from a preview branch stay scoped to that branch.

A `404` includes a `reason` field explaining why the gateway is unavailable.

Authenticating to the gateway uses a scoped [credential](/docs/reference/api/credentials) with the `ai_gateway:invoke` scope, not your Neon API key.

AI Gateway is in beta, requires a paid plan, and is currently available in AWS US East (Ohio) (`aws-us-east-2`) and AWS Europe (Frankfurt) (`aws-eu-central-1`). Support is expanding toward all regions. See [AI Gateway](/docs/ai-gateway/overview) for supported models and [Chat completions](/docs/ai-gateway/chat-completions) for the request format.
