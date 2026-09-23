import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { StrictMode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  mockAllIsIntersecting,
  resetIntersectionMocking,
  setupIntersectionMocking,
} from 'react-intersection-observer/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import loadSketch from 'lib/load-sketch';

import P5Sketch from './p5-sketch';

const { runtimeLoaded, canvasRendered } = vi.hoisted(() => ({
  runtimeLoaded: vi.fn(),
  canvasRendered: vi.fn(),
}));

vi.mock('lib/load-sketch', () => ({ default: vi.fn() }));
vi.mock('p5', () => {
  runtimeLoaded();
  return {
    default: class {
      constructor(sketch, container) {
        canvasRendered(sketch);
        this.canvas = document.createElement('canvas');
        this.canvas.dataset.testid = 'sketch-canvas';
        container.appendChild(this.canvas);
      }

      remove() {
        this.canvas.remove();
      }
    },
  };
});

describe('P5Sketch', () => {
  beforeEach(() => {
    // The observer helper uses an arrow constructor; Vitest 4 requires a constructable mock.
    setupIntersectionMocking((implementation) =>
      vi.fn(function (...args) {
        return implementation?.(...args);
      })
    );
    loadSketch.mockResolvedValue(() => {});
    canvasRendered.mockClear();
  });

  afterEach(() => {
    cleanup();
    resetIntersectionMocking();
    vi.restoreAllMocks();
    loadSketch.mockReset();
  });

  it('does not import p5 or the sketch during SSR or before intersection', async () => {
    const embed = <P5Sketch src="/sketches/demo.js" caption="Requests reach three servers." />;
    expect(renderToStaticMarkup(embed)).toContain('<figcaption>Requests reach three servers.');
    const { container, unmount } = render(<StrictMode>{embed}</StrictMode>);
    expect(loadSketch).not.toHaveBeenCalled();
    expect(runtimeLoaded).not.toHaveBeenCalled();

    mockAllIsIntersecting(true);
    await screen.findByTestId('sketch-canvas');

    expect(loadSketch).toHaveBeenCalledWith('/sketches/demo.js');
    expect(runtimeLoaded).toHaveBeenCalledOnce();
    expect(canvasRendered).toHaveBeenCalledOnce();
    expect(container.querySelector('canvas').closest('[aria-hidden="true"]')).not.toBeNull();
    expect(screen.getByText('Requests reach three servers.').closest('[aria-hidden]')).toBeNull();
    const canvas = container.querySelector('canvas');
    unmount();
    expect(canvas.parentNode).toBeNull();
  });

  it('keeps the caption when a module fails to load', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    loadSketch.mockRejectedValue(new Error('Missing module'));
    render(<P5Sketch src="/sketches/missing.js" caption="A helpful description." />);
    mockAllIsIntersecting(true);

    await screen.findByText('This sketch couldn’t be loaded.');
    expect(screen.getByText('A helpful description.')).toBeVisible();
  });

  it('ignores a stale module resolution when the source changes', async () => {
    let resolveFirst;
    const firstSketch = () => {};
    const secondSketch = () => {};
    loadSketch
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveFirst = resolve;
          })
      )
      .mockResolvedValueOnce(secondSketch);
    const { rerender } = render(<P5Sketch src="/sketches/first.js" caption="First." />);
    mockAllIsIntersecting(true);
    await waitFor(() => expect(loadSketch).toHaveBeenCalledOnce());

    rerender(<P5Sketch src="/sketches/second.js" caption="Second." />);
    await screen.findByTestId('sketch-canvas');
    await act(async () => resolveFirst(firstSketch));

    expect(canvasRendered.mock.lastCall[0]).toBe(secondSketch);
    expect(screen.getByText('Second.')).toBeVisible();
  });

  it('does not mount a canvas after unmounting while imports are pending', async () => {
    let resolveSketch;
    loadSketch.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSketch = resolve;
        })
    );
    const { unmount } = render(<P5Sketch src="/sketches/demo.js" caption="Caption." />);
    mockAllIsIntersecting(true);
    await waitFor(() => expect(loadSketch).toHaveBeenCalledOnce());
    unmount();
    await act(async () => resolveSketch(() => {}));
    expect(canvasRendered).not.toHaveBeenCalled();
  });

  it('removes the previous canvas when changing sketches', async () => {
    const { rerender } = render(<P5Sketch src="/sketches/first.js" caption="First." />);
    mockAllIsIntersecting(true);
    const firstCanvas = await screen.findByTestId('sketch-canvas');

    rerender(<P5Sketch src="/sketches/second.js" caption="Second." />);
    const secondCanvas = await screen.findByTestId('sketch-canvas');

    expect(firstCanvas.parentNode).toBeNull();
    expect(secondCanvas).not.toBe(firstCanvas);
    expect(screen.getAllByTestId('sketch-canvas')).toHaveLength(1);
  });
});
