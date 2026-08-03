Scoped credentials are branch-anchored tokens for workloads that can't use a user session, such as CI jobs, servers, and S3 clients. One credential API serves multiple Neon services, and the scopes you request determine what a credential can do. Each service documents its own scopes.

The create response returns `api_token` and `s3_secret_access_key` exactly once, and they can't be retrieved again; list responses return metadata only. To rotate, create a new credential, update your environment, then revoke the old one.

A credential is valid on the branch it was created on and any branch descended from it, but not on branches outside that lineage.

Scoped credentials are in beta. See [Object Storage authentication](/docs/storage/authentication) and [AI Gateway authentication](/docs/ai-gateway/authentication) for scope details and client setup.
