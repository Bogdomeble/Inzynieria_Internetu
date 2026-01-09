import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { Post, Comment } from '../lib/schemas';
import { formatDate } from '../lib/utils';
import { postsApi, commentsApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';

// Mock data - matches MOCK_POSTS structure
// const MOCK_POSTS: Post[] = [
//     {
//         id: "1",
//         title: "Getting Started with TypeScript",
//         slug: "getting-started-with-typescript",
//         content: `
// bla bla
//     `,
//         excerpt: "Learn the basics of TypeScript and how to use it in your projects",
//         published: true,
//         authorId: "author1",
//         categoryId: "cat1",
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         featuredImage: "https://picsum.photos/800/400",
//     },
//     {
//         id: "2",
//         title: "React Best Practices",
//         slug: "react-best-practices",
//         content: `
// jakies tam inne bla bla
//     `,
//         excerpt: "Discover the best practices for building scalable React applications",
//         published: true,
//         authorId: "author2",
//         categoryId: "cat2",
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         featuredImage: "https://picsum.photos/800/400?random=1",
//     },
//     {
//         id: "3",
//         title: "State Management with React Query",
//         slug: "state-management-react-query",
//         content: `
// jeszcze inne bla bla
//     `,
//         excerpt: "Learn how to manage server state effectively with React Query",
//         published: true,
//         authorId: "author1",
//         categoryId: "cat3",
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         featuredImage: "https://picsum.photos/800/400?random=2",
//     },
// ];

// const MOCK_COMMENTS: Record<string, Comment[]> = {
//     "1": [
//         {
//             id: "c1",
//             author: "k",
//             content: "67",
//             createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
//             likes: 5,
//         },
//         {
//             id: "c2",
//             author: "Smith",
//             content: "nice",
//             createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
//             likes: 12,
//         },
//     ],
//     "2": [
//         {
//             id: "c3",
//             author: "Польский поляк",
//             content: "To nie nasza wojna",
//             createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
//             likes: 8,
//         },
//     ],
//     "3": [
//         {
//             id: "c4",
//             author: "XD User",
//             content: "niesamowite",
//             createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
//             likes: 15,
//         },
//     ],
// };

interface Comment {
    id: string;
    author: string;
    content: string;
    createdAt: string;
    likes: number;
}
export function PostDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const [newComment, setNewComment] = useState('');
    const { user } = useAuth(); // Pobieramy zalogowanego użytkownika
    const queryClient = useQueryClient(); // Do odświeżania danych

    // Pobierz post
    const {
        data: post,
        isLoading,
        error,
    } = useQuery<Post>({
        queryKey: ['post', slug],
        queryFn: () => postsApi.getBySlug(slug!),
        enabled: !!slug,
        retry: 1,
    });

    // Pobierz komentarze z API (już nie z MOCK_DATA)
    const { data: comments = [] } = useQuery<Comment[]>({
        queryKey: ['comments', post?.id],
        queryFn: () => {
            if (!post) return Promise.resolve([]);
            return commentsApi.getByPostId(post.id);
        },
        enabled: !!post,
    });

    // Mutacja do dodawania komentarza
    const createCommentMutation = useMutation({
        mutationFn: commentsApi.create,
        onSuccess: () => {
            // Po sukcesie wyczyść pole i odśwież listę komentarzy
            setNewComment('');
            queryClient.invalidateQueries({ queryKey: ['comments', post?.id] });
        },
        onError: (err) => {
            alert('Failed to add comment: ' + err);
        },
    });

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !post || !user) return;

        createCommentMutation.mutate({
            content: newComment,
            postId: post.id,
            userId: user.id, // ID zalogowanego użytkownika
        });
    };

    // (Lajkowanie na razie pomijamy)

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
                    <h2 className="text-2xl font-bold text-text">
                        Post not found
                    </h2>
                    <Link
                        to="/"
                        className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-background"
                    >
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            <Link
                to="/"
                className="mb-6 inline-flex items-center text-accent hover:text-accent-foreground transition-colors"
            >
                ← Back to Blog
            </Link>

            {post.featuredImage && (
                <div className="mb-8 overflow-hidden rounded-lg">
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="h-96 w-full object-cover"
                    />
                </div>
            )}

            <header className="mb-8">
                <h1 className="mb-4 text-4xl font-bold text-text">
                    {post.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-text-muted">
                    <time dateTime={post.createdAt}>
                        {formatDate(post.createdAt)}
                    </time>
                    <span>By Author {post.author.username.slice(0, 4)}</span>
                </div>
            </header>

            <article className="prose prose-invert max-w-none mb-12">
                <div className="whitespace-pre-wrap text-text leading-relaxed">
                    {post.content}
                </div>
            </article>

            <section className="mt-12 border-t border-secondary pt-8">
                <h2 className="mb-6 text-2xl font-bold text-text">
                    Comments ({comments.length})
                </h2>

                {user ? (
                    <form onSubmit={handleSubmitComment} className="mb-8">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full rounded-lg border border-secondary bg-primary p-4 text-text placeholder-text-muted focus:border-accent focus:outline-none"
                            rows={3}
                        />
                        <button
                            type="submit"
                            disabled={createCommentMutation.isPending}
                            className="mt-2 rounded-md bg-accent px-6 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
                        >
                            {createCommentMutation.isPending
                                ? 'Posting...'
                                : 'Post Comment'}
                        </button>
                    </form>
                ) : (
                    <p className="mb-8 text-text-muted">
                        Please{' '}
                        <Link to="/login" className="text-accent underline">
                            login
                        </Link>{' '}
                        to write a comment.
                    </p>
                )}

                <div className="space-y-6">
                    {comments.length === 0 ? (
                        <p className="text-text-muted">No comments yet.</p>
                    ) : (
                        comments.map((comment) => (
                            <div
                                key={comment.id}
                                className="rounded-lg bg-card p-6 border border-secondary"
                            >
                                <div className="mb-2 flex items-center justify-between">
                                    {/* Tu backend zwraca nested user object, jeśli tak ustawiłeś w API */}
                                    <span className="font-semibold text-text">
                                        {(comment as any).user?.username ||
                                            'User'}
                                    </span>
                                    <time className="text-sm text-text-muted">
                                        {formatDate(comment.createdAt)}
                                    </time>
                                </div>
                                <p className="text-text">{comment.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
