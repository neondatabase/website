const fs = require('fs');

const slugify = require('slugify');

const sharedMdxComponents = require('../../content/docs/shared-content');

const parseMDXHeading = require('./parse-mdx-heading');

const countAllItems = (items) =>
  items.reduce((sum, item) => sum + 1 + (item.items ? countAllItems(item.items) : 0), 0);

const extractCustomId = (text) => {
  const match = text.match(/\(#([^)]+)\)$/);
  if (match) {
    return match[1];
  }
  return null;
};

const buildNestedToc = (headings, currentLevel, currentIndex = 0) => {
  const toc = [];
  let numberedStep = 0;
  let localIndex = currentIndex;
  let currentStepsIndex = -1;

  while (headings.length > 0) {
    const currentHeading = headings[0];

    const { isNumbered, stepsIndex, tabLabel, tabGroupLabels } = currentHeading;
    const depthMatch = currentHeading.title.match(/^#+/);
    const depth = (depthMatch ? depthMatch[0].length : 1) - 1;
    const title = currentHeading.title.replace(/(#+)\s/, '');
    const customId = extractCustomId(title);
    const cleanedTitle = title.replace(/\(#[^)]+\)$/, '');
    const titleWithInlineCode = cleanedTitle.replace(/`([^`]+)`/g, '<code>$1</code>');

    if (depth === currentLevel) {
      if (isNumbered && stepsIndex !== currentStepsIndex) {
        numberedStep = 0;
        currentStepsIndex = stepsIndex;
      }

      const tocItem = {
        title: titleWithInlineCode,
        id:
          customId ||
          slugify(cleanedTitle, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g }),
        level: depth,
        numberedStep: isNumbered ? numberedStep + 1 : null,
        index: localIndex,
      };

      if (tabLabel) {
        tocItem.tabLabel = tabLabel;
        tocItem.tabGroupLabels = tabGroupLabels;
      }

      localIndex += 1;

      if (isNumbered) {
        numberedStep += 1;
      }

      headings.shift();

      if (headings.length > 0) {
        const nextDepth =
          typeof headings[0] === 'string'
            ? parseMDXHeading(headings[0])[0]
            : headings[0].title.match(/^#+/)?.[0]?.length - 1 || 1;

        if (nextDepth > currentLevel) {
          tocItem.items = buildNestedToc(headings, currentLevel + 1, localIndex);
          localIndex += countAllItems(tocItem.items);
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
  let match;

  while ((match = propRegex.exec(propsString)) !== null) {
    const [, key, value] = match;
    props[key] = value;
  }

  return props;
};

const getTableOfContents = (content) => {
  const mdxComponentRegex = /<(\w+)(?:\s+([^>]*))?\/>/g;
  let match;
  // check if the content has any mdx shared components
  while ((match = mdxComponentRegex.exec(content)) !== null) {
    const componentName = match[1];
    const propsString = match[2] || '';
    const props = parseProps(propsString);

    const fileName = sharedMdxComponents[componentName];
    const mdFilePath = `content/docs/${fileName}.md`;

    // Check if the MD file exists
    if (fs.existsSync(mdFilePath)) {
      const mdContent = fs.readFileSync(mdFilePath, 'utf8');
      // Replace any {propName} placeholders with their values
      const processedContent = Object.entries(props).reduce(
        (content, [key, value]) => content.replace(new RegExp(`{${key}}`, 'g'), value),
        mdContent
      );
      content = content.replace(
        new RegExp(`<${componentName}\\s*${propsString}\\/>`, 'g'),
        processedContent
      );
    }
  }

  // Split content into ordered segments (non-tab content and individual
  // TabItem content) so that headings are extracted per-segment.  This
  // avoids false matches when the same heading text appears in multiple tabs.
  //
  // Depth-aware matching: handles nested <Tabs>/<TabItem> (e.g. driver-
  // selection tabs inside a guide's manual tab) by tracking open/close depth.
  const findMatchingClose = (text, searchFrom, openPattern, closePattern) => {
    let depth = 1;
    const combined = new RegExp(`(${openPattern})|(${closePattern})`, 'g');
    combined.lastIndex = searchFrom;
    let m;
    while ((m = combined.exec(text)) !== null) {
      if (m[1]) depth++;
      else if (m[2]) depth--;
      if (depth === 0) return { start: m.index, end: m.index + m[0].length };
    }
    return null;
  };

  const tabsBlocks = [];
  const tabsOpenRegex = /<Tabs[^>]*labels=\{(\[.*?\])\}[^>]*>/g;
  let tabsMatch;
  while ((tabsMatch = tabsOpenRegex.exec(content)) !== null) {
    const afterOpen = tabsMatch.index + tabsMatch[0].length;
    const closeInfo = findMatchingClose(content, afterOpen, '<Tabs[^>]*>', '<\\/Tabs>');
    if (closeInfo) {
      tabsBlocks.push({
        index: tabsMatch.index,
        fullEnd: closeInfo.end,
        labels: tabsMatch[1],
        innerContent: content.substring(afterOpen, closeInfo.start),
      });
      tabsOpenRegex.lastIndex = closeInfo.end;
    }
  }

  const segments = [];
  let lastEnd = 0;

  for (const block of tabsBlocks) {
    if (block.index > lastEnd) {
      segments.push({
        content: content.substring(lastEnd, block.index),
        tabLabel: null,
        tabGroupLabels: null,
      });
    }

    let labels;
    try {
      labels = JSON.parse(block.labels);
    } catch {
      lastEnd = block.fullEnd;
      continue;
    }

    const tabItems = [];
    const tiOpenRegex = /<TabItem>/g;
    let tiMatch;
    while ((tiMatch = tiOpenRegex.exec(block.innerContent)) !== null) {
      const afterTiOpen = tiMatch.index + tiMatch[0].length;
      const tiClose = findMatchingClose(
        block.innerContent,
        afterTiOpen,
        '<TabItem[^>]*>',
        '<\\/TabItem>'
      );
      if (tiClose) {
        tabItems.push(block.innerContent.substring(afterTiOpen, tiClose.start));
        tiOpenRegex.lastIndex = tiClose.end;
      }
    }

    tabItems.forEach((tiContent, idx) => {
      segments.push({
        content: tiContent,
        tabLabel: labels[idx] || `Tab ${idx + 1}`,
        tabGroupLabels: labels,
      });
    });

    lastEnd = block.fullEnd;
  }

  if (lastEnd < content.length) {
    segments.push({ content: content.substring(lastEnd), tabLabel: null, tabGroupLabels: null });
  }

  const codeBlockRegex = /```[\s\S]*?```/g;
  const headingRegex = /^(#+)\s(.*)$/gm;
  const stepsRegex = /<Steps>([\s\S]*?)<\/Steps>/g;

  const arr = [];
  let stepsCounter = 0;

  for (const segment of segments) {
    const stripped = segment.content.replace(codeBlockRegex, '');
    const headings = stripped.match(headingRegex) || [];
    const segmentSteps = [...segment.content.matchAll(stepsRegex)];
    const stepsBase = stepsCounter;
    stepsCounter += segmentSteps.length;

    for (const heading of headings) {
      let stepsIndex = -1;
      const isInSteps = segmentSteps.some((match, localIdx) => {
        if (match[0].includes(heading) && /^##\s/.test(heading)) {
          stepsIndex = stepsBase + localIdx;
          return true;
        }
        return false;
      });

      arr.push({
        title: heading,
        isNumbered: isInSteps,
        stepsIndex: isInSteps ? stepsIndex : -1,
        tabLabel: segment.tabLabel,
        tabGroupLabels: segment.tabGroupLabels,
      });
    }
  }

  return buildNestedToc(arr, 1);
};

export default getTableOfContents;
