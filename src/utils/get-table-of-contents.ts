import fs from 'fs';
import slugify from 'slugify';
import sharedMdxComponents from '../../content/docs/shared-content';
import parseMDXHeading from './parse-mdx-heading';

interface Heading {
  title: string;
  isNumbered: boolean;
  stepsIndex: number;
}

interface TocItem {
  title: string;
  id: string;
  level: number;
  numberedStep: number | null;
  index: number;
  items?: TocItem[];
}

const buildNestedToc = (headings: Heading[], currentLevel: number, currentIndex = 0): TocItem[] => {
  const toc: TocItem[] = [];
  let numberedStep = 0;
  let localIndex = currentIndex;
  let currentStepsIndex = -1;

  while (headings.length > 0) {
    const currentHeading = headings[0];

    // Handle object format
    const { isNumbered, stepsIndex } = currentHeading;
    const depthMatch = currentHeading.title.match(/^#+/);
    const depth = (depthMatch ? depthMatch[0].length : 1) - 1;
    const title = currentHeading.title.replace(/(#+)\s/, '');

    const titleWithInlineCode = title.replace(/`([^`]+)`/g, '<code>$1</code>');

    if (depth === currentLevel) {
      if (isNumbered && stepsIndex !== currentStepsIndex) {
        numberedStep = 0;
        currentStepsIndex = stepsIndex;
      }

      const tocItem: TocItem = {
        title: titleWithInlineCode,
        id: slugify(title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g }),
        level: depth,
        numberedStep: isNumbered ? numberedStep + 1 : null,
        index: localIndex,
      };

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

const getTableOfContents = (content: string): TocItem[] => {
  const mdxComponentRegex = /<(\w+)\/>/g;
  let match;
  // check if the content has any mdx shared components
  while ((match = mdxComponentRegex.exec(content)) !== null) {
    const componentName = match[1];

    const fileName = sharedMdxComponents[componentName];
    const mdFilePath = `content/docs/${fileName}.md`;

    // Check if the MD file exists
    if (fs.existsSync(mdFilePath)) {
      const mdContent = fs.readFileSync(mdFilePath, 'utf8');
      content = content.replace(new RegExp(`<${componentName}\/>`, 'g'), mdContent);
    }
  }

  const codeBlockRegex = /```[\s\S]*?```/g;
  const headingRegex = /^(#+)\s(.*)$/gm;
  const contentWithoutCodeBlocks = content.replace(codeBlockRegex, '');

  // Get all headings first
  const allHeadings = contentWithoutCodeBlocks.match(headingRegex) || [];

  // Find steps sections
  const stepsRegex = /<Steps>([\s\S]*?)<\/Steps>/g;
  const stepsMatches = [...content.matchAll(stepsRegex)];

  // Convert headings to objects while preserving order
  const arr: Heading[] = allHeadings.map((heading) => {
    // Check if this heading is inside any Steps section and is h2
    let stepsIndex = -1;
    const isInSteps = stepsMatches.some((match, index) => {
      const stepsContent = match[0];
      if (stepsContent.includes(heading) && /^##\s(.*)$/gm.test(heading)) {
        stepsIndex = index;
        return true;
      }
      return false;
    });

    return {
      title: heading,
      isNumbered: isInSteps,
      stepsIndex: isInSteps ? stepsIndex : -1,
    };
  });

  return buildNestedToc(arr, 1);
};

export default getTableOfContents;
