/**
 * MDX to Markdown Processor for LLM Consumption
 *
 * Converts MDX documentation to clean markdown by:
 * 1. Parsing MDX into AST (unified/remark ecosystem)
 * 2. Transforming MDX components to plain markdown
 * 3. Preserving HTML elements like <details>
 * 4. Converting URLs to absolute
 *
 * See LLMS_PROCESSOR_GUIDE.md for detailed documentation on:
 * - Adding new component handlers
 * - Architecture and processing order
 * - Gotchas and lessons learned
 *
 * Supported components:
 * - Admonition -> **Type:** content
 * - CodeTabs -> **Tab: label** + code blocks
 * - Tabs/TabItem -> **Tab: label** + content
 * - Steps -> extracts children
 * - DetailIconCards -> bullet list with links
 * - <a> with href/description -> markdown link
 * - <details>/<summary> -> preserved as HTML
 * - CTA -> blockquote with title, description, command, link
 * - CopyPrompt, NeedHelp, Comment -> removed (UI-only)
 *
 * Dependencies: unified, remark-parse, remark-gfm, unist-util-visit, gray-matter, js-yaml (direct); remark-mdx and mdast-util-* (transitive). We pin the direct ones so version conflicts (e.g. remark-gfm v4 needing unified v11 while another dep had v10) don’t break the build.
 */

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

const matter = require('gray-matter');
const jsYaml = require('js-yaml');

// Project root for shared content loading (set during processing)
let projectRoot = null;

// Current file being processed (for error reporting)
let currentFile = null;

// Cache for external code fetches (populated before processing)
const externalCodeCache = new Map();

// Tracking arrays for build summary
const unknownComponents = [];
const fetchFailures = [];
const processingErrors = [];

/**
 * Parameterless shared content components - map of ComponentName -> template-name
 * These load a template from content/docs/shared-content/ with no props.
 * To add a new one, just add an entry here.
 */
const SHARED_CONTENT_COMPONENTS = {
  FeatureBeta: 'feature-beta',
  MCPTools: 'mcp-tools',
  LinkAPIKey: 'manage-api-keys',
  LRNotice: 'lr-notice',
  ComingSoon: 'coming-soon',
  PrivatePreview: 'private-preview',
  PrivatePreviewEnquire: 'private-preview-enquire',
  PublicPreview: 'public-preview',
  LRBeta: 'lr-inbound-beta',
  MigrationAssistant: 'migration-assistant',
  NextSteps: 'next-steps',
  NewPricing: 'new-pricing',
  EarlyAccess: 'early-access',
};

/**
 * Components to ignore completely (return null).
 * UI-only elements, interactive widgets, and decorative components.
 * To add a new one, just add an entry here.
 */
const IGNORED_COMPONENTS = [
  'CopyPrompt', // UI copy button
  'NeedHelp', // UI help widget
  'Comment', // MDX comments
  'Video', // HTML5 video (no text content)
  'UserButton', // Auth UI element
  'RequestForm', // Interactive form
  'Suspense', // React utility
  'SqlToRestConverter', // Interactive app
  'LogosSection', // Decorative logos
  'ComputeCalculator', // Interactive widget
  'UseCaseContext', // Repetitive boilerplate
];

// ESM modules loaded dynamically
let unified;
let remarkParse;
let remarkMdx;
let remarkGfm;
let visit;
let toMarkdown;
let mdxToMarkdown;
let gfmToMarkdown;

async function loadDependencies() {
  if (unified) return; // Already loaded

  const [
    unifiedMod,
    remarkParseMod,
    remarkMdxMod,
    remarkGfmMod,
    visitMod,
    toMarkdownMod,
    mdxToMarkdownMod,
    gfmToMarkdownMod,
  ] = await Promise.all([
    import('unified'),
    import('remark-parse'),
    import('remark-mdx'),
    import('remark-gfm'),
    import('unist-util-visit'),
    import('mdast-util-to-markdown'),
    import('mdast-util-mdx'),
    import('mdast-util-gfm'),
  ]);

  unified = unifiedMod.unified;
  remarkParse = remarkParseMod.default;
  remarkMdx = remarkMdxMod.default;
  remarkGfm = remarkGfmMod.default;
  visit = visitMod.visit;
  toMarkdown = toMarkdownMod.toMarkdown;
  mdxToMarkdown = mdxToMarkdownMod.mdxToMarkdown;
  gfmToMarkdown = gfmToMarkdownMod.gfmToMarkdown;
}

/**
 * Get attribute value from MDX JSX element
 */
function getAttr(node, name) {
  if (!node.attributes) return undefined;
  const attr = node.attributes.find((a) => a.type === 'mdxJsxAttribute' && a.name === name);
  if (!attr) return undefined;

  // Handle string values
  if (typeof attr.value === 'string') return attr.value;

  // Handle expression values like labels={["a", "b"]}
  if (attr.value?.type === 'mdxJsxAttributeValueExpression') {
    try {
      // Try to evaluate simple array expressions
      const expr = attr.value.value;
      // Simple JSON-like arrays
      if (expr.startsWith('[') && expr.endsWith(']')) {
        return JSON.parse(expr.replace(/'/g, '"'));
      }
      return expr;
    } catch {
      return attr.value.value;
    }
  }

  return undefined;
}

/**
 * Shared markdown serialization options
 * Custom text handler prevents over-escaping (safe for LLM output)
 */
function getMarkdownOptions() {
  return {
    extensions: [mdxToMarkdown(), gfmToMarkdown()],
    bullet: '-',
    listItemIndent: 'one', // "- item" not "-   item"
    emphasis: '_', // Use underscores for emphasis (matches source/Python)
    rule: '-', // Use --- for horizontal rules (matches Python)
    handlers: {
      text(node, _, state, info) {
        // Use state.safe() inside table cells so pipes are escaped as \|
        // Otherwise return raw value to avoid over-escaping in normal content
        if (state.stack.includes('tableCell')) {
          return state.safe(node.value, info);
        }
        return node.value;
      },
      // Use trailing spaces for hard breaks instead of backslash (matches Python)
      break() {
        return '  \n';
      },
    },
  };
}

/**
 * Normalize smart quotes to straight quotes
 */
function normalizeQuotes(text) {
  if (!text) return text;
  return text
    .replace(
      /[\u2018\u2019\u201A\u201B\u2039\u203A\u2032\u00B4\u02BC\u02B9\u275B\u275C\uFF07]/g,
      "'"
    )
    .replace(/[\u201C\u201D\u201E\u201F\u2033\u275D\u275E\uFF02]/g, '"');
}

/**
 * Convert MDAST children to markdown string
 */
function childrenToMarkdown(children) {
  if (!children || children.length === 0) return '';

  const tree = { type: 'root', children };
  return toMarkdown(tree, getMarkdownOptions()).trim();
}

/**
 * Parse HTML string containing <a> tags into MDAST nodes
 * Converts <a href="url">text</a> to proper link nodes, strips other HTML
 * @param {string} html - HTML string to parse
 * @returns {Array} - Array of MDAST nodes (text and link)
 */
function parseHtmlWithLinks(html) {
  if (!html) return [];

  const nodes = [];
  const regex = /<a\s+href=['"]([^'"]+)['"][^>]*>([^<]+)<\/a>/gi;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(html)) !== null) {
    // Add text before the link (strip any other HTML tags)
    if (match.index > lastIndex) {
      const textBefore = html.slice(lastIndex, match.index).replace(/<[^>]+>/g, '');
      if (textBefore) {
        nodes.push({ type: 'text', value: textBefore });
      }
    }
    // Add the link node
    nodes.push({
      type: 'link',
      url: match[1],
      children: [{ type: 'text', value: match[2] }],
    });
    lastIndex = regex.lastIndex;
  }

  // Add remaining text after last link (strip any other HTML tags)
  if (lastIndex < html.length) {
    const textAfter = html.slice(lastIndex).replace(/<[^>]+>/g, '');
    if (textAfter) {
      nodes.push({ type: 'text', value: textAfter });
    }
  }

  return nodes;
}

