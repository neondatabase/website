const fs = require('fs');

const slugify = require('slugify');

const sharedMdxComponents = require('../../content/docs/shared-content');

const parseMDXHeading = require('./parse-mdx-heading');

const buildNestedToc = (headings, currentLevel) => {
  const toc = [];

  let numberedStep = 0;

  while (headings.length > 0) {
    const [depth, title, isNumberedStep] = parseMDXHeading(headings[0]);
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

      headings.shift(); // remove the current heading

      if (headings.length > 0 && parseMDXHeading(headings[0])[0] > currentLevel) {
        tocItem.items = buildNestedToc(headings, currentLevel + 1);
      }

      toc.push(tocItem);
    } else if (depth < currentLevel) {
      // Return toc if heading is of shallower level
      return toc;
    } else {
      // Skip headings of deeper levels
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
  const stepRegex = /<NumberedStep[^>]*title="([^"]+)"[^>]*(?:tag="h(\d)")?[^>]*>/g;

  const contentWithoutCodeBlocks = content.replace(codeBlockRegex, '');
  const defaultHeadings = contentWithoutCodeBlocks.match(headingRegex) || [];
  const customHeadings = contentWithoutCodeBlocks.match(stepRegex) || [];
  console.log(customHeadings);

  const headings = [...defaultHeadings, ...customHeadings];

  const arr = headings.map((item) => item.replace(/(#+)\s/, '$1 '));

  return buildNestedToc(arr, 1);
};

export default getTableOfContents;
