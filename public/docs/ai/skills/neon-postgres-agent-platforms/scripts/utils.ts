/**
 * Shared @neon/sdk helpers for the example scripts.
 *
 * The scripts use a single client configured with `throwOnError` (methods
 * return the resource directly and throw a typed NeonError on failure) and
 * `waitForReadiness` (mutations block until their provisioning operations
 * settle, so the returned resource is ready to use). That readiness polling is
 * built into the SDK, so these scripts no longer hand-roll an operation poller.
 */
import { createNeonClient, type NeonClient } from "@neon/sdk";

/** Build an ergonomic Neon client from a raw API key. */
export function neonClient(apiKey: string): NeonClient<true> {
  return createNeonClient<true>({
    apiKey,
    throwOnError: true,
    waitForReadiness: true,
  });
}

/**
 * Resolve the project's default (production) branch id. Uses the SDK's
 * `getDefault`, which resolves by the `default` flag rather than by name.
 */
export async function getProductionBranchId(
  neon: NeonClient<true>,
  projectId: string,
): Promise<string> {
  const branch = await neon.branches.getDefault(projectId);
  return branch.id;
}
