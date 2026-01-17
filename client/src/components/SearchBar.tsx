import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debounce } from '../lib/utils';

export function SearchBar() {
    const [searchParams, setSearchParams] = useSearchParams();

    const initialSearch = searchParams.get('search') || '';
    const [inputValue, setInputValue] = useState(initialSearch);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        const paramsSearch = searchParams.get('search') || '';
        if (paramsSearch !== inputValue) {
            setInputValue(paramsSearch);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const debouncedUpdateUrl = useMemo(
        () =>
            debounce((newTerm: string) => {
                setSearchParams((prev) => {
                    const params = new URLSearchParams(prev);
                    if (newTerm) {
                        params.set('search', newTerm);
                    } else {
                        params.delete('search');
                    }
                    return params;
                }, { replace: true });
            }, 500),
        [setSearchParams]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value;
        setInputValue(newVal);
        debouncedUpdateUrl(newVal);
    };

    const handleClear = () => {
        setInputValue('');
        debouncedUpdateUrl('');
    };

    return (
        <div className="mb-10 w-full max-w-3xl mx-auto">
            <div
                className={`relative group transition-all duration-300 ${isFocused ? 'scale-[1.02]' : 'scale-100'}`}
            >
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Search for articles, topics, or ideas..."
                    className="w-full rounded-full border border-secondary/50 bg-secondary/20 px-8 py-5 pl-14 text-lg text-text placeholder-text-muted
          focus:border-accent focus:bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-300 shadow-2xl"
                />

                {/* Ikona lupki - też powiększona */}
                <svg
                    className={`absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 transition-colors ${isFocused ? 'text-accent' : 'text-text-muted'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>

                {/* Przycisk czyszczenia */}
                {inputValue && (
                    <button
                        onClick={handleClear}
                        className="absolute right-6 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary/50 text-text-muted hover:text-red-400 transition-colors"
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}