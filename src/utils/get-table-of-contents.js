const fs = require('fs');

const slugify = require('slugify');

const sharedMdxComponents = require('../../content/docs/shared-content');

const parseMDXHeading = require('./parse-mdx-heading');

const buildNestedToc = (headings, currentLevel) => {
  const toc = [];
  let numberedStep = 0;

  while (headings.length > 0) {
    const currentHeading = headings[0];
    let depth;
    let title;
    let isNumberedStep;

    if (typeof currentHeading === 'string') {
      [depth, title] = parseMDXHeading(currentHeading);
      isNumberedStep = false;
    } else {
      // Handle object format
      depth = currentHeading.title.match(/^#+/)?.[0]?.length - 1 || 1;
      title = currentHeading.title;
      isNumberedStep = currentHeading.isNumbered;
    }

    const titleWithInlineCode = title.replace(/`([^`]+)`/g, '<code>$1</code>');

    if (depth === currentLevel) {
      const tocItem = {
        title: titleWithInlineCode,
        id: slugify(title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g }),
        level: depth,
        numberedStep: isNumberedStep ? numberedStep + 1 : null,
      };

      if (isNumberedStep) {
        numberedStep += 1;
      }

      headings.shift();

      if (headings.length > 0) {
        const nextDepth =
          typeof headings[0] === 'string'
            ? parseMDXHeading(headings[0])[0]
            : headings[0].title.match(/^#+/)?.[0]?.length - 1 || 1;

        if (nextDepth > currentLevel) {
          tocItem.items = buildNestedToc(headings, currentLevel + 1);
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

  const stepsRegex = /<Steps>([\s\S]*?)<\/Steps>/g;
  const steps = content.match(stepsRegex);
  let stepHeadings = [];

  if (steps) {
    stepHeadings = steps
      .flatMap((step) => step.match(headingRegex))
      .filter(Boolean)
      .map((heading) => ({
        title: heading.replace(/(#+)\s/, ''),
        isNumbered: true,
      }));
  }

  const contentWithoutCodeBlocks = content.replace(codeBlockRegex, '');
  const headings = contentWithoutCodeBlocks.match(headingRegex) || [];
  const regularHeadings = headings
    .filter((heading) => !stepHeadings.some((step) => step.title === heading.replace(/(#+)\s/, '')))
    .map((item) => ({
      title: item.replace(/(#+)\s/, ''),
      isNumbered: false,
    }));

  const arr = regularHeadings.concat(stepHeadings);

  return buildNestedToc(arr, 1);
};

export default getTableOfContents;
