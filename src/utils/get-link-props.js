import LINKS from 'constants/links';

export default function getLinkProps({ externalUrl, isInternal, post }) {
  const linkUrl = isInternal && post?.slug ? `${LINKS.blog}/${post.slug}` : externalUrl;

  if (!linkUrl) return {};

  return {
    to: linkUrl,
    target: isInternal ? undefined : '_blank',
    rel: isInternal ? undefined : 'noopener noreferrer',
  };
}
