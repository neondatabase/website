import { notFound } from 'next/navigation';

import { createBlogRouteConfig } from 'constants/blog';
import {
  BlogContentBranchNotFoundError,
  BlogContentConfigError,
} from 'utils/blog-content-source.mjs';

const normalizeSearchParam = (value) => {
  if (Array.isArray(value)) {
    return value[0] || null;
  }

  return value || null;
};

const validateBlogPreviewAccess = ({ branch }) => {
  if (process.env.BLOG_PREVIEW_ENABLED !== 'true') {
    notFound();
  }

  if (!branch) {
    notFound();
  }
};

const resolveBlogPreviewRequest = async (searchParamsPromise, resolver) => {
  const searchParams = await searchParamsPromise;
  const branch = normalizeSearchParam(searchParams?.branch);

  validateBlogPreviewAccess({ branch });

  try {
    const snapshot = await resolver({ previewBranch: branch });

    return {
      branch,
      routeConfig: createBlogRouteConfig({ branch }),
      snapshot,
    };
  } catch (error) {
    if (error instanceof BlogContentBranchNotFoundError) {
      notFound();
    }

    if (error instanceof BlogContentConfigError) {
      throw new Error(error.message);
    }

    throw error;
  }
};

export default resolveBlogPreviewRequest;
