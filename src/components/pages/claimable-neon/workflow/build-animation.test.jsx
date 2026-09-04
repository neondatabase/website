// @vitest-environment node

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('components/shared/rive-animation', () => ({
  default: ({ src, artboard, stateMachines }) => (
    <div
      data-shared-rive-animation
      data-src={src}
      data-artboard={artboard}
      data-state-machines={stateMachines}
    />
  ),
}));

import BuildAnimation from './build-animation';

describe('Claimable Neon build animation', () => {
  it('renders the downloaded Rive animation without an iframe or image', () => {
    const markup = renderToStaticMarkup(<BuildAnimation />);

    expect(markup).toContain('data-build-animation="true"');
    expect(markup).toContain('data-rive-source="/animations/pages/claimable-neon/build.riv"');
    expect(markup).toContain('data-shared-rive-animation="true"');
    expect(markup).toContain('data-artboard="neon-claimable"');
    expect(markup).toContain('data-state-machines="State Machine 1"');
    expect(markup).not.toContain('<iframe');
    expect(markup).not.toContain('<img');
  });
});
