/**
 * Shared Neon Management API utilities (operation polling + common SDK call patterns).
 * Uses {@link createApiClient} types only; no alternate Neon packages.
 */
import type { Api } from "@neondatabase/api-client";
import {
  OperationStatus,
  type GeneralError,
  type Operation,
} from "@neondatabase/api-client";

export function formatNeonManagementError(err: unknown): Error {
  if (err && typeof err === "object" && "response" in err) {
    const data = (err as { response?: { data?: GeneralError } }).response?.data;
    if (data?.message) {
      const text = data.code ? `${data.code}: ${data.message}` : data.message;
      return new Error(text);
    }
  }
  if (err instanceof Error) return err;
  return new Error(String(err));
}

export function operationIdsFrom(ops: Operation[] | undefined): string[] {
  return (ops ?? [])
    .map((o) => o.id)
    .filter((id): id is string => typeof id === "string" && id.length > 0);
}

function isTerminalSuccess(status: string): boolean {
  return (
    status === OperationStatus.Finished ||
    status === OperationStatus.Skipped ||
    status === OperationStatus.Cancelled
  );
}

function isTerminalFailure(status: string): boolean {
  return status === OperationStatus.Failed || status === OperationStatus.Error;
}

export async function waitForOperationsToSettle(
  api: Api<unknown>,
  projectId: string,
  operationIds: string[],
  options: { pollIntervalMs?: number; timeoutMs?: number } = {},
): Promise<void> {
  const pollIntervalMs = options.pollIntervalMs ?? 2000;
  const timeoutMs = options.timeoutMs ?? 5 * 60 * 1000;

  for (const opId of operationIds) {
    const startedAt = Date.now();
    for (;;) {
      const { data } = await api.getProjectOperation(projectId, opId);
      const status = data.operation?.status;
      if (!status) throw new Error(`Operation status missing for ${opId}`);
      if (isTerminalFailure(status)) {
        throw new Error(`Operation ${opId} ended with status ${status}`);
      }
      if (isTerminalSuccess(status)) break;
      if (Date.now() - startedAt > timeoutMs) {
        throw new Error(
          `Timed out waiting for operation ${opId} (last status: ${status})`,
        );
      }
      await new Promise((r) => setTimeout(r, pollIntervalMs));
    }
  }
}

export async function getProductionBranchId(
  api: Api<unknown>,
  projectId: string,
): Promise<string | undefined> {
  const { data } = await api.listProjectBranches({ projectId });
  const branches = data.branches ?? [];
  const main = branches.find((b) => b.name === "main");
  const prod = branches.find((b) => b.name === "production");
  const chosen = main ?? prod;
  return typeof chosen?.id === "string" ? chosen.id : undefined;
}

export async function createProjectWithOperations(
  api: Api<unknown>,
  params: {
    name: string;
    orgId?: string;
    endpointSettings?: {
      autoscaling_limit_min_cu?: number;
      autoscaling_limit_max_cu?: number;
      suspend_timeout_seconds?: number;
    };
  },
): Promise<{ projectId: string; databaseUrl: string }> {
  const { data } = await api.createProject({
    project: {
      name: params.name,
      ...(params.orgId ? { org_id: params.orgId } : {}),
      ...(params.endpointSettings
        ? { default_endpoint_settings: params.endpointSettings }
        : {}),
    },
  });
  const projectId = data.project?.id;
  if (!projectId)
    throw new Error("Create project: missing project id in response");
  const databaseUrl = data.connection_uris?.[0]?.connection_uri;
  if (!databaseUrl) {
    throw new Error("Create project: missing connection URI in response");
  }
  const opIds = operationIdsFrom(data.operations);
  if (opIds.length > 0) {
    await waitForOperationsToSettle(api, projectId, opIds);
  }
  return { projectId, databaseUrl };
}

