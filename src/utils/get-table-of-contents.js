import { FEATURES_TOC } from 'components/shared/feature-list/glowing-icon/data';

const fs = require('fs');

const slugify = require('slugify');

const sharedMdxComponents = require('../../content/docs/shared-content');

const parseMDXHeading = require('./parse-mdx-heading');

const extractCustomId = (text) => {
  const match = text.match(/\(#([^)]+)\)$/);
  if (match) {
    return match[1];
  }
  return null;
};

const buildNestedToc = (headings, currentLevel, currentIndex = 0) => {
  const toc = [];
  let localIndex = currentIndex;

  while (headings.length > 0) {
    const currentHeading = headings[0];

    const { numberedStep } = currentHeading;
    const depthMatch = currentHeading.title.match(/^#+/);
    const depth = (depthMatch ? depthMatch[0].length : 1) - 1;
    const title = currentHeading.title.replace(/(#+)\s/, '');
    const customId = extractCustomId(title);
    const cleanedTitle = title.replace(/\(#[^)]+\)$/, '');
    const titleWithInlineCode = cleanedTitle.replace(/`([^`]+)`/g, '<code>$1</code>');

    if (depth === currentLevel) {
      const tocItem = {
        title: titleWithInlineCode,
        id:
          customId ||
          slugify(cleanedTitle, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g }),
        level: depth,
        numberedStep,
        index: localIndex,
      };

      localIndex += 1;

      headings.shift();

      if (headings.length > 0) {
        const nextDepth =
          typeof headings[0] === 'string'
            ? parseMDXHeading(headings[0])[0]
            : headings[0].title.match(/^#+/)?.[0]?.length - 1 || 1;

        if (nextDepth > currentLevel) {
          tocItem.items = buildNestedToc(headings, currentLevel + 1, localIndex);
          localIndex += tocItem.items.length;
        }
      }

      toc.push(tocItem);
    } else if (depth < currentLevel) {
      return toc;
    } else {
      headings.shift();
    }
  }

  return toc;
};

const parseProps = (propsString) => {
  if (!propsString) return {};

  const props = {};
  const propRegex = /(\w+)="([^"]+)"/g;

  let match = propRegex.exec(propsString);
  while (match !== null) {
    const [, key, value] = match;
    props[key] = value;
    match = propRegex.exec(propsString);
  }

  return props;
};
const getTableOfContents = (content) => {
  // 1. Remove code blocks so that any headings inside ``` ``` are ignored
  const noCode = content.replace(/```[\s\S]*?```/g, '');

  // 2. Regex to match either Markdown headings (e.g. ## Title) OR self-closing MDX components (<Component />)
  const runner = /^(#+)\s(.*)$|<(\w+)(?:\s+([^>]*))?\/>/gm;

  // 3. Prepare arrays to collect all heading lines, and raw Steps headings for later numbering
  const allHeadings = [];
  const stepsRaw = [];
  let match;

  // 4. Iterate through every match in the content
  while ((match = runner.exec(noCode)) !== null) {
    // 4a. If match[1] is defined, this is a Markdown heading
    if (match[1]) {
      const prefix = match[1]; // the string of '#' characters
      const text = match[2]; // the heading text

      // Add the raw heading (e.g. "## My Heading") to our list
      allHeadings.push(`${prefix} ${text}`);

      // If we're inside a <Steps> block and it's an h2 (##), track it for numbering
      if (
        prefix === '##' &&
        noCode.slice(0, match.index).lastIndexOf('<Steps>') >
          noCode.slice(0, match.index).lastIndexOf('</Steps>')
      ) {
        stepsRaw.push(text);
      }

      continue;
    }

    // 4b. Otherwise, it's an MDX component
    const compName = match[3]; // e.g. "FeatureList"
    const propsStr = match[4] || ''; // raw props string
    const props = parseProps(propsStr);

    // **New step**: if it's <FeatureList />, inject its headings from FEATURES_TOC
    if (compName === 'FeatureList') {
      FEATURES_TOC.forEach(({ title, level }) => {
        const prefix = '#'.repeat(level);
        allHeadings.push(`${prefix} ${title}`);
      });
      continue;
    }

    // For any other component, look up its .md file
    const fileKey = sharedMdxComponents[compName];
    const mdPath = `content/docs/${fileKey}.md`;

    if (fileKey && fs.existsSync(mdPath)) {
      // Read the MD file and replace any {prop} placeholders
      const mdText = fs.readFileSync(mdPath, 'utf8');
      const replaced = Object.entries(props).reduce(
        (acc, [k, v]) => acc.replace(new RegExp(`{${k}}`, 'g'), v),
        mdText
      );

      // Extract headings from that MD content
      let hMatch;
      const hRunner = /^(#+)\s(.*)$/gm;
      while ((hMatch = hRunner.exec(replaced)) !== null) {
        allHeadings.push(`${hMatch[1]} ${hMatch[2]}`);
        if (hMatch[1] === '##') stepsRaw.push(hMatch[2]);
      }
    }
  }

  // 5. Convert the flat list of heading strings into objects with optional step numbering
  let stepCount = 0;
  let stepGroup = 0;
  const arr = allHeadings.map((hdr) => {
    // Strip the leading '#' characters and space
    const text = hdr.replace(/^(#+)\s/, '');
    // Check whether this heading matches the next raw Steps entry
    const inStep = stepsRaw[stepGroup] === text;

    if (inStep) {
      // If it's in the same step group, increment; otherwise start at 1
      stepCount = stepCount ? stepCount + 1 : 1;
      // Once we've added all duplicates of this step, reset counters for the next group
      if (stepCount === stepsRaw.filter((t) => t === text).length) {
        stepCount = 0;
        stepGroup++;
      }
    }

    return {
      title: hdr,
      numberedStep: inStep ? stepCount : null,
    };
  });

  // 6. Build and return the nested TOC tree, starting at heading level 1
  return buildNestedToc(arr, 1);
};

export default getTableOfContents;