/**
 * Find JSX elements by name(s) recursively within a node
 * @param {object} node - Node to search within
 * @param {string|string[]} names - Element name(s) to find (e.g., 'a' or ['a', 'p'])
 * @returns {Array} - Array of found JSX element nodes
 */
function findJsxElements(node, names) {
  const nameList = Array.isArray(names) ? names : [names];
  const found = [];

  function traverse(n) {
    if (!n) return;
    const isJsx = n.type === 'mdxJsxFlowElement' || n.type === 'mdxJsxTextElement';
    if (isJsx && nameList.includes(n.name)) {
      found.push(n);
    }
    if (n.children) {
      for (const child of n.children) {
        traverse(child);
      }
    }
  }

  traverse(node);
  return found;
}

/**
 * Shared content template cache
 */
const sharedContentCache = new Map();

/**
 * Load and process shared content template
 * @param {string} templateName - Template name (without .md extension)
 * @param {object} props - Props to interpolate into template
 * @returns {Array} - Array of AST nodes
 */
function loadSharedContent(templateName, props = {}) {
  if (!projectRoot) {
    console.warn(`Cannot load shared content: projectRoot not set`);
    return [];
  }

  const templatePath = path.join(projectRoot, 'content/docs/shared-content', `${templateName}.md`);

  // Check cache first
  let rawContent = sharedContentCache.get(templatePath);
  if (!rawContent) {
    try {
      rawContent = fsSync.readFileSync(templatePath, 'utf-8');
      sharedContentCache.set(templatePath, rawContent);
    } catch (err) {
      console.warn(`Shared content not found: ${templatePath}`);
      return [];
    }
  }

  // Strip frontmatter
  const { content } = matter(rawContent);

  // Interpolate props: {propName} -> value
  let processed = content;
  for (const [key, value] of Object.entries(props)) {
    processed = processed.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }

  // Parse the content as MDX
  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkMdx);

  const tree = processor.parse(processed);

  // Transform the parsed content (this will handle nested MDX components)
  const transformedChildren = transformChildren(tree.children);

  return transformedChildren;
}

/**
 * Build a single checkbox list item from a CheckItem JSX node
 */
function buildCheckItem(node) {
  const title = getAttr(node, 'title') || '';
  const href = getAttr(node, 'href') || '';
  const itemChildren = [];

  if (href && title) {
    itemChildren.push({ type: 'link', url: href, children: [{ type: 'text', value: title }] });
  } else if (title) {
    itemChildren.push({ type: 'text', value: title });
  }

  const description = childrenToMarkdown(node.children);
  if (description) {
    itemChildren.push({ type: 'text', value: `\n  ${description}` });
  }

  return {
    type: 'listItem',
    checked: false,
    children: [{ type: 'paragraph', children: itemChildren }],
  };
}

/**
 * Component handlers - transform MDX JSX nodes into markdown nodes
 */
