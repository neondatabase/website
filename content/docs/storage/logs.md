---
title: Object storage logs
subtitle: View, search, and download logs for a bucket
summary: >-
  View Object Storage bucket logs in the Neon Console: S3 request logs (GET,
  PUT, DELETE, and more) and Console/API bucket and object changes, with
  levels derived from HTTP status. Covers scope_name values and common
  patterns that look like a problem but aren't.
enableTableOfContents: true
---

<FeatureBetaProps feature_name="Neon Object Storage" />

Every S3 request against a bucket streams a log line to the Neon Console, along with a line for any bucket or object change made through the Console or Neon API (creating a bucket, deleting a bucket, deleting an object or prefix):

```text
service_name:  neon-storage/my-bucket
scope_name:    neon.storage.s3.put
severity_text: INFO
body: {
  "operation": "PUT",
  "object_key": "path/to/object.parquet",
  "http_status": 200,
  "bytes": 4096,
  "duration_ms": 9.5,
  "request_id": "req-777",
  "remote_ip": "203.0.113.9"
}
```

## View logs

Bucket logs live on the branch's [Monitoring page, in the Logs tab](/docs/introduction/monitor-logs), the same shared viewer used for every service on the branch. To jump straight to one bucket's logs, open the bucket list, open that bucket's menu, and select **View logs**. Or go to **Monitoring** > **Logs** and click the **Storage** chip to see every bucket's logs together.

Expand a row to see its full context: `timestamp`, `severity`, `entity_type` (`storage`), `scope_name`, and `service_name` (`neon-storage/<bucket>`). The message body carries per-request detail: `operation` (the HTTP method), `object_key`, `http_status`, `bytes`, `duration_ms`, `request_id`, and `remote_ip`. `access_key_id` is included for authenticated requests and omitted entirely for anonymous reads against a `public_read` bucket, which is expected, not a sign of broken auth.

`scope_name` identifies what generated the line:

- `neon.storage.s3.<method>` (`get`, `put`, `delete`, `head`, `post`): an S3 API request, named for its HTTP method rather than the semantic S3 operation. Multipart upload calls (`UploadPart`, `CompleteMultipartUpload`, `AbortMultipartUpload`) also surface under their HTTP method, not a dedicated multipart scope.
- `neon.storage.api.<operation>` (`create_bucket`, `delete_bucket`, `delete_object`, `delete_prefix`): a bucket or object change made through the Console or Neon API, not an S3 client. These appear in the same stream as S3 traffic, distinguished only by this `api` vs `s3` segment.

## Log levels

A bucket's log level comes from the HTTP status code of the request, not from anything the client sets:

| Level   | HTTP status                           |
| ------- | ------------------------------------- |
| `INFO`  | Everything else (successful requests) |
| `WARN`  | 4xx                                   |
| `ERROR` | 5xx                                   |

`DEBUG`, `NOTICE`, and `FATAL` also appear as filters in the log viewer but aren't currently emitted by Object Storage; they're part of the console's shared log-level set.

## Common log entries

Most of what shows up here is routine S3 traffic. A few entries look worse than they are, and one common request type doesn't show up at all.

**Seeing `403` or `404` lines? They're expected client-side errors, not incidents.** Wrong or revoked credentials, a missing scope, or a bucket-scoped credential used from the wrong branch all return a `403` and log at `WARN`, same as any other 4xx. See [Authentication errors](/docs/storage/troubleshooting#authentication-errors) for the specific error codes and fixes.

**Seeing `503 SlowDown` logged as `ERROR`? It's a healthy rate limit, not a server failure.** `SlowDown` is a rate-limit signal returned when a request exceeds the per-IP or per-tenant limit; the storage service is otherwise healthy. It logs at `ERROR` only because the level is derived purely from the 5xx status code. Treat it as a signal to back off and retry, not an outage. See [Connection and performance errors](/docs/storage/troubleshooting#connection-and-performance-errors).

**Calling `ListBuckets` or hitting the bucket list root? You won't find it here.** Bucketless requests are deliberately excluded from the log stream, since there's no single bucket to attribute them to. If you're looking for that traffic, it isn't missing: it was never exported.

**Seeing a `501` for an operation you expected to work? It's an unsupported operation, not a client error, even though it logs at `WARN`.** Calls like `PutBucketAcl`, `PutBucketPolicy`, or `PutBucketNotificationConfiguration` return `501 Not Implemented` because Neon Object Storage doesn't support them, not because you did anything wrong. See [Not supported](/docs/storage/s3-compatibility#not-supported) for the full list.

## Filter, search, and retention

For details on filtering by level or service name, searching log bodies, live tail, downloading logs, and the 3-day retention window, see [Monitor logs](/docs/introduction/monitor-logs).

<NeedHelp/>
