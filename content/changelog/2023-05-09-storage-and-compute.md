### Fixes & improvements

- Compute: Dockerfile updates for the [neondatabase/neon](https://github.com/neondatabase/neon) repository are now automatically pushed to our [public Docker Hub repository](https://hub.docker.com/u/neondatabase). This enhancement means that you no longer need to manually track and incorporate Dockerfile updates to build and test Neon locally. Instead, these changes will be available and ready to use directly from our Docker Hub repository.
- Safekeepers: Enabled parallel offload of WAL segments to remote storage. This change allows Safekeepers to upload up to five WAL segments concurrently.
