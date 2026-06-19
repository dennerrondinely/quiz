import { beforeEach, describe, expect, it } from 'vitest';
import { z } from 'zod';
import { useUserStore } from '@/features/quiz/user-store';

const storedUsernameSchema = z.string().trim().min(2).max(30).nullable().catch(null);

beforeEach(() => {
  useUserStore.setState({ username: null });
  localStorage.clear();
});

describe('setUsername', () => {
  it('updates username in the store', () => {
    // When
    useUserStore.getState().setUsername('Alice');

    // Then
    expect(useUserStore.getState().username).toBe('Alice');
  });

  it('overwrites a previously set name', () => {
    // Given
    useUserStore.getState().setUsername('Alice');

    // When
    useUserStore.getState().setUsername('Bob');

    // Then
    expect(useUserStore.getState().username).toBe('Bob');
  });
});

describe('storedUsernameSchema', () => {
  it('accepts a valid name', () => {
    expect(storedUsernameSchema.parse('Alice')).toBe('Alice');
  });

  it('accepts a name at the minimum boundary (2 chars)', () => {
    expect(storedUsernameSchema.parse('Al')).toBe('Al');
  });

  it('accepts a name at the maximum boundary (30 chars)', () => {
    const name = 'a'.repeat(30);
    expect(storedUsernameSchema.parse(name)).toBe(name);
  });

  it('returns null for a name that is too short (1 char)', () => {
    expect(storedUsernameSchema.parse('x')).toBeNull();
  });

  it('returns null for a name that is too long (31 chars)', () => {
    expect(storedUsernameSchema.parse('a'.repeat(31))).toBeNull();
  });

  it('returns null when parsing null', () => {
    expect(storedUsernameSchema.parse(null)).toBeNull();
  });

  it('returns null for a non-string value', () => {
    expect(storedUsernameSchema.parse(42)).toBeNull();
  });
});

describe('rehydration', () => {
  it('restores a valid username from localStorage', async () => {
    // Given
    localStorage.setItem(
      'quiz-username',
      JSON.stringify({ state: { username: 'Alice' }, version: 0 }),
    );

    // When
    await useUserStore.persist.rehydrate();

    // Then
    expect(useUserStore.getState().username).toBe('Alice');
  });

  it('resets to null when localStorage contains a too-short name', async () => {
    // Given
    localStorage.setItem('quiz-username', JSON.stringify({ state: { username: 'x' }, version: 0 }));

    // When
    await useUserStore.persist.rehydrate();

    // Then
    expect(useUserStore.getState().username).toBeNull();
  });

  it('resets to null when localStorage contains a too-long name', async () => {
    // Given
    localStorage.setItem(
      'quiz-username',
      JSON.stringify({ state: { username: 'a'.repeat(31) }, version: 0 }),
    );

    // When
    await useUserStore.persist.rehydrate();

    // Then
    expect(useUserStore.getState().username).toBeNull();
  });
});
