Buckets are S3-compatible object storage built into the Neon backend. They branch with your data using the same copy-on-write model as Postgres: a new branch inherits its parent's buckets and their objects at the moment of forking. From there, uploads, overwrites, and deletes on a child are visible only on that branch and its descendants, and the parent stays unchanged.

These endpoints are served by your session, so they need no S3 credentials. For browser uploads or sharing a download with an unauthenticated client, use the presign endpoint; to remove a whole folder, use the delete-by-prefix endpoint. Call [Storage](/docs/reference/api/storage) first for the branch's S3 endpoint.

Object Storage is in beta and available only in AWS US East (Ohio) (`aws-us-east-2`). See [Object Storage](/docs/storage/overview) for setup and [S3 compatibility](/docs/storage/s3-compatibility) for supported operations.
