/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import capabilities from 'app/models/capabilities.json';
import { resolveModel } from 'app/models/resolve';
import modelsData from 'app/models.json/data.json';
import getModelDetailPageData from 'components/pages/doc/ai-gateway-model-index/model-detail-data';
import ModelDetailIntro from 'components/pages/doc/ai-gateway-model-index/model-detail-intro';
import {
  getInitialMode,
  getLanguagesForMode,
} from 'components/pages/doc/ai-gateway-model-index/model-examples';
import * as modelRows from 'components/pages/doc/ai-gateway-model-index/model-rows';
import Post from 'components/pages/doc/post';
import VERCEL_URL from 'constants/base';
import LINKS from 'constants/links';
import getMetadata from 'utils/get-metadata';

const rows = modelRows.buildRows(modelsData.neon, capabilities);

const getRow = (modelId) => rows.find((row) => row.id === decodeURIComponent(modelId));
const getModelSlug = (modelId) => `ai-gateway/models/${encodeURIComponent(modelId)}`;
const getLanguagesByMode = (modelId) => {
  const examplesByMode = {
    text: resolveModel(modelsData, capabilities, modelId, 'chat')?.examples ?? [],
    image: resolveModel(modelsData, capabilities, modelId, 'image-generation')?.examples ?? [],
  };

  return {
    text: getLanguagesForMode(examplesByMode, 'text'),
    image: getLanguagesForMode(examplesByMode, 'image'),
  };
};

export async function generateMetadata({ params }) {
  const { modelId } = await params;
  const row = getRow(modelId);

  if (!row) return notFound();

  const title = `${row.name} - Neon Docs`;
  const encodedTitle = Buffer.from(row.name).toString('base64');
  const encodedCategory = Buffer.from('AI Gateway').toString('base64');
  const currentSlug = getModelSlug(row.id);
  const markdownPath = `/docs/${currentSlug}.md`;

  return getMetadata({
    title,
    description: `Use ${row.name} (${row.id}) with the Neon AI Gateway.`,
    imagePath: `${VERCEL_URL}/docs/og?title=${encodedTitle}&category=${encodedCategory}`,
    pathname: `${LINKS.docs}/${currentSlug}`,
    type: 'article',
    markdownPath,
  });
}

const ModelPage = async ({ params, searchParams }) => {
  const { modelId } = await params;
  const { mode: requestedMode } = (await searchParams) ?? {};
  const row = getRow(modelId);

  if (!row) return notFound();

  const languagesByMode = getLanguagesByMode(row.id);
  const initialMode = getInitialMode(languagesByMode, requestedMode);

  const currentIndex = rows.findIndex((item) => item.id === row.id);
  const previousRow = rows[currentIndex - 1];
  const nextRow = rows[currentIndex + 1];
  const currentSlug = getModelSlug(row.id);
  const { content, tableOfContents } = getModelDetailPageData(row);
  const navigationLinks = {
    previousLink: previousRow
      ? { title: previousRow.name, slug: getModelSlug(previousRow.id) }
      : { title: 'Models', slug: 'ai-gateway/models' },
    nextLink: nextRow ? { title: nextRow.name, slug: getModelSlug(nextRow.id) } : null,
  };

  return (
    <Post
      data={{ title: row.name, enableTableOfContents: true }}
      content={content}
      breadcrumbs={[
        { title: 'AI Gateway', slug: 'ai-gateway/overview' },
        { title: 'Models', slug: 'ai-gateway/models' },
        { title: row.name },
      ]}
      navigationLinks={navigationLinks}
      currentSlug={currentSlug}
      gitHubPath="content/docs/ai-gateway/models.md"
      markdownPath={`/docs/${currentSlug}.md`}
      tableOfContents={tableOfContents}
      aboveContent={
        <ModelDetailIntro row={row} languagesByMode={languagesByMode} initialMode={initialMode} />
      }
      className="w-full max-w-208 flex-1 lg:max-w-none"
    />
  );
};

export default ModelPage;
