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

const validateBlogPreviewAccess = ({ branch, secret }) => {
  const previewSecret = process.env.BLOG_PREVIEW_SECRET;

  if (!previewSecret || secret !== previewSecret) {
    notFound();
  }

  if (!branch) {
    notFound();
  }
};

const resolveBlogPreviewRequest = async (searchParamsPromise, resolver) => {
  const searchParams = await searchParamsPromise;
  const branch = normalizeSearchParam(searchParams?.branch);
  const secret = normalizeSearchParam(searchParams?.secret);

  validateBlogPreviewAccess({ branch, secret });

  try {
    const snapshot = await resolver({ previewBranch: branch, strictBranch: true });

    return {
      branch,
      secret,
      routeConfig: createBlogRouteConfig({ branch, secret }),
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
