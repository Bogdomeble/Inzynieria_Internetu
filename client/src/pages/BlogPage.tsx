import { useQuery } from "@tanstack/react-query";
import type { Post } from "../lib/schemas";
import { PostCard } from "../components/PostCard";
import { postsApi } from "../lib/api";
// Mock data for testing
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
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: postsApi.getAll,
  });

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
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Blog</h1>
        <p className="mt-2 text-lg text-white">
          Latest thoughts, ideas, and stories
        </p>
      </header>

      {/* Featured Post */}
      {featuredPost && (
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-white">
            Featured Post
          </h2>
          <PostCard post={featuredPost} variant="featured" />
        </section>
      )}

      {/* Regular Posts */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-white">Latest Posts</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {regularPosts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Load More Button */}
      <div className="mt-12 text-center">
        <button className="btn btn-primary px-8 py-3">Load More Posts</button>
      </div>
    </div>
  );
}
