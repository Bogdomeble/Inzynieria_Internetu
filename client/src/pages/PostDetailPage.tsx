import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { Post } from "../lib/schemas";
import { formatDate } from "../lib/utils";

// Mock data - matches your MOCK_POSTS structure
const MOCK_POSTS: Post[] = [
    {
        id: "1",
        title: "Getting Started with TypeScript",
        slug: "getting-started-with-typescript",
        content: `
bla bla 
    `,
        excerpt: "Learn the basics of TypeScript and how to use it in your projects",
        published: true,
        authorId: "author1",
        categoryId: "cat1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        featuredImage: "https://picsum.photos/800/400",
    },
    {
        id: "2",
        title: "React Best Practices",
        slug: "react-best-practices",
        content: `
jakies tam inne bla bla
    `,
        excerpt: "Discover the best practices for building scalable React applications",
        published: true,
        authorId: "author2",
        categoryId: "cat2",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        featuredImage: "https://picsum.photos/800/400?random=1",
    },
    {
        id: "3",
        title: "State Management with React Query",
        slug: "state-management-react-query",
        content: `
jeszcze inne bla bla
    `,
        excerpt: "Learn how to manage server state effectively with React Query",
        published: true,
        authorId: "author1",
        categoryId: "cat3",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        featuredImage: "https://picsum.photos/800/400?random=2",
    },
];

interface Comment {
    id: string;
    author: string;
    content: string;
    createdAt: string;
    likes: number;
}


const MOCK_COMMENTS: Record<string, Comment[]> = {
    "1": [
        {
            id: "c1",
            author: "k",
            content: "67",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            likes: 5,
        },
        {
            id: "c2",
            author: "Smith",
            content: "nice",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            likes: 12,
        },
    ],
    "2": [
        {
            id: "c3",
            author: "Польский поляк",
            content: "To nie nasza wojna",
            createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            likes: 8,
        },
    ],
    "3": [
        {
            id: "c4",
            author: "XD User",
            content: "niesamowite",
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            likes: 15,
        },
    ],
};

export function PostDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState<Comment[]>([]);
    const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

    // Fetch data
    const { data: post, isLoading, error } = useQuery<Post | undefined>({
        queryKey: ["post", slug],
        queryFn: () => {
            const foundPost = MOCK_POSTS.find((p) => p.slug === slug);
            return Promise.resolve(foundPost);
        },
    });

    // Load comments
    const { data: initialComments } = useQuery<Comment[]>({
        queryKey: ["comments", post?.id],
        queryFn: () => {
            if (!post) return Promise.resolve([]);
            return Promise.resolve(MOCK_COMMENTS[post.id] || []);
        },
        enabled: !!post,
    });

    // Set comments
    if (initialComments && comments.length === 0) {
        setComments(initialComments);
    }

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const comment: Comment = {
            id: `c${Date.now()}`,
            author: "Anonymous User",
            content: newComment,
            createdAt: new Date().toISOString(),
            likes: 0,
        };

        setComments([...comments, comment]);
        setNewComment("");
    };

    const handleLikeComment = (commentId: string) => {
        if (likedComments.has(commentId)) {
            // Unlike
            setLikedComments((prev) => {
                const newSet = new Set(prev);
                newSet.delete(commentId);
                return newSet;
            });
            setComments((prev) =>
                prev.map((c) =>
                    c.id === commentId ? { ...c, likes: c.likes - 1 } : c
                )
            );
        } else {
            // Like
            setLikedComments((prev) => new Set(prev).add(commentId));
            setComments((prev) =>
                prev.map((c) =>
                    c.id === commentId ? { ...c, likes: c.likes + 1 } : c
                )
            );
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-accent"></div>
                    <p className="mt-4 text-text-muted">Loading post...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-text">Post not found</h2>
                    <p className="mt-2 text-text-muted">
                        The post you're looking for doesn't exist.
                    </p>
                    <Link
                        to="/"
                        className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-background hover:opacity-90"
                    >
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            {/* Back Button */}
            <Link
                to="/"
                className="mb-6 inline-flex items-center text-accent hover:text-accent-foreground transition-colors"
            >
                <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
                Back to Blog
            </Link>

            {/* Featured Image */}
            {post.featuredImage && (
                <div className="mb-8 overflow-hidden rounded-lg">
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="h-96 w-full object-cover"
                    />
                </div>
            )}

            {/* Post Header */}
            <header className="mb-8">
                <h1 className="mb-4 text-4xl font-bold text-text">{post.title}</h1>

                <div className="flex items-center gap-4 text-sm text-text-muted">
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-background">
            {post.categoryId}
          </span>
                    <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                    <span>By Author {post.authorId.slice(0, 4)}</span>
                </div>
            </header>

            {/* Post Content */}
            <article className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-text leading-relaxed">
                    {post.content}
                </div>
            </article>

            {/* Comments Section */}
            <section className="mt-12 border-t border-secondary pt-8">
                <h2 className="mb-6 text-2xl font-bold text-text">
                    Comments ({comments.length})
                </h2>

                {/* Comment Form */}
                <form onSubmit={handleSubmitComment} className="mb-8">
          <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full rounded-lg border border-secondary bg-primary p-4 text-text placeholder-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
              rows={4}
          />
                    <button
                        type="submit"
                        className="mt-2 rounded-md bg-primary-foreground px-6 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity"
                    >
                        Post Comment
                    </button>
                </form>

                {/* Comments List */}
                <div className="space-y-6">
                    {comments.length === 0 ? (
                        <p className="text-text-muted">
                            No comments yet. Be the first to comment!
                        </p>
                    ) : (
                        comments.map((comment) => (
                            <div
                                key={comment.id}
                                className="rounded-lg bg-card p-6 border border-secondary"
                            >
                                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-text">
                    {comment.author}
                  </span>
                                    <time className="text-sm text-text-muted">
                                        {formatDate(comment.createdAt)}
                                    </time>
                                </div>
                                <p className="text-text mb-4">{comment.content}</p>

                                {/* Like Button */}
                                <button
                                    onClick={() => handleLikeComment(comment.id)}
                                    className={`flex items-center gap-2 text-sm transition-colors ${
                                        likedComments.has(comment.id)
                                            ? "texta-ccent"
                                            : "text-text-muted hover:text-accent"
                                    }`}
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill={likedComments.has(comment.id) ? "currentColor" : "none"}
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                    <span className="font-medium">{comment.likes}</span>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}