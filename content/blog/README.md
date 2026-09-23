# Blog sketches

Put a p5 sketch in `src/sketches/` and embed it in a blog post with a standalone Markdown paragraph:

```md
%[Requests are distributed across three servers.](/sketches/load-balancing.js)
```

The `/sketches/` prefix maps to `src/sketches/`. Include the `.js` or `.ts` extension. Subdirectories are supported, for example `/sketches/my-post/demo.js`. These are bundled source modules, not files in `public/` or remote URLs. New or changed sketch modules require a website deployment; the blog's branch preview only loads Markdown from the selected branch.

Each module must default-export a function using the shared `Sketch` type from `src/types/sketch.d.ts`. Sketches use p5 1.x in instance mode. In JavaScript, use a JSDoc type so the import is erased at runtime:

```js
/** @type {import('types/sketch').Sketch} */
const sketch = (p5) => {
  p5.setup = () => {
    p5.createCanvas(640, 320);
    p5.noLoop();
  };

  p5.draw = () => {
    p5.background('#0c0d0d');
    p5.fill('#00e599');
    p5.circle(320, 160, 100);
  };
};

export default sketch;
```

In TypeScript, use `import type { Sketch } from 'types/sketch'` and declare `const sketch: Sketch = (p5) => { ... }`.

The embed centers the canvas and scales it down to fit the article. Both p5 and the sketch load asynchronously when the figure is within 200 pixels of the viewport. The wrapper removes the p5 instance when the embed unmounts.

The canvas is hidden from screen readers; the visible caption remains accessible. Write a caption that explains the diagram, and describe any essential information in the surrounding post. Keep sketches visual only: don't add focusable controls or essential interactions inside the hidden canvas container. For animation, respect `prefers-reduced-motion` as shown in `src/sketches/load-balancing.js`.

Keep the embed on its own paragraph, separated from other text by blank lines. Ordinary links, images, fenced code, and inline code keep their usual Markdown behavior. Escape the percent sign (`\%[caption](path)`) to show a literal percent sign followed by a link.