const componentHandlers = {
  /**
   * Admonition -> blockquote-style callout
   * <Admonition type="tip">content</Admonition>
   * -> **Tip:** content
   */
  Admonition(node) {
    const type = getAttr(node, 'type') || 'note';
    const title = getAttr(node, 'title');
    // Convert camelCase to Title Case (e.g., comingSoon -> Coming Soon)
    const typeLabel = type
      .replace(/([A-Z])/g, ' $1') // Add space before capitals
      .replace(/^./, (s) => s.toUpperCase()) // Capitalize first letter
      .trim();
    const label = title ? `${typeLabel}: ${title}` : `${typeLabel}:`;

    // Check if children contain block-level content (lists, code blocks, etc.)
    const hasBlockContent = node.children?.some(
      (c) =>
        c.type === 'list' || c.type === 'code' || c.type === 'heading' || c.type === 'blockquote'
    );

    if (hasBlockContent) {
      // Return label as its own paragraph, followed by children as block nodes
      return [
        {
          type: 'paragraph',
          children: [{ type: 'strong', children: [{ type: 'text', value: label }] }],
        },
        ...(node.children || []),
      ];
    }

    // Inline content: label + content on one line
    const content = childrenToMarkdown(node.children);
    return {
      type: 'paragraph',
      children: [
        { type: 'strong', children: [{ type: 'text', value: label }] },
        { type: 'text', value: ` ${content}` },
      ],
    };
  },

  /**
   * CodeTabs -> labeled code blocks
   * <CodeTabs labels={["Node.js", "Python"]}>```js...```\n```python...```</CodeTabs>
   */
  CodeTabs(node) {
    const labels = getAttr(node, 'labels') || [];
    const children = [];
    let codeBlockIndex = 0;

    // Find code blocks in children
    visit({ type: 'root', children: node.children }, 'code', (codeNode) => {
      const label = labels[codeBlockIndex] || `Option ${codeBlockIndex + 1}`;

      // Add label as plain text (matches Python output)
      children.push({
        type: 'paragraph',
        children: [{ type: 'text', value: `Tab: ${label}` }],
      });

      // Add the code block
      children.push({ ...codeNode });

      codeBlockIndex++;
    });

    return children.length > 0 ? children : null;
  },

  /**
   * Tabs/TabItem -> labeled sections
   * Labels are on the parent Tabs component, need to pass them to TabItem children
   */
  Tabs(node) {
    const labels = getAttr(node, 'labels') || [];
    const result = [];
    let tabIndex = 0;

    // Process children, assigning labels to TabItem components
    for (const child of node.children || []) {
      const isJsxElement = child.type === 'mdxJsxFlowElement' || child.type === 'mdxJsxTextElement';
      if (isJsxElement && child.name === 'TabItem') {
        // Get label from Tabs labels array, or fallback to TabItem's own label attribute
        const label = labels[tabIndex] || getAttr(child, 'label') || `Tab ${tabIndex + 1}`;

        // Add tab label (not bold, to match Python output)
        result.push({
          type: 'paragraph',
          children: [{ type: 'text', value: `Tab: ${label}` }],
        });

        // Add tab content (will be recursively transformed)
        if (child.children && child.children.length > 0) {
          result.push(...child.children);
        }

        tabIndex++;
      } else {
        // Non-TabItem children pass through
        result.push(child);
      }
    }

    return result;
  },

  // TabItem is handled by Tabs, but keep this for standalone use
  TabItem(node) {
    const label = getAttr(node, 'label') || 'Tab';
    const content = node.children || [];

    return [
      {
        type: 'paragraph',
        children: [{ type: 'text', value: `Tab: ${label}` }],
      },
      ...content,
    ];
  },

  /**
   * Steps -> keep content, headers stay as-is
   */
  Steps(node) {
    return node.children || null;
  },

  /**
   * DetailIconCards -> extract as bullet list of links with descriptions
   * By the time this runs, <a> elements are already transformed to links
   */
  DetailIconCards(node) {
    const anchors = findJsxElements(node, 'a');

    if (anchors.length === 0) {
      return node.children.length > 0 ? node.children : null;
    }

    const links = anchors
      .map((a) => {
        const href = getAttr(a, 'href');
        const description = getAttr(a, 'description');
        const linkText = a.children?.length > 0 ? childrenToMarkdown(a.children) : href;

        const linkChildren = [
          { type: 'link', url: toAbsoluteUrl(href), children: [{ type: 'text', value: linkText }] },
        ];
        if (description) {
          linkChildren.push({ type: 'text', value: `: ${description}` });
        }

        return { type: 'listItem', children: [{ type: 'paragraph', children: linkChildren }] };
      })
      .filter((item) => item);

    return links.length > 0
      ? { type: 'list', ordered: false, spread: false, children: links }
      : null;
  },

  /**
   * Preserve <details> and <summary> as HTML (not MDX components)
   */
  details(node) {
    // Return as HTML nodes that will be serialized as-is
    return [
      { type: 'html', value: '<details>' },
      ...(node.children || []),
      { type: 'html', value: '</details>' },
    ];
  },

  // Preserve <br/> as HTML (works in markdown, needed for table cells)
  br() {
    return { type: 'html', value: '<br/>' };
  },

  summary(node) {
    // Get the text content of the summary
    const text =
      node.children
        ?.filter((c) => c.type === 'text' || c.type === 'strong' || c.type === 'emphasis')
        .map((c) => {
          if (c.type === 'text') return c.value;
          if (c.type === 'strong') return `**${c.children?.map((x) => x.value).join('') || ''}**`;
          if (c.type === 'emphasis') return `_${c.children?.map((x) => x.value).join('') || ''}_`;
          return '';
        })
        .join('') || '';

    return { type: 'html', value: `<summary>${text}</summary>` };
  },

  /**
   * HTML-like elements: <a> -> markdown link with optional description
   */
  a(node) {
    const href = getAttr(node, 'href');
    if (!href) return node.children; // No href, just return text

    // Get link text from children
    let text = '';
    if (node.children) {
      text = node.children
        .filter((c) => c.type === 'text')
        .map((c) => c.value)
        .join('')
        .trim();
    }

    const linkText = text || href;

    const linkNode = {
      type: 'link',
      url: href,
      children: [{ type: 'text', value: linkText }],
    };

    // Wrap in paragraph when the <a> is a block-level element, so it
    // serializes as its own line rather than merging with surrounding content
    if (node.type === 'mdxJsxFlowElement') {
      return { type: 'paragraph', children: [linkNode] };
    }

    return linkNode;
  },

  /**
   * TechCards -> bullet list of links with titles and descriptions
   * Unlike DetailIconCards, TechCards <a> elements use title attribute (not children text)
   * <TechCards><a href="/docs/guides/node" title="Node.js" description="Connect a Node.js app" icon="node-js"></a></TechCards>
   */
  TechCards(node) {
    const anchors = findJsxElements(node, 'a');

    if (anchors.length === 0) {
      return node.children?.length > 0 ? node.children : null;
    }

    const links = anchors
      .map((a) => {
        const href = getAttr(a, 'href');
        const title = getAttr(a, 'title');
        const description = getAttr(a, 'description');
        const linkText = title || (a.children?.length > 0 ? childrenToMarkdown(a.children) : href);

        const linkChildren = [
          { type: 'link', url: toAbsoluteUrl(href), children: [{ type: 'text', value: linkText }] },
        ];
        if (description) {
          linkChildren.push({ type: 'text', value: `: ${description}` });
        }

        return { type: 'listItem', children: [{ type: 'paragraph', children: linkChildren }] };
      })
      .filter(Boolean);

    return links.length > 0
      ? { type: 'list', ordered: false, spread: false, children: links }
      : null;
  },

  /**
   * InfoBlock -> container, just extract children
   */
  InfoBlock(node) {
    return node.children || null;
  },

  /**
   * DefinitionList -> container for markdown definition lists
   * Content is already in markdown definition list format (Term\n: Definition)
   * Just extract children to preserve the format
   */
  DefinitionList(node) {
    return node.children || null;
  },

  /**
   * Shared content components with props - load from template files with interpolation
   */
  FeatureBetaProps(node) {
    const featureName = getAttr(node, 'feature_name') || '';
    return loadSharedContent('feature-beta-props', { feature_name: featureName });
  },

  AIRule(node) {
    const name = getAttr(node, 'name') || '';
    return loadSharedContent('ai-rule-usage', { name });
  },

  EarlyAccessProps(node) {
    const featureName = getAttr(node, 'feature_name') || '';
    return loadSharedContent('early-access-props', { feature_name: featureName });
  },

  /**
   * DocsList -> title + bullet list of items
   * <DocsList title="What you will learn:"><p>Item</p><a href="/docs/foo">Link</a></DocsList>
   */
  DocsList(node) {
    const title = getAttr(node, 'title') || '';
    const items = [];

    // Process <a> elements as links
    for (const a of findJsxElements(node, 'a')) {
      const href = getAttr(a, 'href');
      if (href) {
        const linkText = a.children?.length > 0 ? childrenToMarkdown(a.children) : href;
        items.push({
          type: 'listItem',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'link',
                  url: toAbsoluteUrl(href),
                  children: [{ type: 'text', value: linkText }],
                },
              ],
            },
          ],
        });
      }
    }

    // Process <p> elements as text items
    for (const p of findJsxElements(node, 'p')) {
      const text = p.children?.length > 0 ? childrenToMarkdown(p.children) : '';
      if (text.trim()) {
        items.push({
          type: 'listItem',
          children: [{ type: 'paragraph', children: [{ type: 'text', value: text }] }],
        });
      }
    }

    const result = [];
    if (title) {
      result.push({
        type: 'paragraph',
        children: [{ type: 'strong', children: [{ type: 'text', value: title }] }],
      });
    }
    if (items.length > 0) {
      result.push({ type: 'list', ordered: false, spread: false, children: items });
    }

    return result.length > 0 ? result : null;
  },

  /**
   * CheckList -> heading + checkbox items
   * <CheckList title="Production checklist">
   *   <CheckItem>...</CheckItem>
   * </CheckList>
   */
  CheckList(node) {
    const title = getAttr(node, 'title') || 'Checklist';

    // Collect CheckItem children into a single list to avoid alternating bullet markers
    const items = findJsxElements(node, 'CheckItem').map((c) => buildCheckItem(c));

    return [
      { type: 'heading', depth: 2, children: [{ type: 'text', value: title }] },
      ...(items.length > 0
        ? [{ type: 'list', ordered: false, spread: false, children: items }]
        : []),
    ];
  },

  /**
   * CheckItem -> checkbox list item (standalone fallback; normally handled by CheckList)
   */
  CheckItem(node) {
    return { type: 'list', ordered: false, spread: false, children: [buildCheckItem(node)] };
  },

  /**
   * p -> paragraph (HTML <p> element inside components like DocsList)
   */
  p(node) {
    return {
      type: 'paragraph',
      children: node.children || [],
    };
  },

  /**
   * TwoColumnLayout -> container, extract children
   * Used for SDK reference pages with side-by-side content
   */
  TwoColumnLayout(node) {
    return node.children || null;
  },

  /**
   * TwoColumnLayout.Item -> section with title and optional method signature
   * <TwoColumnLayout.Item title="Installation" method="createAuth()" id="installation">
   */
  'TwoColumnLayout.Item': function (node) {
    const title = getAttr(node, 'title') || '';
    const method = getAttr(node, 'method') || '';

    const result = [];

    if (title) {
      result.push({ type: 'heading', depth: 2, children: [{ type: 'text', value: title }] });
    }

    if (method) {
      result.push({
        type: 'paragraph',
        children: [
          { type: 'text', value: 'Method: ' },
          { type: 'inlineCode', value: method },
        ],
      });
    }

    // Add children content
    if (node.children && node.children.length > 0) {
      result.push(...node.children);
    }

    return result;
  },

  /**
   * TwoColumnLayout.Block -> content block, just extract children
   * Alternates between description and code typically
   */
  'TwoColumnLayout.Block': function (node) {
    const label = getAttr(node, 'label') || '';

    if (!label) {
      return node.children;
    }

    // Handle labeled blocks
    const labelLower = label.toLowerCase();
    const result = [];

    if (labelLower === 'terminal') {
      result.push({
        type: 'paragraph',
        children: [{ type: 'text', value: 'Run in terminal:' }],
      });
    } else if (labelLower === 'console') {
      // Console blocks show UI screenshots - skip or minimal context
      return null;
    } else if (labelLower === 'sql editor') {
      result.push({
        type: 'paragraph',
        children: [{ type: 'text', value: 'Run this SQL query:' }],
      });
    } else if (label.includes('/') || (label.includes('.') && !label.startsWith('.'))) {
      // File path
      result.push({
        type: 'paragraph',
        children: [
          { type: 'text', value: 'In ' },
          { type: 'inlineCode', value: label },
          { type: 'text', value: ':' },
        ],
      });
    } else if (label.startsWith('.')) {
      // Dotfile like .env
      result.push({
        type: 'paragraph',
        children: [
          { type: 'text', value: 'In ' },
          { type: 'inlineCode', value: label },
          { type: 'text', value: ':' },
        ],
      });
    } else {
      // Generic label
      result.push({
        type: 'paragraph',
        children: [{ type: 'strong', children: [{ type: 'text', value: `${label}:` }] }],
      });
    }

    if (node.children && node.children.length > 0) {
      result.push(...node.children);
    }

    return result;
  },

  /**
   * TwoColumnLayout.Step -> step with title
   */
  'TwoColumnLayout.Step': function (node) {
    const title = getAttr(node, 'title') || '';

    const result = [];
    if (title) {
      result.push({ type: 'heading', depth: 2, children: [{ type: 'text', value: title }] });
    }

    if (node.children && node.children.length > 0) {
      result.push(...node.children);
    }

    return result;
  },

  /**
   * TwoColumnLayout.Footer -> container, just extract children
   */
  'TwoColumnLayout.Footer': function (node) {
    return node.children || null;
  },

  /**
   * LinkPreview -> link with optional preview text
   * <LinkPreview href="/docs/foo" title="Title" preview="Preview text">Link text</LinkPreview>
   */
  LinkPreview(node) {
    const href = getAttr(node, 'href') || '';
    const title = getAttr(node, 'title') || '';
    const preview = getAttr(node, 'preview') || '';

    // Get link text from children, fall back to title
    const linkText = childrenToMarkdown(node.children) || title || href;

    const linkNode = {
      type: 'link',
      url: href,
      children: [{ type: 'text', value: linkText }],
    };

    if (preview) {
      return {
        type: 'paragraph',
        children: [linkNode, { type: 'text', value: ` (${preview})` }],
      };
    }

    return linkNode;
  },

  /**
   * ProgramForm -> hardcoded text based on form type
   * <ProgramForm type="agent" />
   */
  ProgramForm(node) {
    const formType = getAttr(node, 'type') || '';

    if (formType === 'agent') {
      return {
        type: 'paragraph',
        children: [
          { type: 'text', value: 'Apply for the Agent Plan: ' },
          {
            type: 'link',
            url: `${BASE_URL}/use-cases/ai-agents`,
            children: [{ type: 'text', value: `${BASE_URL}/use-cases/ai-agents` }],
          },
        ],
      };
    }

    return null; // Remove for other form types
  },

  /**
   * ExternalCode -> fetch code from GitHub and display as code block
   * <ExternalCode url="https://raw.githubusercontent.com/..." />
   * Security: Only allows github.com and raw.githubusercontent.com
   */
  ExternalCode(node) {
    const url = getAttr(node, 'url') || getAttr(node, 'src') || '';

    if (!url) {
      return {
        type: 'paragraph',
        children: [{ type: 'text', value: '[ExternalCode: No URL specified]' }],
      };
    }

    // Check security - only allow GitHub domains
    const ALLOWED_DOMAINS = ['github.com', 'raw.githubusercontent.com', 'gist.github.com'];
    let isAllowed = false;
    try {
      const urlObj = new URL(url);
      isAllowed = ALLOWED_DOMAINS.some(
        (d) => urlObj.hostname === d || urlObj.hostname.endsWith(`.${d}`)
      );
    } catch {
      isAllowed = false;
    }

    if (!isAllowed) {
      return {
        type: 'paragraph',
        children: [{ type: 'text', value: `[ExternalCode: Domain not allowed - ${url}]` }],
      };
    }

    // Check cache for pre-fetched content
    const cachedContent = externalCodeCache.get(url);
    if (cachedContent) {
      // Detect language from URL
      const ext = path.extname(url).slice(1).toLowerCase();
      const langMap = {
        py: 'python',
        js: 'javascript',
        ts: 'typescript',
        jsx: 'jsx',
        tsx: 'tsx',
        rb: 'ruby',
        go: 'go',
        java: 'java',
        c: 'c',
        cpp: 'cpp',
        cs: 'csharp',
        php: 'php',
        sh: 'shell',
        sql: 'sql',
        md: 'markdown',
        mdc: 'markdown',
        html: 'html',
        css: 'css',
        json: 'json',
        yml: 'yaml',
        yaml: 'yaml',
        rs: 'rust',
        toml: 'toml',
      };
      const lang = langMap[ext] || ext || 'text';

      return {
        type: 'code',
        lang,
        value: cachedContent,
      };
    }

    // If not cached, return a reference link
    return {
      type: 'paragraph',
      children: [
        { type: 'text', value: 'External code: ' },
        { type: 'link', url, children: [{ type: 'text', value: url }] },
      ],
    };
  },

  // CopyPrompt, NeedHelp -> registered via IGNORED_COMPONENTS below
  /**
   * YoutubeIframe -> YouTube link
   */
  YoutubeIframe(node) {
    const embedId = getAttr(node, 'embedId');
    if (!embedId) return null;
    // Clean up embedId (remove query params if present)
    const videoId = embedId.split('?')[0];
    return {
      type: 'paragraph',
      children: [
        { type: 'text', value: 'Watch on YouTube: ' },
        {
          type: 'link',
          url: `https://youtube.com/watch?v=${videoId}`,
          children: [{ type: 'text', value: `https://youtube.com/watch?v=${videoId}` }],
        },
      ],
    };
  },

  /**
   * MegaLink -> link card with tag and description
   * <MegaLink tag="Tagline" title="Description text" url="https://..." />
   */
  MegaLink(node) {
    const tag = getAttr(node, 'tag') || '';
    const title = getAttr(node, 'title') || '';
    const url = getAttr(node, 'url');

    if (!url) return null;

    const children = [];
    if (tag) {
      children.push({ type: 'strong', children: [{ type: 'text', value: tag }] });
      children.push({ type: 'text', value: ' ' });
    }
    if (title) {
      children.push({ type: 'text', value: `${title} ` });
    }
    children.push({
      type: 'link',
      url,
      children: [{ type: 'text', value: 'Learn more' }],
    });

    return { type: 'paragraph', children };
  },

  /**
   * CommunityBanner -> link with descriptive text
   */
  CommunityBanner(node) {
    const buttonText = getAttr(node, 'buttonText') || 'Join';
    const buttonUrl = getAttr(node, 'buttonUrl');
    if (!buttonUrl) return null;

    const childText =
      node.children && node.children.length > 0 ? childrenToMarkdown(node.children).trim() : '';

    return {
      type: 'paragraph',
      children: [
        { type: 'text', value: childText ? `${childText} ` : '' },
        {
          type: 'link',
          url: buttonUrl,
          children: [{ type: 'text', value: buttonText }],
        },
      ],
    };
  },

  /**
   * PromptCards -> list of prompt links (useful for AI agents)
   * Children are <a> elements with title and promptSrc attributes
   */
  PromptCards(node) {
    const anchors = findJsxElements(node, 'a');
    const items = anchors
      .map((a) => {
        const title = getAttr(a, 'title');
        const promptSrc = getAttr(a, 'promptSrc');
        if (!title || !promptSrc) return null;
        return {
          type: 'listItem',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'link',
                  url: `${BASE_URL}${promptSrc}`,
                  children: [{ type: 'text', value: `${title} prompt` }],
                },
              ],
            },
          ],
        };
      })
      .filter(Boolean);

    if (items.length === 0) return null;

    return [
      {
        type: 'paragraph',
        children: [{ type: 'strong', children: [{ type: 'text', value: 'AI Coding Prompts:' }] }],
      },
      { type: 'list', ordered: false, spread: false, children: items },
    ];
  },

  /**
   * QuoteBlock -> blockquote with attribution
   * <QuoteBlock quote="..." author="name" role="title" />
   */
  QuoteBlock(node) {
    const quote = getAttr(node, 'quote');
    const author = getAttr(node, 'author') || '';
    const role = getAttr(node, 'role') || '';

    if (!quote) return null;

    const children = [{ type: 'paragraph', children: [{ type: 'text', value: quote }] }];

    if (author || role) {
      const attribution = [author, role].filter(Boolean).join(', ');
      children.push({
        type: 'paragraph',
        children: [{ type: 'text', value: `— ${attribution}` }],
      });
    }

    return { type: 'blockquote', children };
  },

  /**
   * Testimonial -> blockquote with attribution
   * <Testimonial text="..." author={{ name: '...', company: '...' }} />
   */
  Testimonial(node) {
    const text = getAttr(node, 'text');
    if (!text) return null;

    // author is an object expression, try to parse it
    let authorName = '';
    let company = '';
    const authorAttr = node.attributes?.find((a) => a.name === 'author');
    if (authorAttr?.value?.type === 'mdxJsxAttributeValueExpression') {
      const expr = authorAttr.value.value || '';
      const nameMatch = expr.match(/name:\s*['"]([^'"]+)['"]/);
      const companyMatch = expr.match(/company:\s*['"]([^'"]+)['"]/);
      if (nameMatch) authorName = nameMatch[1];
      if (companyMatch) company = companyMatch[1];
    }

    const children = [{ type: 'paragraph', children: [{ type: 'text', value: text }] }];

    if (authorName || company) {
      const attribution = [authorName, company].filter(Boolean).join(', ');
      children.push({
        type: 'paragraph',
        children: [{ type: 'text', value: `— ${attribution}` }],
      });
    }

    return { type: 'blockquote', children };
  },

  /**
   * FeatureList -> extract children (markdown content)
   */
  FeatureList(node) {
    return node.children || null;
  },

  /**
   * TestimonialsWrapper -> container, extract children
   */
  TestimonialsWrapper(node) {
    return node.children || null;
  },

  /**
   * CTA (Call-to-Action) -> blockquote with title, description, command, and link
   * Useful for humans pasting docs into ChatGPT to get actionable next steps
   */
  CTA(node) {
    const title = getAttr(node, 'title');
    const description = getAttr(node, 'description');
    const command = getAttr(node, 'command');
    const buttonText = getAttr(node, 'buttonText');
    const buttonUrl = getAttr(node, 'buttonUrl');

    const paragraphs = [];

    // Title as bold text
    if (title) {
      paragraphs.push({
        type: 'paragraph',
        children: [{ type: 'strong', children: [{ type: 'text', value: title }] }],
      });
    }

    // Description - parse HTML <a> tags into proper link nodes
    if (description) {
      const descNodes = parseHtmlWithLinks(description);
      if (descNodes.length > 0) {
        paragraphs.push({
          type: 'paragraph',
          children: descNodes,
        });
      }
    }

    // Command as inline code
    if (command) {
      paragraphs.push({
        type: 'paragraph',
        children: [{ type: 'inlineCode', value: command }],
      });
    }

    // Button as a link
    if (buttonText && buttonUrl) {
      paragraphs.push({
        type: 'paragraph',
        children: [
          {
            type: 'link',
            url: buttonUrl,
            children: [{ type: 'text', value: buttonText }],
          },
        ],
      });
    }

    if (paragraphs.length === 0) return null;

    return { type: 'blockquote', children: paragraphs };
  },
};

