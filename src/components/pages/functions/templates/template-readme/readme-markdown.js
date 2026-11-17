import { gfmToMarkdown } from 'mdast-util-gfm';
import { toMarkdown } from 'mdast-util-to-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { SKIP, visit } from 'unist-util-visit';

import {
  BLOCK_NODE_TYPE,
  SAFE_LINK_PROTOCOLS,
  remarkTemplateBlocks,
  resolveImageUrl,
  resolveUrl,
} from './readme-blocks';

const MARKDOWN_OPTIONS = {
  bullet: '-',
  emphasis: '_',
  rule: '-',
  fences: true,
  listItemIndent: 'one',
  extensions: [gfmToMarkdown()],
};

const HTML_COMMENT = /^<!--[\s\S]*?-->$/;

const htmlProcessor = unified().use(rehypeRaw).use(rehypeSanitize, defaultSchema);

const hastText = (node) =>
  node.type === 'text' ? node.value : (node.children ?? []).map(hastText).join('');

// Markdown output has no HTML, so raw HTML keeps only the text the page would show.
const htmlText = (value) => {
  const tree = htmlProcessor.runSync({ type: 'root', children: [{ type: 'raw', value }] });
  return hastText(tree).replace(/\s+/g, ' ').trim();
};

const replaceNode = (parent, index, nodes) => {
  parent.children.splice(index, 1, ...nodes);
  return [SKIP, index];
};

// Reference-style links and images become inline ones, so their URLs get checked like the rest.
const inlineReferences = (tree) => {
  const definitions = new Map();
  visit(tree, 'definition', (node, index, parent) => {
    if (!definitions.has(node.identifier)) definitions.set(node.identifier, node);
    return replaceNode(parent, index, []);
  });

  visit(tree, ['linkReference', 'imageReference'], (node, index, parent) => {
    const definition = definitions.get(node.identifier);
    if (!definition) return replaceNode(parent, index, node.children ?? []);
    const { url, title } = definition;
    return replaceNode(parent, index, [
      node.type === 'imageReference'
        ? { type: 'image', url, title, alt: node.alt }
        : { type: 'link', url, title, children: node.children },
    ]);
  });
};

// Mirrors what the page renders: no leading h1 (the page title covers it), headings one level
// down under "About this template", links and images resolved against the template's GitHub
// folder, and unsafe URLs dropped.
const remarkRegistryReadmeMarkdown =
  ({ imageBase, linkBase }) =>
  (tree) => {
    const first = tree.children.find(
      (node) => !(node.type === 'html' && HTML_COMMENT.test(node.value.trim()))
    );
    if (first?.type === 'heading' && first.depth === 1) {
      tree.children.splice(tree.children.indexOf(first), 1);
    }

    inlineReferences(tree);

    visit(tree, (node, index, parent) => {
      if (node.type === BLOCK_NODE_TYPE) return SKIP;

      if (node.type === 'heading') {
        node.depth = Math.min(node.depth + 1, 6);
        return undefined;
      }

      if (node.type === 'html') {
        const text = htmlText(node.value);
        if (!text) return replaceNode(parent, index, []);
        const textNode = { type: 'text', value: text };
        return replaceNode(parent, index, [
          parent.type === 'root' ? { type: 'paragraph', children: [textNode] } : textNode,
        ]);
      }

      if (node.type === 'image') {
        const src = resolveImageUrl(node.url, imageBase);
        if (!src) return replaceNode(parent, index, []);
        node.url = src;
        return undefined;
      }

      if (node.type === 'link') {
        if (node.url.startsWith('#')) return undefined;
        const url = resolveUrl(node.url, linkBase);
        if (!url || !SAFE_LINK_PROTOCOLS.includes(url.protocol)) {
          return replaceNode(parent, index, node.children);
        }
        node.url = url.href;
      }
      return undefined;
    });
  };

const stringify = (nodes) => toMarkdown({ type: 'root', children: nodes }, MARKDOWN_OPTIONS).trim();

// `blocks` maps a block id to the markdown placed where the README wraps it in its tag.
// Returns the README as markdown and the block ids it placed, or null when there's nothing to show.
export const renderReadmeMarkdown = ({ markdown, imageBase, linkBase, blocks = {} }) => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkTemplateBlocks, { blocks })
    .use(remarkRegistryReadmeMarkdown, { imageBase, linkBase });

  try {
    const tree = processor.runSync(processor.parse(markdown));
    const parts = [];
    const used = new Set();
    let prose = [];

    const flushProse = () => {
      const text = stringify(prose);
      if (text) parts.push(text);
      prose = [];
    };

    tree.children.forEach((node) => {
      if (node.type !== BLOCK_NODE_TYPE) {
        prose.push(node);
        return;
      }
      if (used.has(node.block)) return;
      flushProse();
      used.add(node.block);
      parts.push(blocks[node.block]);
    });
    flushProse();

    if (parts.length === 0) return null;
    return { markdown: parts.join('\n\n'), used };
  } catch (error) {
    console.error(`Function registry: failed to render the README markdown at ${linkBase}:`, error);
    return null;
  }
};
