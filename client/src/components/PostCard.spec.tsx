import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PostCard } from './PostCard';
import { describe, it, expect } from 'vitest';

const mockPost = {
    id: '1',
    title: 'Testowy Tytuł',
    slug: 'testowy-tytul',
    content: 'Treść...',
    excerpt: 'Krótki opis posta',
    createdAt: '2025-01-01T12:00:00Z',
    author: { username: 'JanKowalski' },
    category: { name: 'Technologia', slug: 'tech' },
    tags: [{ id: 't1', name: 'React', slug: 'react' }]
};

describe('PostCard Component', () => {
    it('powinien wyświetlić tytuł posta oraz nazwę autora', () => {
        render(
            <MemoryRouter>
                <PostCard post={mockPost as any} />
            </MemoryRouter>
        );

        expect(screen.getByText('Testowy Tytuł')).toBeDefined();
        expect(screen.getByText('JanKowalski')).toBeDefined();
        expect(screen.getByText('Technologia')).toBeDefined();
    });

    it('powinien posiadać link prowadzący do szczegółów posta', () => {
        render(
            <MemoryRouter>
                <PostCard post={mockPost as any} />
            </MemoryRouter>
        );

        const link = screen.getByRole('link', { name: /Testowy Tytuł/i });
        expect(link.getAttribute('href')).toBe('/posts/testowy-tytul');
    });
});
