// Template: component test with Vitest + Testing Library + MSW.
// Save in: src/features/<feature>/components/{{Name}}.test.tsx

import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/test/test-utils';
import { {{Name}} } from '@/features/<feature>/components/{{Name}}';

describe('{{Name}}', () => {
  it('renders initial state', () => {
    // Given / When
    render(<{{Name}} />);

    // Then
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('responds to user interaction', async () => {
    // Given
    const user = userEvent.setup();
    render(<{{Name}} />);

    // When
    await user.click(screen.getByRole('button', { name: /click/i }));

    // Then
    expect(await screen.findByText(/success/i)).toBeInTheDocument();
  });
});