// Register data-driven handlers (definitions are at the top of the file)
for (const [component, template] of Object.entries(SHARED_CONTENT_COMPONENTS)) {
  componentHandlers[component] = () => loadSharedContent(template, {});
}
for (const component of IGNORED_COMPONENTS) {
  componentHandlers[component] = () => null;
}

/**
 * Recursively transform a node and its children
 */
function transformNode(node) {
  // Handle MDX JSX elements
  if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
    const componentName = node.name;
    const handler = componentHandlers[componentName];

    if (handler) {
      // Call handler with original children - handlers use childrenToMarkdown if needed
      // Don't pre-transform children as it removes meaningful JSX like <a promptSrc="..."/>
      const result = handler(node);
      // Recursively transform the result to handle nested MDX components
      // (e.g., DocsList inside InfoBlock)
      if (result === null) {
        return null;
      }
      if (Array.isArray(result)) {
        return transformChildren(result);
      }
      return transformNode(result);
    }
    // Check if it's a lowercase HTML element (not a custom component)
    if (componentName && componentName[0] === componentName[0].toLowerCase()) {
      // Preserve HTML elements by transforming children
      if (node.children && node.children.length > 0) {
        return transformChildren(node.children);
      }
      return null;
    }

    // Unknown component - preserve with label and warn
    // eslint-disable-next-line no-console
    console.warn(`[LLM Processor] Unknown component: <${componentName}>`);
    unknownComponents.push({ name: componentName, file: currentFile || 'unknown' });

    // Try to extract content from children first
    let content =
      node.children && node.children.length > 0 ? childrenToMarkdown(node.children) : '';

    // If no children, extract meaningful attributes (for self-closing components)
    if (!content.trim() && node.attributes && node.attributes.length > 0) {
      const meaningfulAttrs = node.attributes
        .filter((a) => a.type === 'mdxJsxAttribute' && a.name && a.value)
        .filter((a) => !['className', 'class', 'style', 'id'].includes(a.name))
        .map((a) => {
          const val = typeof a.value === 'string' ? a.value : a.value?.value || '';
          return `${a.name}: ${val}`;
        });
      if (meaningfulAttrs.length > 0) {
        content = meaningfulAttrs.join(', ');
      }
    }

    if (!content.trim()) {
      return null; // Remove truly empty unknown components
    }

    return {
      type: 'paragraph',
      children: [
        { type: 'strong', children: [{ type: 'text', value: `[${componentName}]:` }] },
        { type: 'text', value: ` ${content}` },
      ],
    };
  }

  // Recursively transform children
  if (node.children) {
    node.children = transformChildren(node.children);
  }

  return node;
}

