import { describe, it, expect } from 'vitest';
import { createSlug, formatDate, truncateText } from './utils';

describe('Utils Logic', () => {
    describe('createSlug', () => {
        it('powinien zamienić tekst na URL-friendly slug', () => {
            const input = 'Moja Pierwsza Przygoda z Reactem!';
            const output = 'moja-pierwsza-przygoda-z-reactem';
            expect(createSlug(input)).toBe(output);
        });

        it('powinien usuwać nadmiarowe spacje i znaki specjalne', () => {
            expect(createSlug('  Test $$$ slug   ')).toBe('test-slug');
        });
    });

    describe('formatDate', () => {
        it('powinien sformatować datę ISO na format czytelny dla człowieka', () => {
            const isoDate = '2025-12-03T13:16:09.000Z';
            expect(formatDate(isoDate)).toContain('2025');
            expect(formatDate(isoDate)).toContain('December');
        });
    });

    describe('truncateText', () => {
        it('powinien przyciąć tekst i dodać wielokropek', () => {
            const text = 'Bardzo długi opis posta, który nie zmieści się w karcie';
            expect(truncateText(text, 10)).toBe('Bardzo dłu...');
        });
    });
});
