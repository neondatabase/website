import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import SEO_DATA from 'constants/seo-data';

import plans from './data/plans';
import { LAUNCH_RESOURCE_SIZES, SCALE_RESOURCE_SIZES } from './resource-size-select';

const pricingMd = readFileSync(join(process.cwd(), 'public', 'pricing.md'), 'utf8');

const monthlyCost = (planId, { cu, storage }) => {
  const { computeRate, storageRate } = plans.find((plan) => plan.planId === planId);
  return Math.round(cu * computeRate + storage * storageRate);
};

const formatUsd = (value) => `$${value.toLocaleString('en-US')}`;

const LAUNCH_DEFAULT = LAUNCH_RESOURCE_SIZES.find(({ id }) => id === 'small');
const SCALE_DEFAULT = SCALE_RESOURCE_SIZES.find(({ id }) => id === 'xlarge');

describe('typical spend quoted outside the hero', () => {
  const launch = formatUsd(monthlyCost('launch', LAUNCH_DEFAULT));
  const scale = formatUsd(monthlyCost('scale', SCALE_DEFAULT));

  it('matches the hero defaults in the pricing page title and description', () => {
    expect(SEO_DATA.pricing.title).toContain(`${launch}/Month`);
    expect(SEO_DATA.pricing.description).toMatch(new RegExp(`\\${launch}/month[^;]*on Launch`));
    expect(SEO_DATA.pricing.description).toMatch(new RegExp(`\\${scale}/month[^;]*on Scale`));
  });

  it('matches the hero in the pricing.md workload table', () => {
    const rows = [
      ...pricingMd.matchAll(
        /^\| (\w+ load) +\| ([\d,]+) CU-hours.*\| (\S+(?: \S+)?) +\| (\$[\d,]+) +\|$/gm
      ),
    ];
    expect(rows).toHaveLength(SCALE_RESOURCE_SIZES.length);

    rows.forEach(([, , cu, launchCell, scaleCell]) => {
      const cuHours = Number(cu.replace(/,/g, ''));
      const launchSize = LAUNCH_RESOURCE_SIZES.find((size) => size.cu === cuHours);
      const scaleSize = SCALE_RESOURCE_SIZES.find((size) => size.cu === cuHours);

      expect(scaleCell).toBe(formatUsd(monthlyCost('scale', scaleSize)));
      expect(launchCell).toBe(
        launchSize ? formatUsd(monthlyCost('launch', launchSize)) : 'Not listed'
      );
    });
  });
});
