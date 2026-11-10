import { randomUUID } from 'node:crypto';

import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import PropTypes from 'prop-types';
import { isValidElement } from 'react';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import slugify from 'slugify';
import { unified } from 'unified';
import { SKIP, visit } from 'unist-util-visit';

import CodeBlock from 'components/shared/code-block';
import { cn } from 'utils/cn';
import { toRawGithubImageUrl } from 'utils/function-registry';

// Wrapper tags a README can put around a top-level section to have us render our own block
// there. GitHub drops unknown tags and keeps their content, so the README reads normally there.
//
//   <Operations>
//
//   ...plain markdown that GitHub shows...
//
//   </Operations>
const README_BLOCK_TAGS = {
  EnvironmentVariables: 'environment',
  Operations: 'operations',
};

const BLOCK_TAG_NAME = 'template-block';
const OPEN_TAG = /^<([A-Za-z]+)\s*>$/;
const CLOSE_TAG = /^<\/([A-Za-z]+)\s*>$/;
const SELF_CLOSING_TAG = /^<([A-Za-z]+)\s*\/>$|^<([A-Za-z]+)\s*><\/\2\s*>$/;

// GitHub's ids are prefixed the same way, so in-page `#anchor` links keep working.
const ID_PREFIX = 'user-content-';
const STRIPPED_GLOBAL_ATTRIBUTES = new Set(['accessKey', 'tabIndex']);
const EXTERNAL_LINK_REL = ['noopener', 'noreferrer', 'nofollow', 'ugc'];
const HEADING_LEVEL = /^h([1-6])$/;

const PROSE_CLASS_NAME = cn(
  'prose-doc post-content prose min-w-0 overflow-hidden dark:prose-invert xs:prose-code:break-words',
  '[&_img]:my-0 [&_p>a>img]:mr-1 [&_p>img]:mr-1'
);

// READMEs come from third-party repos, so they're rendered as plain markdown (never MDX)
// and run through GitHub's sanitize schema: no scripts, styles, iframes, SVG, or event handlers.
// Block markers carry a per-render nonce so raw HTML in the README can't forge one.
const sanitizeSchema = (nonce) => ({
  ...defaultSchema,
  tagNames: [...defaultSchema.tagNames, BLOCK_TAG_NAME],
  attributes: {
    ...defaultSchema.attributes,
    '*': defaultSchema.attributes['*'].filter(
      (attribute) => !STRIPPED_GLOBAL_ATTRIBUTES.has([attribute].flat()[0])
    ),
    [BLOCK_TAG_NAME]: [
      ['dataBlock', ...Object.values(README_BLOCK_TAGS).map((block) => `${nonce}:${block}`)],
    ],
  },
});

// A tag on its own line parses as a block of HTML; `<Operations></Operations>` as a paragraph.
const tagSource = (node) => {
  if (node.type === 'html') return node.value.trim();
  if (node.type === 'paragraph' && node.children.every((child) => child.type === 'html')) {
    return node.children
      .map((child) => child.value)
      .join('')
      .trim();
  }
  return null;
};

const blockFor = (node, pattern) => {
  const match = tagSource(node)?.match(pattern);
  return match ? README_BLOCK_TAGS[match[1] ?? match[2]] : undefined;
};

// Swaps top-level wrapper tags for block markers. Without our data for a block, the wrapped
// markdown stays. Nested or inline tags are left for the sanitizer to drop, keeping their content.
const remarkTemplateBlocks =
  ({ blocks, nonce }) =>
  (tree) => {
    const replace = (block, fallback) =>
      blocks[block]
        ? [
            {
              type: 'templateBlock',
              data: { hName: BLOCK_TAG_NAME, hProperties: { dataBlock: `${nonce}:${block}` } },
            },
          ]
        : fallback;

    const nodes = tree.children;
    const result = [];
    for (let i = 0; i < nodes.length; i += 1) {
      const selfClosing = blockFor(nodes[i], SELF_CLOSING_TAG);
      const opening = blockFor(nodes[i], OPEN_TAG);
      const end = opening
        ? nodes.findIndex((node, j) => j > i && blockFor(node, CLOSE_TAG) === opening)
        : -1;

      if (selfClosing) {
        result.push(...replace(selfClosing, []));
      } else if (end !== -1) {
        result.push(...replace(opening, nodes.slice(i + 1, end)));
        i = end;
      } else {
        result.push(nodes[i]);
      }
    }
    tree.children = result;
  };

const resolveUrl = (value, base) => {
  if (typeof value !== 'string' || !value) return null;
  try {
    return new URL(value, base);
  } catch {
    return null;
  }
};

const resolveImageUrl = (value, base) => {
  const url = resolveUrl(value, base);
  return url?.protocol === 'https:' ? toRawGithubImageUrl(url) : null;
};

// `srcset` candidates are "<url> [descriptor]"; unsafe candidates are dropped.
const resolveSrcSet = (value, base) =>
  [value]
    .flat()
    .join(',')
    .split(',')
    .map((candidate) => {
      const [src, ...descriptor] = candidate.trim().split(/\s+/);
      const url = resolveImageUrl(src, base);
      return url && [url, ...descriptor].join(' ');
    })
    .filter(Boolean)
    .join(', ');

const textContent = (node) =>
  node.type === 'text' ? node.value : (node.children ?? []).map(textContent).join('');

const removeNode = (parent, index) => {
  parent.children.splice(index, 1);
  return [SKIP, index];
};

