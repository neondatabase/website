import PropTypes from 'prop-types';
import { Children } from 'react';
import slugify from 'slugify';

import JsonLd from 'components/shared/json-ld';
import { cn } from 'utils/cn';

// Block-level tags whose content should be separated by whitespace when we
// flatten JSX children into the plain-text answer used for FAQPage JSON-LD.
const BLOCK_TAGS = new Set([
  'p',
  'li',
  'ul',
  'ol',
  'div',
  'br',
  'pre',
  'blockquote',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
]);

// Recursively extract readable text from arbitrary MDX/JSX children so the
// structured-data answer stays in sync with what the reader sees.
const extractText = (node) => {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node.props) {
    const inner = extractText(node.props.children);
    return BLOCK_TAGS.has(node.type) ? `${inner} ` : inner;
  }
  return '';
};

const Faq = ({ children, className = null }) => {
  const items = Children.toArray(children).filter((child) => child?.props?.question);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.props.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: extractText(item.props.children).replace(/\s+/g, ' ').trim(),
      },
    })),
  };

  // Unique id keeps next/script from deduplicating multiple FAQ blocks on one page.
  const scriptId = items.length
    ? `faq-json-ld-${slugify(items[0].props.question, { lower: true, strict: true })}`
    : 'faq-json-ld';

  return (
    <div className={cn('faq', className)}>
      {items.length > 0 && <JsonLd data={faqSchema} id={scriptId} />}
      {children}
    </div>
  );
};

Faq.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Faq;
