/* eslint-disable react/prop-types */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import ApiOperation from 'components/pages/doc/api-operation';
import ApiTagPage from 'components/pages/doc/api-tag-page';
import EndpointIndexPage from 'components/pages/doc/endpoint-index/endpoint-index';
import InterfaceTabActivator from 'components/pages/doc/interface-tabs/interface-tab-activator';
import Post from 'components/pages/doc/post';
import VERCEL_URL from 'constants/base';
import { DOCS_DIR_PATH } from 'constants/content';
import LINKS from 'constants/links';
import { getPostBySlug } from 'utils/api-content';
import { getNavigation, getNavigationLinks } from 'utils/api-docs';
import { loadAllTagGroups } from 'utils/api-ref-server';
import { getBreadcrumbs } from 'utils/get-breadcrumbs';
import { getFlatSidebar } from 'utils/get-flat-sidebar';
import getMetadata from 'utils/get-metadata';
import getTableOfContents from 'utils/get-table-of-contents';

const API_DATA_DIR = resolve(process.cwd(), 'src/data/api-ref');
const API_DOCS_DIR = resolve(process.cwd(), 'content/api-docs');
const API_SLUG_PREFIX = 'reference/api';
const SAFE_SLUG = /^[a-z0-9][a-z0-9-]*$/;
const STATIC_PAGES = new Set(['get-started', 'key-concepts']);

const getPublicApiMarkdownPath = (slug) => `/docs/${API_SLUG_PREFIX}/${slug}.md`;

// Only serve pre-generated slugs — no dynamic fallback to filesystem
export const dynamicParams = false;

const STABILITY_RANK = { stable: 0, beta: 1, alpha: 2 };

function stabilitySort(a, b) {
  if (a.deprecated !== b.deprecated) return a.deprecated ? 1 : -1;
  const sa = a.stability == null ? 0 : (STABILITY_RANK[a.stability] ?? 0);
  const sb = b.stability == null ? 0 : (STABILITY_RANK[b.stability] ?? 0);
  if (sa !== sb) return sa - sb;
  return (a.specIndex ?? 0) - (b.specIndex ?? 0);
}

function loadTagIntro(tag) {
  if (!SAFE_SLUG.test(tag)) return null;
  const filePath = join(API_DOCS_DIR, `${tag}.md`);
  if (!existsSync(filePath)) return null;
  return readFileSync(filePath, 'utf-8');
}

function loadOperation(tag, id) {
  if (!SAFE_SLUG.test(tag) || !SAFE_SLUG.test(id)) return null;
  const path = join(API_DATA_DIR, tag, `${id}.json`);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8'));
}

function loadTagOperations(tag) {
  if (!SAFE_SLUG.test(tag)) return null;
  const tagDir = join(API_DATA_DIR, tag);
  if (!existsSync(tagDir)) return null;
  return readdirSync(tagDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join(tagDir, f), 'utf8')))
    .sort(stabilitySort);
}

