import Link from 'components/shared/link/link';
import LINKS from 'constants/links';

export default function getLinkProps({ externalUrl, isInternal, post, isFeatured }) {
  const linkUrl = isInternal && post?.slug ? `${LINKS.blog}/${post.slug}` : externalUrl;

  if (!linkUrl) return {};

  return {
    to: linkUrl,
    as: !isFeatured ? Link : undefined,
    target: isInternal ? undefined : '_blank',
    rel: isInternal ? undefined : 'noopener noreferrer',
  };
}
