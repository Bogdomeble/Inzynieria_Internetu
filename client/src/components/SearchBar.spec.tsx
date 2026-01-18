import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from './SearchBar';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

describe('SearchBar Component', () => {
    it('powinien aktualizować wartość inputa przy pisaniu', () => {
        render(
            <MemoryRouter>
                <SearchBar />
            </MemoryRouter>
        );

        const input = screen.getByPlaceholderText(/Search for articles/i) as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'React Query' } });

        expect(input.value).toBe('React Query');
    });

    it('powinien wyczyścić input po kliknięciu przycisku X', () => {
        render(
            <MemoryRouter>
                <SearchBar />
            </MemoryRouter>
        );

        const input = screen.getByPlaceholderText(/Search for articles/i) as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'Do usunięcia' } });

        const clearButton = screen.getByRole('button');
        fireEvent.click(clearButton);

        expect(input.value).toBe('');
    });
});
