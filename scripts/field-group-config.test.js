import { describe, it, expect } from 'vitest';

import { computeFieldGroups } from './lib/field-group-config.mjs';
import { auditFieldGroups, validateFieldGroups } from './validate-field-groups.mjs';

// computeFieldGroups operates on the generator's enriched `properties` (nested
// schema) and emits the serialized section contract the UI partitions by. These
// tests pin: object-expansion, paths/extra, lone-wrapper descent, deprecated
// auto-routing, the "Other" fallback (graceful degradation), staleRefs, and the
// seed map. Fixtures mirror the real createProject/createProjectBranch shapes.

const obj = (properties, extra = {}) => ({ type: 'object', properties, ...extra });

// project-wrapped body covering every path the real createProject config
// references, so a correct fixture audits clean.
const wrapped = () =>
  obj(
    {
      project: obj(
        {
          name: { type: 'string' },
          region_id: { type: 'string' },
          pg_version: { type: 'integer', default: 17 },
          org_id: { type: 'string' },
          settings: obj({
            hipaa: { type: 'boolean' },
            quota: obj({ active: { type: 'boolean' } }),
          }),
          branch: obj({ name: { type: 'string' }, database_name: { type: 'string' } }),
          default_endpoint_settings: obj({
            autoscaling_limit_min_cu: { type: 'number' },
            suspend_timeout_seconds: { type: 'integer' },
          }),
          provisioner: { type: 'string' },
          store_passwords: { type: 'boolean' },
          autoscaling_limit_min_cu: { type: 'number', deprecated: true },
          history_retention_seconds: { type: 'integer' },
        },
        {
          displayOrder: [
            'name',
            'region_id',
            'pg_version',
            'org_id',
            'settings',
            'branch',
            'default_endpoint_settings',
            'provisioner',
            'store_passwords',
            'autoscaling_limit_min_cu',
            'history_retention_seconds',
          ],
        }
      ),
    },
    { displayOrder: ['project'] }
  ).properties;

describe('computeFieldGroups — createProject', () => {
  const { sections, seed, labels, unassigned, staleRefs } = computeFieldGroups(
    'createProject',
    wrapped()
  );

  it('returns no unassigned and no stale refs for the configured op', () => {
    expect(unassigned).toEqual([]);
    expect(staleRefs).toEqual([]);
  });

  const byId = (id) => sections.find((s) => s.id === id);

  it('Basics expands paths/extra into absolute rows with the common flag', () => {
    const basics = byId('basics');
    expect(basics.common).toBe(true);
    const paths = basics.rows.map((r) => r.path);
    expect(paths).toContain('project.name');
    expect(paths).toContain('project.region_id');
    expect(basics.rows.every((r) => r.common)).toBe(true);
  });

  it('object sections expand a nested object into its children as rows', () => {
    const settings = byId('settings');
    const paths = settings.rows.map((r) => r.path);
    expect(paths).toContain('project.settings.hipaa');
    expect(paths).toContain('project.settings.quota');
    // extra (out of the expanded object) is flagged outOfObject
    const extraRow = settings.rows.find((r) => r.path === 'project.history_retention_seconds');
    expect(extraRow.outOfObject).toBe(true);
  });

  it('routes deprecated top-level fields to a collapsed Deprecated section', () => {
    const dep = byId('deprecated');
    expect(dep.collapsed).toBe(true);
    expect(dep.rows.map((r) => r.path)).toEqual(['project.autoscaling_limit_min_cu']);
  });

  it('emits the curated seed for paths that exist', () => {
    expect(seed['project.name']).toBe('my-production-db');
    expect(seed['project.region_id']).toBe('aws-us-east-2');
  });

  it('emits curated display labels for paths that exist', () => {
    expect(labels['project.name']).toEqual({
      title: 'Project name',
      defaultLabel: 'auto-generated',
    });
    expect(labels['project.org_id']).toEqual({
      title: 'Organization',
      defaultLabel: 'personal account',
    });
    expect(labels['project.pg_version']).toEqual({
      title: 'Postgres version',
    });
  });
});

describe('computeFieldGroups — graceful degradation', () => {
  it('puts an unconfigured new top-level field into Other and reports it unassigned', () => {
    const props = wrapped();
    props.project.properties.brand_new_field = { type: 'string' };
    props.project.displayOrder.push('brand_new_field');
    const { sections, unassigned } = computeFieldGroups('createProject', props);
    const other = sections.find((s) => s.id === 'other');
    expect(other.rows.map((r) => r.path)).toContain('project.brand_new_field');
    expect(unassigned).toContain('project.brand_new_field');
  });

  it('flags a configured object that no longer exists as a stale ref', () => {
    const props = wrapped();
    delete props.project.properties.settings;
    const { staleRefs } = computeFieldGroups('createProject', props);
    expect(staleRefs.some((s) => s.includes('project.settings'))).toBe(true);
  });

  it('returns null sections for an unconfigured op (UI falls back to flat tree)', () => {
    const res = computeFieldGroups('someUnconfiguredOp', wrapped());
    expect(res.sections).toBeNull();
  });
});

describe('computeFieldGroups — no wrapper (createProjectBranch shape)', () => {
  const props = obj(
    {
      branch: obj({ name: { type: 'string' }, parent_id: { type: 'string' } }),
      endpoints: { type: 'array', items: obj({ type: { type: 'string' } }) },
      annotation_value: obj({ k: { type: 'string' } }),
    },
    { displayOrder: ['branch', 'endpoints', 'annotation_value'] }
  ).properties;

  it('groups top-level fields without descending a wrapper', () => {
    const { sections, unassigned } = computeFieldGroups('createProjectBranch', props);
    const branch = sections.find((s) => s.id === 'branch');
    expect(branch.rows.map((r) => r.path)).toEqual(['branch.name', 'branch.parent_id']);
    const endpoint = sections.find((s) => s.id === 'endpoint');
    expect(endpoint.rows.map((r) => r.path)).toEqual(['endpoints']);
    expect(unassigned).toEqual([]);
  });
});

describe('validateFieldGroups', () => {
  const opOf = (operationId, properties) => ({
    operationId,
    requestBody: { properties, displayOrder: properties.project ? ['project'] : undefined },
  });

  it('audit reports clean for a fully grouped op', () => {
    const res = auditFieldGroups([opOf('createProject', wrapped())]);
    expect(res.unassigned).toEqual([]);
    expect(res.staleRefs).toEqual([]);
    // orphanedOps is global over FIELD_GROUPS; the present op must not appear.
    expect(res.orphanedOps).not.toContain('createProject');
  });

  it('reports an orphaned op when a configured operationId is absent from the spec', () => {
    const res = auditFieldGroups([]);
    expect(res.orphanedOps).toContain('createProject');
  });

  it('strict mode throws on stale refs; warn-only mode does not', () => {
    const props = wrapped();
    delete props.project.properties.settings;
    const ops = [opOf('createProject', props)];
    expect(() => validateFieldGroups(ops, { strict: true })).toThrow();
    expect(() => validateFieldGroups(ops)).not.toThrow();
  });

  it('warn-only mode never throws on unassigned new fields', () => {
    const props = wrapped();
    props.project.properties.brand_new_field = { type: 'string' };
    expect(() => validateFieldGroups([opOf('createProject', props)])).not.toThrow();
  });
});
