import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debounce } from '../lib/utils';

export function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialSearch = searchParams.get('search') || '';
  const [inputValue, setInputValue] = useState(initialSearch);

  //Jeśli URL zmieni się z zewnątrz, zaktualizuj input
  useEffect(() => {
    setInputValue(searchParams.get('search') || '');
  }, [searchParams]);

  // tutaj tylko raz tworzymy dzięki useMemo
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
        }, { replace: true }); // nie zaśmieca historii przeglądarki przy każdym znaku
      }, 500),
    [setSearchParams]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInputValue(newVal); // Natychmiastowa aktualizacja dla frontendu
    debouncedUpdateUrl(newVal); // Opóźniona aktualizacja dla url
  };

  return (
    <div className="mb-8 w-full max-w-xl mx-auto">
      <div className="relative group">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Search articles..."
          className="w-full rounded-full border border-secondary bg-secondary/30 px-6 py-3 pl-12 text-text placeholder-text-muted 
          focus:border-accent focus:bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-300 shadow-sm"
        />
        {/* Ikona lupki */}
        <svg
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        
        {/* Przycisk czyszczenia */}
        {inputValue && (
          <button
            onClick={() => {
              setInputValue('');
              debouncedUpdateUrl('');
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-red-400 transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}