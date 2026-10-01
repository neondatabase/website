import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';

import { isSketchPath } from './sketch-path';

// A sketch occupies a whole paragraph: %[Caption](/sketches/example.js).
// Work on the parsed tree so code examples, images, and regular links are untouched.
const remarkP5Sketch = () => (tree, file) => {
  visit(tree, 'paragraph', (node, index, parent) => {
    const [marker, link] = node.children;

    if (
      node.children.length !== 2 ||
      marker.type !== 'text' ||
      marker.value !== '%' ||
      link.type !== 'link'
    ) {
      return;
    }

    // An escaped percent sign is literal Markdown, not an embed.
    const offset = marker.position?.start.offset;
    if (offset !== undefined && !String(file.value).slice(offset).startsWith('%[')) {
      return;
    }

    const caption = toString(link).trim();
    if (!caption) {
      file.fail('A p5 sketch needs a descriptive caption.', node);
    }
    if (!isSketchPath(link.url)) {
      file.fail('Use a script in src/sketches, such as /sketches/example.js.', node);
    }

    parent.children[index] = {
      type: 'mdxJsxFlowElement',
      name: 'P5Sketch',
      attributes: [
        { type: 'mdxJsxAttribute', name: 'src', value: link.url },
        { type: 'mdxJsxAttribute', name: 'caption', value: caption },
      ],
      children: [],
      position: node.position,
    };
  });
};

export default remarkP5Sketch;
