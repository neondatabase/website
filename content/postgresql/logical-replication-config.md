[#id](#LOGICAL-REPLICATION-CONFIG)

## 31.10. Configuration Settings [#](#LOGICAL-REPLICATION-CONFIG)

- [31.10.1. Publishers](logical-replication-config#LOGICAL-REPLICATION-CONFIG-PUBLISHER)
- [31.10.2. Subscribers](logical-replication-config#LOGICAL-REPLICATION-CONFIG-SUBSCRIBER)

Logical replication requires several configuration options to be set. Most options are relevant only on one side of the replication. However, `max_replication_slots` is used on both the publisher and the subscriber, but it has a different meaning for each.

[#id](#LOGICAL-REPLICATION-CONFIG-PUBLISHER)

### 31.10.1. Publishers [#](#LOGICAL-REPLICATION-CONFIG-PUBLISHER)

[`wal_level`](runtime-config-wal#GUC-WAL-LEVEL) must be set to `logical`.

[`max_replication_slots`](runtime-config-replication#GUC-MAX-REPLICATION-SLOTS) must be set to at least the number of subscriptions expected to connect, plus some reserve for table synchronization.

[`max_wal_senders`](runtime-config-replication#GUC-MAX-WAL-SENDERS) should be set to at least the same as `max_replication_slots`, plus the number of physical replicas that are connected at the same time.

Logical replication walsender is also affected by [`wal_sender_timeout`](runtime-config-replication#GUC-WAL-SENDER-TIMEOUT).

[#id](#LOGICAL-REPLICATION-CONFIG-SUBSCRIBER)

### 31.10.2. Subscribers [#](#LOGICAL-REPLICATION-CONFIG-SUBSCRIBER)

[`max_replication_slots`](runtime-config-replication#GUC-MAX-REPLICATION-SLOTS-SUBSCRIBER) must be set to at least the number of subscriptions that will be added to the subscriber, plus some reserve for table synchronization.

[`max_logical_replication_workers`](runtime-config-replication#GUC-MAX-LOGICAL-REPLICATION-WORKERS) must be set to at least the number of subscriptions (for leader apply workers), plus some reserve for the table synchronization workers and parallel apply workers.

[`max_worker_processes`](runtime-config-resource#GUC-MAX-WORKER-PROCESSES) may need to be adjusted to accommodate for replication workers, at least ([`max_logical_replication_workers`](runtime-config-replication#GUC-MAX-LOGICAL-REPLICATION-WORKERS) + `1`). Note, some extensions and parallel queries also take worker slots from `max_worker_processes`.

[`max_sync_workers_per_subscription`](runtime-config-replication#GUC-MAX-SYNC-WORKERS-PER-SUBSCRIPTION) controls the amount of parallelism of the initial data copy during the subscription initialization or when new tables are added.

[`max_parallel_apply_workers_per_subscription`](runtime-config-replication#GUC-MAX-PARALLEL-APPLY-WORKERS-PER-SUBSCRIPTION) controls the amount of parallelism for streaming of in-progress transactions with subscription parameter `streaming = parallel`.

Logical replication workers are also affected by [`wal_receiver_timeout`](runtime-config-replication#GUC-WAL-RECEIVER-TIMEOUT), [`wal_receiver_status_interval`](runtime-config-replication#GUC-WAL-RECEIVER-STATUS-INTERVAL) and [`wal_retrieve_retry_interval`](runtime-config-replication#GUC-WAL-RETRIEVE-RETRY-INTERVAL).
