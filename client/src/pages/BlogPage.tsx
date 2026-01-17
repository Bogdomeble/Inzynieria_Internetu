import { useQuery } from "@tanstack/react-query";
import type { Post } from "../lib/schemas";
import { PostCard } from "../components/PostCard";
import { postsApi } from "../lib/api";
import { useSearchParams } from "react-router-dom";
import { SearchBar } from "../components/SearchBar";
import { TagFilter } from "../components/TagFilter";

export function BlogPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get("search") || undefined;
    const tag = searchParams.get("tag") || undefined;

    const {
        data: posts,
        isLoading,
        error,
        isError
    } = useQuery<Post[]>({
        queryKey: ["posts", search, tag],
        queryFn: () => postsApi.getAll({ search, tag }),
    });

    const clearTag = () => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.delete("tag");
            return newParams;
        });
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <header className="mb-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-text sm:text-4xl mb-2">MiniBlog</h1>
                    <p className="text-text-muted">Discover stories, thinking, and expertise.</p>
                </div>

                <SearchBar />

                <TagFilter />

                {tag && (
                    <div className="flex items-center gap-2 mb-4 justify-center">
                        <span className="text-text-muted text-sm">Active filter:</span>
                        <span className="bg-accent text-background px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                    #{tag}
                            <button onClick={clearTag} className="hover:text-red-700">✕</button>
                </span>
                    </div>
                )}
            </header>

            <section>

                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-accent"></div>
                            <p className="mt-4 text-text-muted">Searching...</p>
                        </div>
                    </div>
                ) : isError ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-red-500">
                                Error loading posts
                            </h2>
                            <p className="mt-2 text-text-muted">
                                {error instanceof Error ? error.message : "Please try again later"}
                            </p>
                        </div>
                    </div>
                ) : posts?.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-xl text-text mb-2">No posts found.</p>
                        <p className="text-text-muted">
                            Try adjusting your search or filter.
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