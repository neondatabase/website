import LINKS from 'constants/links';

interface Post {
  slug?: string;
}

interface LinkProps {
  to?: string;
  target?: string;
  rel?: string;
}

interface GetLinkPropsParams {
  externalUrl?: string;
  isInternal?: boolean;
  post?: Post;
}

export default function getLinkProps({ externalUrl, isInternal, post }: GetLinkPropsParams): LinkProps {
  const linkUrl = isInternal && post?.slug ? `${LINKS.blog}/${post.slug}` : externalUrl;

  if (!linkUrl) return {};

  return {
    to: linkUrl,
    target: isInternal ? undefined : '_blank',
    rel: isInternal ? undefined : 'noopener noreferrer',
  };
}