/**
 * Transform an array of children, flattening arrays and removing nulls
 */
function transformChildren(children) {
  const result = [];
  for (const child of children) {
    const transformed = transformNode(child);
    if (transformed === null) {
      // Remove
    } else if (Array.isArray(transformed)) {
      result.push(...transformed);
    } else {
      result.push(transformed);
    }
  }
  return result;
}

/**
 * Create a remark plugin that transforms MDX components
 */
function remarkTransformMdxComponents() {
  return (tree) => {
    tree.children = transformChildren(tree.children);
  };
}

/**
 * Clean up code block metadata (remove shouldWrap, etc.)
 */
function remarkCleanCodeBlocks() {
  return (tree) => {
    visit(tree, 'code', (node) => {
      // Remove metadata that's not useful for LLMs
      if (node.meta) {
        node.meta =
          node.meta
            .replace(/\bshouldWrap\b/g, '')
            .replace(/\s+/g, ' ')
            .trim() || null;
      }

      // Remove Shiki/VitePress line annotations from code content
      // e.g., // [!code ++], // [!code --], // [!code highlight], // [!code focus]
      if (node.value) {
        node.value = node.value
          .replace(/\s*\/\/\s*\[!code[^\]]*\]/g, '') // JS/TS style
          .replace(/\s*#\s*\[!code[^\]]*\]/g, '') // Python/Ruby style
          .replace(/\s*<!--\s*\[!code[^\]]*\]\s*-->/g, ''); // HTML style
      }
    });
  };
}

