import { describe, expect, it } from 'vitest';

import { findSectionHeading, hitSections } from './site-search-section';

describe('hitSections', () => {
  it('drops the page title', () => {
    expect(hitSections('Glossary > LSN')).toEqual(['LSN']);
    expect(hitSections('Glossary')).toEqual([]);
    expect(hitSections('')).toEqual([]);
  });
});

describe('findSectionHeading', () => {
  it('finds the heading with the matched text', () => {
    const headings = [
      { level: 2, text: 'access token' },
      { level: 2, text: 'LSN' },
      { level: 2, text: 'LRU policy' },
    ];
    expect(findSectionHeading(['LSN'], headings)).toBe(1);
  });

  it('tells repeated headings apart by their parents', () => {
    const headings = [
      { level: 2, text: 'Next.js migration' },
      { level: 3, text: 'Install packages' },
      { level: 2, text: 'React SPA migration' },
      { level: 3, text: 'Install packages' },
    ];
    expect(findSectionHeading(['React SPA migration', 'Install packages'], headings)).toBe(3);
    expect(findSectionHeading(['Next.js migration', 'Install packages'], headings)).toBe(1);
  });

  it('takes the first match when parents do not decide', () => {
    const headings = [
      { level: 2, text: 'Example' },
      { level: 2, text: 'Example' },
    ];
    expect(findSectionHeading(['Example'], headings)).toBe(0);
  });

  it('ignores whitespace differences and requires the last section to match', () => {
    const headings = [
      { level: 2, text: 'Next.js migration' },
      { level: 3, text: '  auth.middleware()\n' },
    ];
    expect(findSectionHeading(['auth.middleware()'], headings)).toBe(1);
    expect(findSectionHeading(['Next.js migration', 'Missing'], headings)).toBe(-1);
    expect(findSectionHeading([], headings)).toBe(-1);
  });
});