export async function createLogicalSnapshot(
  api: Api<unknown>,
  projectId: string,
  options: {
    branchId?: string;
    name?: string;
    timestamp?: string;
    lsn?: string;
    expiresAt?: string;
  },
): Promise<string> {
  let branchId = options.branchId;
  if (!branchId) {
    const prodId = await getProductionBranchId(api, projectId);
    if (!prodId) {
      throw new Error(
        "No production branch (expected name main or production)",
      );
    }
    branchId = prodId;
  }
  const base = {
    projectId,
    branchId,
    ...(options.name ? { name: options.name } : {}),
    ...(options.expiresAt ? { expires_at: options.expiresAt } : {}),
  };
  const { data } = await api.createSnapshot(
    options.lsn
      ? { ...base, lsn: options.lsn }
      : {
          ...base,
          timestamp: options.timestamp ?? new Date().toISOString(),
        },
  );
  const snapshotId = data.snapshot?.id;
  if (!snapshotId)
    throw new Error("Create snapshot: missing snapshot id in response");
  const opIds = operationIdsFrom(data.operations);
  if (opIds.length > 0) {
    await waitForOperationsToSettle(api, projectId, opIds);
  }
  return snapshotId;
}

export async function applySnapshotToBranch(
  api: Api<unknown>,
  projectId: string,
  snapshotId: string,
  targetBranchId: string,
  options: {
    restoreBranchName?: string;
    finalizeRestore?: boolean;
  } = {},
): Promise<void> {
  try {
    const { data } = await api.restoreSnapshot(
      { projectId, snapshotId },
      {
        name: options.restoreBranchName ?? `before_restore_${Date.now()}`,
        finalize_restore: options.finalizeRestore !== false,
        target_branch_id: targetBranchId,
      },
    );
    const opIds = operationIdsFrom(data.operations);
    if (opIds.length > 0) {
      await waitForOperationsToSettle(api, projectId, opIds);
    }
  } catch (e) {
    throw formatNeonManagementError(e);
  }
}

export async function restoreSnapshotAsNewBranch(
  api: Api<unknown>,
  projectId: string,
  snapshotId: string,
  newBranchName: string,
  finalizeRestore = false,
): Promise<string> {
  try {
    const { data } = await api.restoreSnapshot(
      { projectId, snapshotId },
      {
        name: newBranchName,
        finalize_restore: finalizeRestore,
      },
    );
    const opIds = operationIdsFrom(data.operations);
    if (opIds.length > 0) {
      await waitForOperationsToSettle(api, projectId, opIds);
    }
    const branchId = data.branch?.id;
    if (!branchId) {
      throw new Error(
        "restoreSnapshotAsNewBranch: missing branch id in response",
      );
    }
    return branchId;
  } catch (e) {
    throw formatNeonManagementError(e);
  }
}

export async function createBranchWithOperations(
  api: Api<unknown>,
  projectId: string,
  params: { name: string; parentId?: string },
): Promise<{ id: string }> {
  const { data } = await api.createProjectBranch(projectId, {
    branch: {
      name: params.name,
      ...(params.parentId ? { parent_id: params.parentId } : {}),
    },
  });
  const id = data.branch?.id;
  if (!id) throw new Error("Create branch: missing id in response");
  const opIds = operationIdsFrom(data.operations);
  if (opIds.length > 0) {
    await waitForOperationsToSettle(api, projectId, opIds);
  }
  return { id };
}

export async function deleteSnapshotWithWait(
  api: Api<unknown>,
  projectId: string,
  snapshotId: string,
): Promise<void> {
  const { data } = await api.deleteSnapshot(projectId, snapshotId);
  const opIds = operationIdsFrom(data.operations);
  if (opIds.length > 0) {
    await waitForOperationsToSettle(api, projectId, opIds);
  }
}

export async function deleteBranchWithWait(
  api: Api<unknown>,
  projectId: string,
  branchId: string,
): Promise<void> {
  const { data } = await api.deleteProjectBranch(projectId, branchId);
  const opIds = operationIdsFrom(data.operations);
  if (opIds.length > 0) {
    await waitForOperationsToSettle(api, projectId, opIds);
  }
}
