import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { TodoForm } from '@/features/todos/components/TodoForm';
import { render } from '@/test/test-utils';

describe('TodoForm', () => {
  it('shows error when title is empty', async () => {
    // Given
    const user = userEvent.setup();
    render(<TodoForm />);

    // When
    await user.click(screen.getByRole('button', { name: /add/i }));

    // Then
    expect(await screen.findByText(/required/i)).toBeInTheDocument();
  });

  it('creates todo via mocked API and clears the input', async () => {
    // Given
    const user = userEvent.setup();
    render(<TodoForm />);
    const input = screen.getByPlaceholderText(/needs to be done/i);

    // When
    await user.type(input, 'Study Spec Kit');
    await user.click(screen.getByRole('button', { name: /add/i }));

    // Then
    await waitFor(() => expect(input).toHaveValue(''));
  });
});
