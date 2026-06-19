import { describe, expect, it } from 'vitest';
import { normalizeForSearch } from '@/shared/lib/normalize';

describe('normalizeForSearch', () => {
  it('removes accents', () => {
    expect(normalizeForSearch('Reunião')).toBe('reuniao');
    expect(normalizeForSearch('café')).toBe('cafe');
    expect(normalizeForSearch('São Paulo')).toBe('sao paulo');
  });

  it('is case-insensitive', () => {
    expect(normalizeForSearch('FOO')).toBe('foo');
    expect(normalizeForSearch('FoO')).toBe('foo');
  });

  it('trims leading and trailing whitespace', () => {
    expect(normalizeForSearch('  hello  ')).toBe('hello');
  });

  it('handles empty string', () => {
    expect(normalizeForSearch('')).toBe('');
    expect(normalizeForSearch('   ')).toBe('');
  });

  it('preserves internal spaces', () => {
    expect(normalizeForSearch('hello world')).toBe('hello world');
  });

  it('handles combined unicode (decomposed)', () => {
    // 'á' as a combined character: 'a' + U+0301 (combining acute accent)
    const combined = `a${String.fromCharCode(0x0301)}`;
    expect(normalizeForSearch(combined)).toBe('a');
  });
});
