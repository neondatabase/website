import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getExperimentVariant, trackExperimentSuccess, trackExperimentViewed } from './experiments';

const sendGtagEvent = vi.fn();
vi.mock('utils/send-gtag-event', () => ({ default: (...args) => sendGtagEvent(...args) }));

const VARIANTS = ['control', 'a', 'b'];

describe('experiments', () => {
  beforeEach(() => {
    window.localStorage.clear();
    sendGtagEvent.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('assigns a random variant once and keeps it on later calls', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(getExperimentVariant('test-exp', VARIANTS)).toBe('a');

    // A different random draw must not change an existing assignment.
    Math.random.mockReturnValue(0.99);
    expect(getExperimentVariant('test-exp', VARIANTS)).toBe('a');
    expect(JSON.parse(window.localStorage.getItem('experimentAssignments'))).toEqual({
      'test-exp': 'a',
    });
  });

  it('assigns each experiment independently', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.99);

    expect(getExperimentVariant('exp-one', VARIANTS)).toBe('control');
    expect(getExperimentVariant('exp-two', VARIANTS)).toBe('b');
    expect(getExperimentVariant('exp-one', VARIANTS)).toBe('control');
  });

  it('reassigns when the stored variant was removed from the experiment', () => {
    window.localStorage.setItem('experimentAssignments', JSON.stringify({ 'test-exp': 'gone' }));
    vi.spyOn(Math, 'random').mockReturnValue(0);

    expect(getExperimentVariant('test-exp', VARIANTS)).toBe('control');
  });

  it('sends the viewed and success events with the experiment and variant', () => {
    trackExperimentViewed('test-exp', 'a');
    trackExperimentSuccess('test-exp', 'a', { method: 'button' });

    expect(sendGtagEvent).toHaveBeenCalledWith('Experiment Viewed', {
      experiment_id: 'test-exp',
      variant_id: 'a',
    });
    expect(sendGtagEvent).toHaveBeenCalledWith('Experiment Success', {
      experiment_id: 'test-exp',
      variant_id: 'a',
      method: 'button',
    });
  });
});