/**
 * Convert relative URLs to absolute URLs
 */
const BASE_URL = 'https://neon.com';

function toAbsoluteUrl(url, pageUrl) {
  if (!url) return url;
  // Skip already absolute URLs and special protocols
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('mailto:') ||
    url.startsWith('tel:')
  ) {
    return url;
  }
  // Convert anchor-only links to full page URL + anchor
  if (url.startsWith('#') && pageUrl) {
    return `${pageUrl}${url}`;
  }
  // Convert absolute-path URLs (starting with /)
  if (url.startsWith('/')) {
    return `${BASE_URL}${url}`;
  }
  // Convert relative URLs (no leading /) - resolve relative to current page's parent directory
  if (pageUrl && !url.startsWith('.')) {
    // Get parent directory of current page
    // e.g., https://neon.com/postgresql/postgresql-getting-started -> https://neon.com/postgresql/
    const lastSlash = pageUrl.lastIndexOf('/');
    const pageDir = lastSlash > 0 ? pageUrl.slice(0, lastSlash + 1) : `${pageUrl}/`;
    return `${pageDir}${url}`;
  }
  return url;
}

function remarkAbsoluteUrls(pageUrl) {
  return (tree) => {
    // Convert links
    visit(tree, 'link', (node) => {
      node.url = toAbsoluteUrl(node.url, pageUrl);
    });
    // Convert images
    visit(tree, 'image', (node) => {
      node.url = toAbsoluteUrl(node.url, pageUrl);
    });
  };
}

/**
 * Calculate page URL from file path
 * e.g., content/docs/guides/django.md -> https://neon.com/docs/guides/django
 */
function getPageUrl(inputPath, baseContentDir) {
  if (!baseContentDir) return null;

  const relativePath = path.relative(baseContentDir, inputPath);
  // Remove .md extension and convert to URL path
  const urlPath = relativePath.replace(/\.md$/, '');
  return `${BASE_URL}/${urlPath}`;
}

/**
 * Pre-fetch external code URLs from content
 * Finds <ExternalCode url="..." /> patterns and fetches them
 */
async function prefetchExternalCode(content) {
  // Match <ExternalCode url="..." /> or <ExternalCode src="..." />
  const urlPattern = /<ExternalCode[^>]*(?:url|src)=["']([^"']+)["'][^>]*\/?>/g;
  const urls = [];
  let match;

  while ((match = urlPattern.exec(content)) !== null) {
    urls.push(match[1]);
  }

  if (urls.length === 0) return;

  // Fetch URLs in parallel
  const https = require('https');
  const http = require('http');

  const fetchUrl = (url) =>
    new Promise((resolve) => {
      // Convert github.com blob URLs to raw URLs
      let fetchUrlStr = url;
      if (url.includes('github.com') && url.includes('/blob/')) {
        fetchUrlStr = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
      }

      const protocol = fetchUrlStr.startsWith('https') ? https : http;

      protocol
        .get(fetchUrlStr, { timeout: 10000 }, (res) => {
          if (res.statusCode !== 200) {
            resolve({ url, error: `HTTP ${res.statusCode}` });
            return;
          }

          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => resolve({ url, content: data }));
          res.on('error', () => resolve({ url, error: 'Network error' }));
        })
        .on('error', () => resolve({ url, error: 'Network error' }));
    });

  const results = await Promise.all(urls.map(fetchUrl));

  for (const result of results) {
    if (result.content) {
      externalCodeCache.set(result.url, result.content);
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        `[LLM Processor] Failed to fetch external code: ${result.url} (${result.error})`
      );
      externalCodeCache.set(
        result.url,
        `// Code example unavailable: ${result.url}\n// Visit the URL directly to view the code.`
      );
      fetchFailures.push({ url: result.url, error: result.error });
    }
  }
}

/**
 * Process a single MDX file
 * @param {string} inputPath - Path to the input file
 * @param {string} [pageUrl] - Full URL of the page (for anchor link conversion)
 * @param {string} [rootDir] - Project root directory (for shared content)
 */
async function processFile(inputPath, pageUrl, rootDir) {
  await loadDependencies();

  // Set current file for error reporting
  currentFile = inputPath;

  // Set project root for shared content loading
  if (rootDir) {
    projectRoot = rootDir;
  }

  const raw = await fs.readFile(inputPath, 'utf-8');

  // Pre-fetch any external code URLs
  await prefetchExternalCode(raw);

  // Extract frontmatter
  const { data: frontmatter, content } = matter(raw);

  // Parse MDX into AST
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMdx)
    .use(remarkTransformMdxComponents)
    .use(remarkCleanCodeBlocks)
    .use(remarkAbsoluteUrls, pageUrl);

  const tree = processor.parse(content);
  processor.runSync(tree);

  // Serialize back to markdown with shared options (includes custom text handler)
  let markdown = toMarkdown(tree, getMarkdownOptions());

  // Convert any remaining relative URLs to absolute (catches URLs in serialized content)
  markdown = markdown.replace(/\]\(\/([^)]+)\)/g, `](${BASE_URL}/$1)`);

  // Also convert anchor-only links in serialized content
  if (pageUrl) {
    markdown = markdown.replace(/\]\(#([^)]+)\)/g, `](${pageUrl}#$1)`);
  }

  // Build output with frontmatter-based header
  let output = '';
  if (frontmatter.title) {
    output += `# ${frontmatter.title}\n\n`;
  }
  if (frontmatter.subtitle) {
    output += `${frontmatter.subtitle}\n\n`;
  }
  // TODO: Enable when summary frontmatter is added consistently across all content routes
  // if (frontmatter.summary) {
  //   output += `> ${frontmatter.summary}\n\n`;
  // }

  output += `${markdown.trim()}\n`;

  // Normalize smart quotes to straight quotes (matches Python behavior)
  output = normalizeQuotes(output);

  return output;
}

