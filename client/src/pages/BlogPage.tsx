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
        <div className="mx-auto w-full max-w-[1600px] px-6 py-10 lg:px-8">
            <header className="mb-12 mt-4">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-text sm:text-6xl mb-4 tracking-tight">
                        MiniBlog
                    </h1>
                    <p className="text-lg text-text-muted max-w-2xl mx-auto">
                        Discover stories, thinking, and expertise from writers on any topic.
                    </p>
                </div>

                <SearchBar />
                <TagFilter />

                {tag && (
                    <div className="flex items-center gap-3 mb-6 justify-center animate-in fade-in slide-in-from-top-2">
                        <span className="text-text-muted text-base">Active filter:</span>
                        <span className="bg-accent text-background px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 shadow-md">
                    #{tag}
                            <button onClick={clearTag} className="hover:text-red-200 transition-colors">✕</button>
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
                    <div className="text-center py-16 bg-secondary/10 rounded-xl border border-secondary border-dashed">
                        <p className="text-xl text-text mb-2">No posts found.</p>
                        <p className="text-text-muted">
                            Try adjusting your search or filter.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {posts?.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}