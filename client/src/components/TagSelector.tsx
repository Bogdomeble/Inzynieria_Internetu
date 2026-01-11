// client/src/components/TagSelector.tsx
import { useQuery } from "@tanstack/react-query";
import { tagsApi } from "../lib/api";

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export function TagSelector({ selectedTags, onChange }: TagSelectorProps) {
  const { data: tags, isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: tagsApi.getAll,
  });

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      // Jeśli już jest, usuwamy
      onChange(selectedTags.filter((id) => id !== tagId));
    } else {
      // Jeśli nie ma, dodajemy
      onChange([...selectedTags, tagId]);
    }
  };

  if (isLoading) return <div className="text-sm text-text-muted">Loading tags...</div>;

  if (!tags || tags.length === 0) {
    return <div className="text-sm text-yellow-500">No tags found. Please seed database.</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag: any) => {
        const isSelected = selectedTags.includes(tag.id);
        return (
          <button
            type="button" // nie może być tutaj formularz - troche dziwne rozwiązanie
            onClick={() => toggleTag(tag.id)}
            className={`
              px-3 py-1 rounded-full text-sm font-medium transition-all border
              ${
                isSelected
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-transparent text-text-muted border-secondary hover:border-accent hover:text-text"
              }
            `}
          >
            {isSelected ? "✓ " : "+ "}
            {tag.name}
          </button>
        );
      })}
    </div>
  );
}