/**
 * Print a summary of unknown components and fetch failures
 */
function printBuildSummary(rootDir) {
  // Report processing errors
  if (processingErrors.length > 0) {
    console.log(`\nProcessing errors: ${processingErrors.length}`);
    for (const e of processingErrors) {
      console.log(`  - ${path.relative(rootDir, e.file)}: ${e.error}`);
    }
  }

  // Report unknown components
  if (unknownComponents.length > 0) {
    const uniqueComponents = [...new Set(unknownComponents.map((c) => c.name))];
    console.log(
      `\nUnknown components: ${unknownComponents.length} occurrences (${uniqueComponents.length} unique)`
    );
    // Group by component name
    const byName = {};
    for (const c of unknownComponents) {
      if (!byName[c.name]) byName[c.name] = [];
      byName[c.name].push(c.file);
    }
    for (const [name, files] of Object.entries(byName)) {
      console.log(`  - <${name}> in ${files.length} file(s)`);
      // Show first 3 files as examples
      for (const file of files.slice(0, 3)) {
        console.log(`    - ${path.relative(rootDir, file)}`);
      }
      if (files.length > 3) {
        console.log(`    - ... and ${files.length - 3} more`);
      }
    }
  }

  // Report fetch failures
  if (fetchFailures.length > 0) {
    console.log(`\nFetch failures: ${fetchFailures.length}`);
    for (const f of fetchFailures) {
      console.log(`  - ${f.url} (${f.error})`);
    }
  }
}

/**
 * Clear tracking arrays and caches (call at start of batch processing)
 */
function clearState() {
  unknownComponents.length = 0;
  fetchFailures.length = 0;
  processingErrors.length = 0;
  externalCodeCache.clear();
  sharedContentCache.clear();
  navigationMap = null;
}

// Navigation map (populated once in processAllContent, used by processDirectory)
let navigationMap = null;

/**
 * Build a navigation lookup map from navigation.yaml files.
 *
 * Parses both content/docs/navigation.yaml and content/postgresql/navigation.yaml
 * into a Map<slug, { sectionName, siblings, urlPrefix, breadcrumbs, pageTitle }>.
 *
 * - sectionName: the section/sub-group name containing this page
 * - siblings: other leaf pages at the same nesting level [{ title, slug }]
 * - urlPrefix: 'docs' or 'postgresql' (for building full URLs)
 * - breadcrumbs: ancestor titles from root to this page's parent (not including the page itself)
 * - pageTitle: this page's title from navigation.yaml
 */
function buildNavigationMap(rootDir) {
  const navMap = new Map();

  const navFiles = [
    { file: path.join(rootDir, 'content/docs/navigation.yaml'), urlPrefix: 'docs' },
    { file: path.join(rootDir, 'content/postgresql/navigation.yaml'), urlPrefix: 'postgresql' },
  ];

  for (const { file, urlPrefix } of navFiles) {
    if (!fsSync.existsSync(file)) continue;

    const raw = fsSync.readFileSync(file, 'utf-8');
    const navGroups = jsYaml.load(raw);
    if (!Array.isArray(navGroups)) continue;

    for (const navGroup of navGroups) {
      // Nav groups use either 'items' or 'subnav' for their children
      const groupChildren = navGroup.items || navGroup.subnav || [];
      if (groupChildren.length === 0) continue;

      for (const section of groupChildren) {
        const sectionName = section.section || section.title || '';
        const items = section.items || [];

        // Start ancestor chain with the section name (if it exists)
        const ancestors = sectionName ? [sectionName] : [];

        // Process items at this level, handling nested sub-groups
        processNavItems(items, sectionName, urlPrefix, navMap, ancestors);
      }
    }
  }

  return navMap;
}

/**
 * Recursively process navigation items, registering siblings at each level.
 * Items with a `slug` are leaf pages. Items with `items` but no `slug` are sub-groups.
 * `ancestors` tracks the hierarchy path from the root for breadcrumb context.
 */
function processNavItems(items, sectionName, urlPrefix, navMap, ancestors = []) {
  // Collect leaf pages at this level (these are siblings of each other)
  const leafPages = [];

  for (const item of items) {
    if (item.slug) {
      leafPages.push({ title: item.title, slug: item.slug });
    }
    // If item has nested items, recurse into the sub-group
    if (item.items) {
      const subGroupName = item.title || item.section || sectionName;
      // Append this sub-group's name to the ancestor chain for its children
      const childAncestors = [...ancestors, subGroupName];
      processNavItems(item.items, subGroupName, urlPrefix, navMap, childAncestors);
    }
  }

  // Register each leaf page with its siblings.
  // When a slug appears in multiple nav sections (cross-references), prefer the
  // location where more siblings share the same slug prefix — that's the canonical home.
  // e.g. extensions/pgvector belongs under Extensions (siblings: extensions/*),
  // not under AI (siblings: ai/*). Ties keep the first occurrence.
  for (const page of leafPages) {
    const slugPrefix = page.slug.split('/')[0];
    const siblings = leafPages
      .filter((p) => p.slug !== page.slug)
      .map((p) => ({ title: p.title, slug: p.slug }));
    const prefixScore = siblings.filter((s) => s.slug.split('/')[0] === slugPrefix).length;

    if (navMap.has(page.slug)) {
      const existing = navMap.get(page.slug);
      if (prefixScore <= (existing._prefixScore || 0)) continue; // existing is better or equal
    }

    // breadcrumbs: ancestor titles leading to this page (not including the page itself)
    // pageTitle: the page's own title from navigation.yaml
    navMap.set(page.slug, {
      sectionName,
      siblings,
      urlPrefix,
      breadcrumbs: [...ancestors],
      pageTitle: page.title,
      _prefixScore: prefixScore,
    });
  }
}

/**
 * Build a navigation footer for a page, listing sibling pages from navigation.yaml.
 * Returns empty string if the page is not in the navigation map or has no siblings.
 */
function buildNavigationFooter(slug, navMap) {
  if (!navMap) return '';

  const entry = navMap.get(slug);
  if (!entry || entry.siblings.length === 0) return '';

  const lines = ['\n---\n', `## Related docs (${entry.sectionName})\n`];

  for (const sibling of entry.siblings) {
    const url = `${BASE_URL}/${entry.urlPrefix}/${sibling.slug}`;
    lines.push(`- [${sibling.title}](${url})`);
  }

  return `${lines.join('\n')}\n`;
}

