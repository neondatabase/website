This read-only endpoint returns the S3 connection details for a branch: `s3_endpoint`, `region`, and `force_path_style`. Call it before issuing bucket calls, so you know the branch is ready and you have the endpoint your S3 client needs.

A `404` means object storage isn't available for that branch, with a `reason` field explaining why.

Neon Object Storage uses path-style addressing only, which is why `force_path_style` is returned. See [S3 compatibility](/docs/storage/s3-compatibility) for client configuration and [Buckets](/docs/reference/api/buckets) for the endpoints that read and write data, or manage buckets and objects from the CLI with [`neon buckets`](/docs/cli/buckets), which handles these S3 details for you.

Object Storage is in beta and available only in AWS US East (Ohio) (`aws-us-east-2`).
