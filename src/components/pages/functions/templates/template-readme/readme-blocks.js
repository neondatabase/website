import { toRawGithubImageUrl } from 'utils/function-registry';

// Wrapper tags a README can put around a top-level section to have us render our own block
// there. GitHub drops unknown tags and keeps their content, so the README reads normally there.
//
//   <Operations>
//
//   ...plain markdown that GitHub shows...
//
//   </Operations>
export const README_BLOCK_TAGS = {
  EnvironmentVariables: 'environment',
  Operations: 'operations',
};

export const BLOCK_TAG_NAME = 'template-block';
export const BLOCK_NODE_TYPE = 'templateBlock';

const OPEN_TAG = /^<([A-Za-z]+)\s*>$/;
const CLOSE_TAG = /^<\/([A-Za-z]+)\s*>$/;
const SELF_CLOSING_TAG = /^<([A-Za-z]+)\s*\/>$|^<([A-Za-z]+)\s*><\/\2\s*>$/;

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

// Swaps top-level wrapper tags for block nodes. Without our data for a block, the wrapped
// markdown stays. Nested or inline tags are left alone, so renderers drop them and keep their
// content. With a `nonce`, block nodes carry a marker that survives the HTML sanitizer.
export const remarkTemplateBlocks =
  ({ blocks, nonce = null }) =>
  (tree) => {
    const replace = (block, fallback) =>
      blocks[block]
        ? [
            {
              type: BLOCK_NODE_TYPE,
              block,
              ...(nonce && {
                data: { hName: BLOCK_TAG_NAME, hProperties: { dataBlock: `${nonce}:${block}` } },
              }),
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

export const resolveUrl = (value, base) => {
  if (typeof value !== 'string' || !value) return null;
  try {
    return new URL(value, base);
  } catch {
    return null;
  }
};

export const resolveImageUrl = (value, base) => {
  const url = resolveUrl(value, base);
  return url?.protocol === 'https:' ? toRawGithubImageUrl(url) : null;
};

export const SAFE_LINK_PROTOCOLS = ['https:', 'http:', 'mailto:'];