export async function generateStaticParams() {
  const params = [...STATIC_PAGES, 'reference'].map((page) => ({ slug: [page] }));

  if (!existsSync(API_DATA_DIR)) return params;

  for (const entry of readdirSync(API_DATA_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const tag = entry.name;
    params.push({ slug: [tag] });
    for (const file of readdirSync(join(API_DATA_DIR, tag))) {
      if (!file.endsWith('.json')) continue;
      params.push({ slug: [tag, file.slice(0, -5)] });
    }
  }
  return params;
}

export async function generateMetadata(props) {
  const params = await props.params;
  const [tag, id] = params.slug;

  if (tag === 'reference' && !id) {
    return getMetadata({
      title: 'Endpoint index - Neon API Reference',
      description: 'All Neon API endpoints grouped by resource',
      pathname: `${LINKS.docs}/${API_SLUG_PREFIX}/reference`,
      type: 'article',
      markdownPath: `/docs/${API_SLUG_PREFIX}.md`,
    });
  }

  if (STATIC_PAGES.has(tag) && !id) {
    const currentSlug = `${API_SLUG_PREFIX}/${tag}`;
    const post = getPostBySlug(currentSlug, DOCS_DIR_PATH);
    if (!post) return { title: 'Not Found' };
    return getMetadata({
      title: `${post.data.title} - Neon Docs`,
      description: post.data.summary ?? post.excerpt,
      pathname: `${LINKS.docs}/${currentSlug}`,
      type: 'article',
      markdownPath: `/docs/${currentSlug}.md`,
    });
  }

  const sidebar = getNavigation();
  const flatSidebar = await getFlatSidebar(sidebar);

  if (!id) {
    const ops = loadTagOperations(tag);
    if (!ops) return { title: 'Not Found' };
    const tagDisplay = ops[0]?.tagDisplay ?? tag;
    const currentSlug = `${API_SLUG_PREFIX}/${tag}`;
    const breadcrumbs = getBreadcrumbs(currentSlug, flatSidebar);
    const category = breadcrumbs[0]?.title ?? 'API Reference';
    const encodedTitle = Buffer.from(tagDisplay).toString('base64');
    const encodedCategory = Buffer.from(category).toString('base64');
    return getMetadata({
      title: `${tagDisplay} - Neon API Reference`,
      description: `All ${tagDisplay} API endpoints`,
      imagePath: `${VERCEL_URL}/docs/og?title=${encodedTitle}&category=${encodedCategory}`,
      pathname: `${LINKS.docs}/${currentSlug}`,
      type: 'article',
      markdownPath: getPublicApiMarkdownPath(tag),
    });
  }

  const operation = loadOperation(tag, id);
  if (!operation) return { title: 'Not Found' };

  const currentSlug = `${API_SLUG_PREFIX}/${tag}/${id}`;
  const breadcrumbs = getBreadcrumbs(currentSlug, flatSidebar);
  const category = breadcrumbs[0]?.title ?? 'API Reference';
  const encodedTitle = Buffer.from(operation.summary).toString('base64');
  const encodedCategory = Buffer.from(category).toString('base64');

  return getMetadata({
    title: `${operation.summary} - Neon Docs`,
    description: operation.description?.split('\n')[0] || operation.summary,
    imagePath: `${VERCEL_URL}/docs/og?title=${encodedTitle}&category=${encodedCategory}`,
    pathname: `${LINKS.docs}/${currentSlug}`,
    type: 'article',
    markdownPath: getPublicApiMarkdownPath(`${tag}/${id}`),
  });
}

const ApiRefPage = async (props) => {
  const params = await props.params;
  const [tag, id] = params.slug;

  const sidebar = getNavigation();
  const flatSidebar = await getFlatSidebar(sidebar);

  if (tag === 'reference' && !id) {
    const currentSlug = `${API_SLUG_PREFIX}/reference`;
    const breadcrumbs = getBreadcrumbs(currentSlug, flatSidebar);
    const navigationLinks = getNavigationLinks(currentSlug, flatSidebar);
    const tagGroups = loadAllTagGroups();
    const total = tagGroups.reduce((sum, g) => sum + g.operations.length, 0);
    return (
      <EndpointIndexPage
        tagGroups={tagGroups}
        total={total}
        breadcrumbs={breadcrumbs}
        navigationLinks={navigationLinks}
        currentSlug={currentSlug}
      />
    );
  }

  // Hoisted so Next.js sees a guaranteed Suspense boundary for useSearchParams
  // on every code path in this route, preventing prerender bail-out.
  const tabActivator = (
    <Suspense>
      <InterfaceTabActivator />
    </Suspense>
  );

  if (STATIC_PAGES.has(tag) && !id) {
    const currentSlug = `${API_SLUG_PREFIX}/${tag}`;
    const post = getPostBySlug(currentSlug, DOCS_DIR_PATH);
    if (!post) return notFound();
    const { data, content } = post;
    const breadcrumbs = getBreadcrumbs(currentSlug, flatSidebar);
    const navigationLinks = getNavigationLinks(currentSlug, flatSidebar);
    const tableOfContents = getTableOfContents(content);
    return (
      <>
        {tabActivator}
        <Post
          content={content}
          data={data}
          breadcrumbs={breadcrumbs}
          navigationLinks={navigationLinks}
          currentSlug={currentSlug}
          gitHubPath={`${DOCS_DIR_PATH}/${currentSlug}.md`}
          tableOfContents={tableOfContents}
        />
      </>
    );
  }

  if (!id) {
    const operations = loadTagOperations(tag);
    if (!operations || operations.length === 0) return notFound();

    const tagDisplay = operations[0]?.tagDisplay ?? tag;
    const currentSlug = `${API_SLUG_PREFIX}/${tag}`;
    const breadcrumbs = getBreadcrumbs(currentSlug, flatSidebar);
    const navigationLinks = getNavigationLinks(currentSlug, flatSidebar);

    return (
      <>
        {tabActivator}
        <ApiTagPage
          tag={tag}
          tagDisplay={tagDisplay}
          operations={operations}
          intro={loadTagIntro(tag)}
          breadcrumbs={breadcrumbs}
          navigationLinks={navigationLinks}
          currentSlug={currentSlug}
        />
      </>
    );
  }

  const operation = loadOperation(tag, id);
  if (!operation) return notFound();

  const currentSlug = `${API_SLUG_PREFIX}/${tag}/${id}`;
  const breadcrumbs = getBreadcrumbs(currentSlug, flatSidebar);
  const navigationLinks = getNavigationLinks(currentSlug, flatSidebar);

  return (
    <>
      {tabActivator}
      <ApiOperation
        operation={operation}
        breadcrumbs={breadcrumbs}
        navigationLinks={navigationLinks}
        currentSlug={currentSlug}
      />
    </>
  );
};

export default ApiRefPage;