const rehypeRegistryReadme =
  ({ imageBase, linkBase }) =>
  (tree) => {
    // The page title already renders the README's leading h1.
    const first = tree.children.find((node) => node.type === 'element');
    if (first?.tagName === 'h1') tree.children.splice(tree.children.indexOf(first), 1);

    const slugCounts = new Map();
    const headingId = (node) => {
      const slug = slugify(textContent(node), { lower: true, strict: true });
      const count = slugCounts.get(slug) ?? 0;
      slugCounts.set(slug, count + 1);
      return `${ID_PREFIX}${count ? `${slug}-${count}` : slug}`;
    };

    visit(tree, 'element', (node, index, parent) => {
      const { properties } = node;

      // Blocks render between prose segments, so only top-level markers survive.
      if (node.tagName === BLOCK_TAG_NAME && parent.type !== 'root')
        return removeNode(parent, index);

      const heading = node.tagName.match(HEADING_LEVEL);
      if (heading) {
        if (!properties.id) properties.id = headingId(node);
        node.tagName = `h${Math.min(Number(heading[1]) + 1, 6)}`;
        return undefined;
      }

      if (node.tagName === 'img') {
        const src = resolveImageUrl(properties.src, imageBase);
        if (!src) return removeNode(parent, index);
        properties.src = src;
        properties.loading = 'lazy';
        properties.decoding = 'async';
        properties.referrerPolicy = 'no-referrer';
      }

      if (properties.srcSet) {
        properties.srcSet = resolveSrcSet(properties.srcSet, imageBase) || undefined;
      }

      if (node.tagName === 'a') {
        const { href } = properties;
        if (typeof href === 'string' && href.startsWith('#')) {
          if (href.length > 1 && !href.startsWith(`#${ID_PREFIX}`)) {
            properties.href = `#${ID_PREFIX}${href.slice(1)}`;
          }
          return undefined;
        }
        const url = resolveUrl(href, linkBase);
        if (!url || !['https:', 'http:', 'mailto:'].includes(url.protocol)) {
          delete properties.href;
          return undefined;
        }
        properties.href = url.href;
        if (url.protocol !== 'mailto:') {
          properties.target = '_blank';
          properties.rel = EXTERNAL_LINK_REL;
        }
      }
      return undefined;
    });
  };

// Only fenced code (a `<code>` holding plain text) goes through CodeBlock; raw `<pre>` stays as is.
const Pre = ({ children = null }) =>
  isValidElement(children) &&
  children.type === 'code' &&
  typeof children.props.children === 'string' ? (
    <CodeBlock>{children}</CodeBlock>
  ) : (
    <pre>{children}</pre>
  );

Pre.propTypes = { children: PropTypes.node };

const ReadmeImage = ({ alt = '', ...props }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img className="inline-block max-w-full" alt={alt} {...props} />
);

ReadmeImage.propTypes = { alt: PropTypes.string };

const ReadmeTable = (props) => (
  <div className="table-wrapper">
    <table {...props} />
  </div>
);

const COMPONENTS = { pre: Pre, img: ReadmeImage, table: ReadmeTable };

const isBlank = (node) => node.type === 'text' && node.value.trim() === '';

// Splits the root at block markers: prose runs get their own container, blocks sit between them
// (outside the docs typography). Each block is placed once.
const splitAtBlocks = (tree, nonce) => {
  const segments = [];
  const used = new Set();
  tree.children.forEach((node) => {
    if (node.type === 'element' && node.tagName === BLOCK_TAG_NAME) {
      const [markerNonce, block] = String(node.properties.dataBlock ?? '').split(':');
      if (markerNonce === nonce && block && !used.has(block)) {
        used.add(block);
        segments.push({ block });
      }
      return;
    }
    const last = segments.at(-1);
    if (last?.prose) last.prose.push(node);
    else segments.push({ prose: [node] });
  });
  return {
    segments: segments.filter((segment) => segment.block || !segment.prose.every(isBlank)),
    used,
  };
};

// `blocks` maps a block id from README_BLOCK_TAGS to the node rendered in its place.
// Returns the rendered README and the ids it placed, or null when there's nothing to show.
export const renderReadme = async ({ markdown, imageBase, linkBase, blocks = {} }) => {
  const nonce = randomUUID();
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkTemplateBlocks, { blocks, nonce })
    // Sanitize adds the id prefix, so footnotes don't get it twice.
    .use(remarkRehype, { allowDangerousHtml: true, clobberPrefix: '' })
    .use(rehypeRaw)
    .use(rehypeSanitize, sanitizeSchema(nonce))
    .use(rehypeRegistryReadme, { imageBase, linkBase });

  try {
    const tree = await processor.run(processor.parse(markdown));
    const { segments, used } = splitAtBlocks(tree, nonce);
    if (segments.length === 0) return null;

    const content = segments.map((segment, index) =>
      segment.block ? (
        <div className="my-8" key={index}>
          {blocks[segment.block]}
        </div>
      ) : (
        <div className={PROSE_CLASS_NAME} key={index}>
          {toJsxRuntime(
            { type: 'root', children: segment.prose },
            { Fragment, jsx, jsxs, components: COMPONENTS }
          )}
        </div>
      )
    );
    return { content, used };
  } catch (error) {
    console.error(`Function registry: failed to render the README at ${linkBase}:`, error);
    return null;
  }
};
