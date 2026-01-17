import { useQuery } from "@tanstack/react-query";
import type { Post } from "../lib/schemas";
import { PostCard } from "../components/PostCard";
import { postsApi } from "../lib/api";
import { useSearchParams } from "react-router-dom";
import { SearchBar } from "../components/SearchBar";
import { TagFilter } from "../components/TagFilter";

export function BlogPage() {
    const [searchParams] = useSearchParams();

    // Wartości z URL
    const search = searchParams.get("search") || undefined;
    const tag = searchParams.get("tag") || undefined;

    const {
        data: posts,
        isLoading,
        error,
    } = useQuery<Post[]>({
        // React Query odświeży dane, gdy zmieni się 'search' lub 'tag'
        queryKey: ["posts", search, tag],
        queryFn: () => postsApi.getAll({ search, tag }),
    });

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-accent"></div>
                    <p className="mt-4 text-text-muted">Loading posts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-text">
                        Error loading posts
                    </h2>
                    <p className="mt-2 text-text-muted">
                        {error instanceof Error ? error.message : "Please try again later"}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <header className="mb-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-text sm:text-4xl mb-2">MiniBlog</h1>
                    <p className="text-text-muted">Discover stories, thinking, and expertise.</p>
                </div>

                {/* Pasek wyszukiwania */}
                <SearchBar />

                {/* Pasek filtrów tagów */}
                <TagFilter />
            </header>

            <section>
                {posts?.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-xl text-text mb-2">No posts found.</p>
                        <p className="text-text-muted">
                            Try adjusting your search or filter to find what you're looking for.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {posts?.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
