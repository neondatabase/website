import { compileMDX } from 'next-mdx-remote/rsc';
import { renderToStaticMarkup } from 'react-dom/server';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { describe, expect, it } from 'vitest';

import remarkP5Sketch from './remark-p5-sketch';

const transform = (source) => {
  const processor = unified().use(remarkParse).use(remarkMdx).use(remarkP5Sketch);
  return processor.runSync(processor.parse(source), source);
};

describe('remarkP5Sketch', () => {
  it('replaces a standalone embed with a block component and a plain-text caption', () => {
    const tree = transform(
      'Before.\n\n%[A **balanced** `queue` &amp; workers](/sketches/demo/load-balancing.ts)\n\nAfter.'
    );

    expect(tree.children.map((node) => node.type)).toEqual([
      'paragraph',
      'mdxJsxFlowElement',
      'paragraph',
    ]);
    expect(tree.children[1]).toMatchObject({
      name: 'P5Sketch',
      attributes: [
        { name: 'src', value: '/sketches/demo/load-balancing.ts' },
        { name: 'caption', value: 'A balanced queue & workers' },
      ],
    });
  });

  it.each([
    '[Normal link](/sketches/demo.js)',
    '![Image](/sketches/demo.js)',
    'Inline %[caption](/sketches/demo.js) text.',
    '\\%[Escaped](/sketches/demo.js)',
    '`%[Inline code](/sketches/demo.js)`',
    '```md\n%[Code block](/sketches/demo.js)\n```',
  ])('leaves other Markdown untouched: %s', (source) => {
    const parser = unified().use(remarkParse).use(remarkMdx);
    expect(transform(source)).toEqual(parser.parse(source));
  });

  it.each([
    'https://example.com/demo.js',
    '//example.com/demo.js',
    '/sketches/../utils/secret.js',
    '/sketches/%2e%2e/secret.js',
    '/sketches/demo.js?query=1',
    '/sketches/demo.json',
  ])('rejects unsupported module paths: %s', (src) => {
    expect(() => transform(`%[Caption](${src})`)).toThrow('Use a script in src/sketches');
  });

  it('requires a meaningful caption', () => {
    expect(() => transform('%[ ](/sketches/demo.js)')).toThrow('descriptive caption');
  });

  it('compiles through the blog MDX pipeline without nesting a figure in a paragraph', async () => {
    // eslint-disable-next-line react/prop-types
    const Figure = ({ src, caption }) => (
      <figure data-src={src}>
        <figcaption>{caption}</figcaption>
      </figure>
    );
    const { content } = await compileMDX({
      source: '%[A &quot;quoted&quot; caption](/sketches/demo.js)',
      components: { P5Sketch: Figure },
      options: { mdxOptions: { remarkPlugins: [remarkP5Sketch] } },
    });
    expect(renderToStaticMarkup(content)).toBe(
      '<figure data-src="/sketches/demo.js"><figcaption>A &quot;quoted&quot; caption</figcaption></figure>'
    );
  });
});
