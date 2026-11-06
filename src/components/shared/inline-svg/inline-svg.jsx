import fs from 'fs/promises';
import path from 'path';

import PropTypes from 'prop-types';

import Admonition from 'components/shared/admonition';
import { cn } from 'utils/cn';

const FallbackMessage = ({ src }) => (
  <Admonition type="warning">
    Failed to load SVG from <code>{src}</code>
  </Admonition>
);

FallbackMessage.propTypes = {
  src: PropTypes.string.isRequired,
};

// Renders an SVG from `public/` inline in the DOM instead of via an <img> tag,
// so CSS hover states and SMIL click animations inside the SVG keep working.
const InlineSvg = async ({ src, title = null, className = null }) => {
  // Only .svg files under public/, no path traversal
  if (typeof src !== 'string' || !src.endsWith('.svg') || src.includes('..')) {
    return <FallbackMessage src={String(src)} />;
  }

  try {
    const filePath = path.join(process.cwd(), 'public', src);
    let svg = await fs.readFile(filePath, 'utf8');
    // Inline SVGs must stay script-free; strip any script tags and inline event handlers
    svg = svg.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/\son\w+="[^"]*"/gi, '');

    return (
      <div
        className={cn('my-5 [&>svg]:h-auto [&>svg]:w-full', className)}
        role={title ? 'img' : undefined}
        aria-label={title || undefined}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  } catch {
    return <FallbackMessage src={src} />;
  }
};

InlineSvg.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
};

export default InlineSvg;
