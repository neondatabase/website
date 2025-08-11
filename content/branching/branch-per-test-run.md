---
title: 'One branch per test run'
subtitle: 'Ensure reliable, isolated testing with fresh database environments for every CI/CD pipeline run'
updatedOn: '2025-07-08T12:47:21.296Z'
---

Automated testing demands clean, isolated environments. Neon lets your CI pipeline spin up a fresh database for every test suite, ensuring reliability and parallel execution. **Here’s how it typically works**:

- The CI job creates a branch named `ci-<build-id>` (e.g., `ci-20240619-abc123`)
- Your tests run in isolation against that database
- Once testing concludes, the branch is deleted or reset

This gives you complete reproducibility (every test run starts from the same baseline) and no shared state or interference between tests.
