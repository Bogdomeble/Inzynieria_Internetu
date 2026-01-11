import { useQuery } from "@tanstack/react-query";
import type { Post } from "../lib/schemas";
import { PostCard } from "../components/PostCard";
import { postsApi } from "../lib/api";
import { useSearchParams } from "react-router-dom"; 
import { SearchBar } from "../components/SearchBar"; 

// dane do testowania
// const MOCK_POSTS: Post[] = [
//   {
//     id: "1",
//     title: "Getting Started with TypeScript",
//     slug: "getting-started-with-typescript",
//     content: "TypeScript is a powerful superset of JavaScript...",
//     excerpt:
//       "Learn the basics of TypeScript and how to use it in your projects",
//     published: true,
//     authorId: "author1",
//     categoryId: "cat1",
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     featuredImage: "https://picsum.photos/800/400",
//   },
//   {
//     id: "2",
//     title: "React Best Practices",
//     slug: "react-best-practices",
//     content: "When building React applications...",
//     excerpt:
//       "Discover the best practices for building scalable React applications",
//     published: true,
//     authorId: "author2",
//     categoryId: "cat2",
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     featuredImage: "https://picsum.photos/800/400?random=1",
//   },
//   {
//     id: "3",
//     title: "State Management with React Query",
//     slug: "state-management-react-query",
//     content: "React Query is a powerful library...",
//     excerpt: "Learn how to manage server state effectively with React Query",
//     published: true,
//     authorId: "author1",
//     categoryId: "cat3",
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     featuredImage: "https://picsum.photos/800/400?random=2",
//   },
// ];

export function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // wartości z URL
  const search = searchParams.get("search") || undefined;
  const tag = searchParams.get("tag") || undefined;

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery<Post[]>({
    // musi zawierać zmienne, żeby React Query odświeżył dane przy zmianie
    queryKey: ["posts", search, tag],
    queryFn: () => postsApi.getAll({ search, tag }),
  });

    const clearTag = () => {
    setSearchParams(prev => {
        prev.delete("tag");
        return prev;
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
          <p className="mt-4 text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">
            Error loading posts
          </h2>
          <p className="mt-2 text-gray-600">
            {error instanceof Error ? error.message : "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  const safePosts = posts || [];
  const featuredPost = safePosts[0];
  const regularPosts = safePosts.slice(1);

return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white sm:text-4xl mb-4">Home</h1>
        
        {/* Pasek wyszukiwania */}
        <SearchBar />

        {/* Informacja o filtrze tagu */}
        {tag && (
            <div className="flex items-center gap-2 mb-4">
                <span className="text-text-muted">Filtering by tag:</span>
                <span className="bg-accent text-background px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                    #{tag}
                    <button onClick={clearTag} className="hover:text-red-700">✕</button>
                </span>
            </div>
        )}
      </header>

      <section>
        {posts?.length === 0 ? (
            <p className="text-center text-text-muted py-10">No posts found matching your criteria.</p>
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
