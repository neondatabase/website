import { describe, expect, it } from 'vitest';

import { renderAiGatewayModelIndex } from './model-markdown';

const createRow = ({ id, inputs, isImageCapable }) => ({
  id,
  name: id,
  provider: 'openai',
  inputs,
  inputsLabel: inputs.join(', '),
  contextLabel: '1K',
  releaseLabel: 'Sep 2026',
  reasoning: false,
  costInputLabel: '$1',
  costOutputLabel: '$2',
  endpoints: ['openai/responses'],
  openWeights: false,
  isImageCapable,
  hasMeasuredCapabilities: true,
});

describe('AI Gateway model Markdown index', () => {
  it('uses the same text and image predicates as the interactive catalog', () => {
    const markdown = renderAiGatewayModelIndex([
      createRow({ id: 'text-model', inputs: ['text'], isImageCapable: false }),
      createRow({ id: 'image-only-model', inputs: ['image'], isImageCapable: true }),
      createRow({ id: 'audio-only-model', inputs: ['audio'], isImageCapable: false }),
    ]);
    const [textSection, afterText] = markdown.split('### Image models');
    const [imageSection, otherSection] = afterText.split('### Other models');

    expect(textSection).toContain('text-model');
    expect(textSection).not.toContain('image-only-model');
    expect(textSection).not.toContain('audio-only-model');
    expect(imageSection).toContain('image-only-model');
    expect(imageSection).not.toContain('audio-only-model');
    expect(otherSection).toContain('audio-only-model');
  });

  it('escapes dynamic values without breaking the model table', () => {
    const row = {
      ...createRow({ id: 'model|`next', inputs: ['text'], isImageCapable: false }),
      name: 'Model | [Next]\nLine',
      inputsLabel: 'text \\| image\npdf',
      endpoints: ['openai/responses | beta'],
      hasMeasuredCapabilities: false,
    };

    const markdown = renderAiGatewayModelIndex([row]);

    expect(markdown).toContain(
      '[Model \\| \\[Next\\] Line](https://neon.com/docs/ai-gateway/models/model%7C%60next.md)'
    );
    expect(markdown).toContain('<code>model&#124;&#96;next</code>');
    expect(markdown).toContain('text \\\\\\| image<br>pdf');
    expect(markdown).toContain('openai/responses \\| beta');
    expect(markdown).toContain(
      'Verified code examples are not currently available for: <code>model&#124;&#96;next</code>.'
    );
  });
});
