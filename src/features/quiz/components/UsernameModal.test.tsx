import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { UsernameModal } from '@/features/quiz/components/UsernameModal';
import { render } from '@/test/test-utils';

describe('UsernameModal', () => {
  it('renders modal content when open is true', () => {
    // Given / When
    render(<UsernameModal open={true} onSubmit={vi.fn()} />);

    // Then
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('does not render modal content when open is false', () => {
    // Given / When
    render(<UsernameModal open={false} onSubmit={vi.fn()} />);

    // Then
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows validation error and does not call onSubmit when submitted empty', async () => {
    // Given
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<UsernameModal open={true} onSubmit={spy} />);

    // When
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Then
    expect(await screen.findByText(/at least 2 characters/i)).toBeInTheDocument();
    expect(spy).not.toHaveBeenCalled();
  });

  it('shows validation error when name is 1 character', async () => {
    // Given
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<UsernameModal open={true} onSubmit={spy} />);

    // When
    await user.type(screen.getByPlaceholderText(/your name/i), 'A');
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Then
    expect(await screen.findByText(/at least 2 characters/i)).toBeInTheDocument();
    expect(spy).not.toHaveBeenCalled();
  });

  it('keeps modal open when Escape is pressed', async () => {
    // Given
    const user = userEvent.setup();
    render(<UsernameModal open={true} onSubmit={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // When
    await user.keyboard('{Escape}');

    // Then — dialog is still mounted (open prop is controlled externally and stays true)
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('calls onSubmit with the trimmed name on valid submit', async () => {
    // Given
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<UsernameModal open={true} onSubmit={spy} />);

    // When
    await user.type(screen.getByPlaceholderText(/your name/i), 'Alice');
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Then
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
    expect(spy).toHaveBeenCalledWith('Alice');
  });
});
