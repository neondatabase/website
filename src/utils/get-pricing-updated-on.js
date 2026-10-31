import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const PRICING_MD_PATH = join(process.cwd(), 'public', 'pricing.md');
const LAST_UPDATED_REGEX = /^Last updated: (\d{4}-\d{2}-\d{2})$/m;

// public/pricing.md is the source of truth for the pricing page's last-updated date.
export default function getPricingUpdatedOn(markdown = readFileSync(PRICING_MD_PATH, 'utf8')) {
  const match = markdown.match(LAST_UPDATED_REGEX);
  if (!match) throw new Error('public/pricing.md is missing a "Last updated: YYYY-MM-DD" line');
  return `${match[1]}T00:00:00.000Z`;
}
