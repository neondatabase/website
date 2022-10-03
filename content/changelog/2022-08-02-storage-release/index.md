---
label: 'Storage'
---

### What's new

- Compute: Installed the 'uuid-ossp' extension binaries. `CREATE EXTENSION "uuid-ossp"` now works.
- Compute: Added logging for compute node initialization failure during the 'basebackup' stage.
- Pageserver: Avoided busy looping when deletion from cloud storage is skipped due to failed upload tasks.
- Pageserver: Merged the 'wal_receiver' endpoint with 'timeline_detail', in the internal management API.
- Pageserver: Added reporting of the physical size with the tenant status, in the internal management API.
