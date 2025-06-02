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

const getTableOfContents = (content) => {
  const mdxComponentRegex = /<(\w+)\/>/g;
  let match;
  let newContent = content;
  // check if the content has any mdx shared components
  while ((match = mdxComponentRegex.exec(content)) !== null) {
    const componentName = match[1];

    const fileName = sharedMdxComponents[componentName];
    const mdFilePath = `content/docs/${fileName}.md`;

    // Check if the MD file exists
    if (fs.existsSync(mdFilePath)) {
      const mdContent = fs.readFileSync(mdFilePath, 'utf8');
      newContent = newContent.replace(new RegExp(`<${componentName}\/>`, 'g'), mdContent);
    }
  }

  const codeBlockRegex = /```[\s\S]*?```/g;
  const headingRegex = /^(#+)\s(.*)$/gm;
  const contentWithoutCodeBlocks = newContent.replace(codeBlockRegex, '');

  // Get all headings first
  const allHeadings = contentWithoutCodeBlocks.match(headingRegex) || [];

  // Find steps sections and headings
  const stepsRegex = /<Steps>([\s\S]*?)<\/Steps>/g;
  const stepsMatches = [...content.matchAll(stepsRegex)];
  const stepsHeadings = stepsMatches.map((match) => {
    const stepsContent = match[0];
    const stepsHeading = stepsContent.match(/^##\s(.*)$/gm);
    return stepsHeading;
  });

  let stepsIndex = 0;
  let numberedStep = 0;

  // Convert headings to objects while preserving order
  const arr = allHeadings.map((heading) => {
    // Check if this heading is inside any Steps section and is h2
    const isInSteps = stepsHeadings.some((matchArray, index) => {
      const headingIndex = matchArray ? matchArray.indexOf(heading) : -1;
      if (headingIndex !== -1) {
        // Remove only this specific heading from the array
        matchArray.splice(headingIndex, 1);

        if (stepsIndex === index) {
          numberedStep += 1;
        } else {
          stepsIndex = index;
          numberedStep = 1;
        }
        return true;
      }
      return false;
    });

    return {
      title: heading,
      numberedStep: isInSteps ? numberedStep : null,
    };
  });

  return buildNestedToc(arr, 1);
};

export default getTableOfContents;
