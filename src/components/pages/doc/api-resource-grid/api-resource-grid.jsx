import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

import Link from 'next/link';

import Button from 'components/shared/button';
import { DOCS_BASE_PATH } from 'constants/docs';

import tagConfig from '../../../../../scripts/data/tag-config.json';

const API_DATA_DIR = resolve(process.cwd(), 'src/data/api-ref');
const TAG_ORDER = tagConfig.tags.map((tag) => tag.slug);
const TAG_DESCRIPTIONS = Object.fromEntries(
  tagConfig.tags.filter((tag) => tag.description).map((tag) => [tag.slug, tag.description])
);

function loadResources() {
  if (!existsSync(API_DATA_DIR)) return [];

  const tagCounts = {};
  const tagDisplays = {};

  for (const entry of readdirSync(API_DATA_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const tag = entry.name;
    const files = readdirSync(join(API_DATA_DIR, tag)).filter((file) => file.endsWith('.json'));
    tagCounts[tag] = files.length;

    if (files.length > 0) {
      const operation = JSON.parse(readFileSync(join(API_DATA_DIR, tag, files[0]), 'utf8'));
      tagDisplays[tag] = operation.tagDisplay ?? tag;
    }
  }

  return TAG_ORDER.filter((tag) => TAG_DESCRIPTIONS[tag] && tagCounts[tag] != null).map((tag) => ({
    tag,
    display: tagDisplays[tag] ?? tag,
    count: tagCounts[tag],
    description: TAG_DESCRIPTIONS[tag],
    href: `${DOCS_BASE_PATH}reference/api/${tag}`,
  }));
}

const ApiResourceGrid = () => {
  const resources = loadResources();
  const total = resources.reduce((sum, resource) => sum + resource.count, 0);

  if (resources.length === 0) return null;

  return (
    <div className="not-prose">
      <div className="mb-5 border border-gray-new-90 bg-gray-new-98 p-4 dark:border-gray-new-20 dark:bg-gray-new-10">
        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-start">
          <p className="text-[0.9375rem] text-gray-new-50 dark:text-gray-new-60">
            {total} endpoints across {resources.length} resources
          </p>
          <Button
            href={`${DOCS_BASE_PATH}reference/api/reference`}
            theme="outlined-new"
            className="shrink-0 px-3 py-1.5 text-sm font-medium"
          >
            Search endpoint index
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-x-4 gap-y-4 md:grid-cols-2 sm:grid-cols-1">
        {resources.map(({ tag, display, count, description, href }) => (
          <Link
            className="group flex flex-col gap-1 border border-gray-new-90 p-4 transition-colors duration-200 hover:border-gray-new-70 hover:bg-gray-new-98 dark:border-gray-new-20 dark:hover:border-gray-new-40 dark:hover:bg-gray-new-10"
            key={tag}
            href={href}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-[15px] font-semibold text-black-pure transition-colors dark:text-white">
                {display}
              </span>
              <span className="font-mono text-xs text-gray-new-50 dark:text-gray-new-60">
                {count}
              </span>
            </div>
            <p className="text-sm leading-snug text-gray-new-40 dark:text-gray-new-60">
              {description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ApiResourceGrid;