/**
 * Build the page header block prepended to every generated markdown file.
 * Always includes the documentation index line. Includes the location line
 * only if the page is in the navigation map with breadcrumbs.
 *
 * @param {string|null} slug - Navigation slug, or null for pages outside nav
 * @param {Map|null} navMap - Navigation map from buildNavigationMap()
 * @returns {string} Header block (1-2 lines in a blockquote, followed by blank line)
 */
function buildPageHeader(slug, navMap) {
  const lines = [];

  // Location line (only for pages in the nav map)
  if (slug && navMap) {
    const entry = navMap.get(slug);
    if (entry && entry.breadcrumbs && entry.breadcrumbs.length > 0) {
      const deduped = entry.breadcrumbs.filter((b, i) => i === 0 || b !== entry.breadcrumbs[i - 1]);
      // Also avoid trailing duplication when pageTitle matches the last breadcrumb
      const trail =
        entry.pageTitle && entry.pageTitle !== deduped[deduped.length - 1]
          ? [...deduped, entry.pageTitle]
          : deduped;
      lines.push(`> This page location: ${trail.join(' > ')}`);
    }
  }

  // Index line (always)
  lines.push(`> Full Neon documentation index: ${BASE_URL}/docs/llms.txt`);

  return `${lines.join('\n')}\n\n`;
}

/**
 * Compute navigation slug from a content-relative path.
 * Strips the first path segment (e.g. "docs/" or "postgresql/") and the .md extension.
 * Returns null if the path has no subdirectory (root-level files).
 *
 * @param {string} relativePath - Path relative to content/ (e.g. "docs/guides/prisma.md")
 * @returns {string|null} Navigation slug (e.g. "guides/prisma") or null
 */
function getNavSlug(relativePath) {
  const parts = relativePath.split('/');
  if (parts.length < 2) return null;
  return parts.slice(1).join('/').replace(/\.md$/, '');
}

/**
 * Add navigation context (page header + sibling footer) to processed markdown.
 * This is the single place where nav context is applied, used by both processDirectory
 * and compare-md-conversion.js.
 *
 * The page header always includes the documentation index URL. If the page is in the
 * navigation map, it also includes the page location (breadcrumb trail).
 *
 * @param {string} content - Processed markdown content
 * @param {string} relativePath - Path relative to content/ (e.g. "docs/guides/prisma.md")
 * @param {Map} navMap - Navigation map from buildNavigationMap()
 * @returns {string} Content with page header prepended and nav footer appended
 */
function addNavigationContext(content, relativePath, navMap) {
  const slug = getNavSlug(relativePath);

  // Page header (always added -- index line for all pages, location line when in nav map)
  const header = buildPageHeader(slug, navMap);
  let result = header + content;

  // Navigation footer (only for pages in the nav map)
  if (slug) {
    const navFooter = buildNavigationFooter(slug, navMap);
    if (navFooter) {
      result += navFooter;
    }
  }

  return result;
}

/**
 * Process a directory recursively
 */
async function processDirectory(inputDir, outputDir, baseContentDir, rootDir) {
  const entries = await fs.readdir(inputDir, { withFileTypes: true });

  for (const entry of entries) {
    const inputPath = path.join(inputDir, entry.name);

    if (entry.isDirectory()) {
      await processDirectory(inputPath, outputDir, baseContentDir, rootDir);
    } else if (entry.name.endsWith('.md')) {
      const relativePath = path.relative(baseContentDir, inputPath);
      const outputPath = path.join(outputDir, relativePath);
      const pageUrl = getPageUrl(inputPath, baseContentDir);

      await fs.mkdir(path.dirname(outputPath), { recursive: true });

      try {
        let result = await processFile(inputPath, pageUrl, rootDir);
        result = addNavigationContext(result, relativePath, navigationMap);
        await fs.writeFile(outputPath, result);
        console.log(`✓ ${relativePath}`);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`✗ ${relativePath}: ${error.message}`);
        processingErrors.push({ file: inputPath, error: error.message });
      }
    }
  }
}

/**
 * Process all content routes (for postbuild integration)
 */
async function processAllContent(contentRoutes, rootDir) {
  clearState();

  // Build navigation map once for all content
  navigationMap = buildNavigationMap(rootDir);
  console.log(`Navigation map: ${navigationMap.size} pages with sibling links\n`);

  const baseContentDir = path.join(rootDir, 'content');
  const outputDir = path.join(rootDir, 'public/md');

  for (const [route, srcPath] of Object.entries(contentRoutes)) {
    const inputDir = path.join(rootDir, srcPath);
    console.log(`Processing ${srcPath} -> public/md/${route}`);
    await processDirectory(inputDir, outputDir, baseContentDir, rootDir);
  }

  // Build-time verification: fail if no markdown files were generated
  try {
    const allFiles = await fs.readdir(outputDir, { recursive: true });
    const mdFiles = allFiles.filter((f) => f.endsWith('.md'));
    if (mdFiles.length === 0) {
      throw new Error('BUILD FAILED: No agent markdown files were generated!');
    }
    console.log(`\nGenerated ${mdFiles.length} markdown files for AI agents.`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error('BUILD FAILED: Output directory public/md/ does not exist!');
    }
    throw err;
  }

  printBuildSummary(rootDir);

  if (processingErrors.length > 0) {
    throw new Error(
      `BUILD FAILED: ${processingErrors.length} file(s) failed to process. See errors above.`
    );
  }
}

// Export for use by other scripts
module.exports = {
  processFile,
  processDirectory,
  processAllContent,
  loadDependencies,
  clearState,
  printBuildSummary,
  buildNavigationMap,
  buildNavigationFooter,
  buildPageHeader,
  addNavigationContext,
};

/**
 * CLI
 */
async function main() {
  const args = process.argv.slice(2);
  const rootDir = path.resolve(__dirname, '../..');

  if (args[0] === '--file') {
    // Process single file and output to stdout
    const inputPath = path.resolve(args[1]);
    const baseContentDir = path.join(rootDir, 'content');
    const pageUrl = getPageUrl(inputPath, baseContentDir);
    const result = await processFile(inputPath, pageUrl, rootDir);
    console.log(result);
  } else if (args[0] === '--dir') {
    // Process specific directory
    const dir = args[1] || 'docs/guides';
    const inputDir = path.join(rootDir, 'content', dir);
    const outputDir = path.join(rootDir, 'public/md');
    const baseContentDir = path.join(rootDir, 'content');

    console.log(`Processing content/${dir} -> public/md/${dir}\n`);
    await processDirectory(inputDir, outputDir, baseContentDir, rootDir);
    console.log('\nDone!');
  } else if (args[0] === '--all') {
    // Process all content routes
    const { CONTENT_ROUTES } = require('../constants/content');
    await processAllContent(CONTENT_ROUTES, rootDir);
    console.log('\nDone processing all content!');
  } else {
    // Show usage
    console.log('Usage:');
    console.log('  node process-md-for-llms.js --file <path>   Process single file to stdout');
    console.log(
      '  node process-md-for-llms.js --dir <dir>     Process directory (e.g., docs/guides)'
    );
    console.log('  node process-md-for-llms.js --all           Process all content routes');
    console.log('');
    console.log('For comparison with Python output:');
    console.log(
      '  node generate-legacy-llms-output.js          Process to public/llms/ for git diff'
    );
  }
}

// Only run CLI if this is the main module
if (require.main === module) {
  main().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
}
