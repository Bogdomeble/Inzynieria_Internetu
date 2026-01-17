import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { tagsApi } from "../lib/api";

export function TagFilter() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentTag = searchParams.get("tag");

    const { data: tags, isLoading } = useQuery({
        queryKey: ["tags"],
        queryFn: tagsApi.getAll,
    });

    const handleTagClick = (tagSlug: string | null) => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            if (tagSlug) {
                //odznaczenie tagow
                if (currentTag === tagSlug) {
                    newParams.delete("tag");
                } else {
                    newParams.set("tag", tagSlug);
                }
            } else {
                newParams.delete("tag");
            }
            return newParams;
        });
    };

    if (isLoading) return <div className="h-8 w-full animate-pulse bg-secondary/30 rounded-md mb-6"></div>;
    if (!tags || tags.length === 0) return null;

    return (
        <div className="mb-8 overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max">
                {/* Przycisk "Wszystkie" */}
                <button
                    onClick={() => handleTagClick(null)}
                    className={`
            px-4 py-1.5 rounded-full text-sm font-medium transition-all border
            ${
                        !currentTag
                            ? "bg-text text-background border-text"
                            : "bg-transparent text-text-muted border-secondary hover:border-text hover:text-text"
                    }
          `}
                >
                    All
                </button>

                {/* Lista Tagów */}
                {tags.map((tag: any) => {
                    const isActive = currentTag === tag.slug;
                    return (
                        <button
                            key={tag.id}
                            onClick={() => handleTagClick(tag.slug)}
                            className={`
                px-4 py-1.5 rounded-full text-sm font-medium transition-all border whitespace-nowrap
                ${
                                isActive
                                    ? "bg-accent text-background border-accent"
                                    : "bg-transparent text-text-muted border-secondary hover:border-accent hover:text-text"
                            }
              `}
                        >
                            {isActive && "✓ "}
                            {tag.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
