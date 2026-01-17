import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { Post } from '../lib/schemas';
import { formatDate } from '../lib/utils';
import { postsApi, commentsApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';

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
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: post, isLoading, error } = useQuery<Post>({
        queryKey: ['post', slug],
        queryFn: () => postsApi.getBySlug(slug!),
        enabled: !!slug,
        retry: 1,
    });

    const { data: comments = [] } = useQuery<Comment[]>({
        queryKey: ['comments', post?.id],
        queryFn: () => {
            if (!post) return Promise.resolve([]);
            return commentsApi.getByPostId(post.id);
        },
        enabled: !!post,
    });

    const createCommentMutation = useMutation({
        mutationFn: commentsApi.create,
        onSuccess: () => {
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
            userId: user.id,
        });
    };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-accent"></div>
                    <p className="mt-4 text-muted-foreground">Loading post...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-foreground">Post not found</h2>
                    <Link
                        to="/"
                        className="mt-4 inline-block rounded-md bg-secondary px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/80"
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
                className="group mb-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-foreground border border-secondary hover:bg-secondary hover:text-foreground transition-all duration-300"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Blog
            </Link>

            {post.featuredImage && (
                <div className="mb-10 overflow-hidden rounded-2xl border border-secondary/50">
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="h-[500px] w-full object-cover"
                    />
                </div>
            )}

            <header className="mb-10 text-center">
                {post.category && (
                    <div className="mb-4 flex justify-center">
                         <span className="rounded-full border border-accent/50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent">
                            {post.category.name}
                        </span>
                    </div>
                )}
                <h1 className="mb-6 text-4xl md:text-5xl font-black text-foreground leading-tight">
                    {post.title}
                </h1>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground border-y border-secondary py-4 w-fit mx-auto px-8">
                    <time dateTime={post.createdAt} className="font-medium">
                        {formatDate(post.createdAt)}
                    </time>
                    <span>•</span>
                    <span className="font-medium">By {post.author.username}</span>
                </div>
            </header>

            <article className="prose prose-invert prose-lg max-w-none mb-16 text-foreground/90 leading-relaxed">
                <div className="whitespace-pre-wrap">
                    {post.content}
                </div>
            </article>

            <section className="mt-16 border-t border-secondary pt-12">
                <h2 className="mb-8 text-3xl font-bold text-foreground flex items-center gap-3">
                    Comments <span className="text-lg text-muted-foreground font-normal">({comments.length})</span>
                </h2>

                {user ? (
                    <form onSubmit={handleSubmitComment} className="mb-12 bg-secondary/20 p-6 rounded-xl border border-secondary">
                        {/* ZMIANA: Input ma tło secondary i jasny tekst */}
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="w-full rounded-lg border border-secondary bg-secondary p-4 text-foreground placeholder-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all min-h-[120px]"
                            rows={3}
                        />
                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={createCommentMutation.isPending}
                                className="rounded-md bg-secondary px-8 py-2.5 text-sm font-bold text-foreground border border-secondary hover:bg-secondary/80 hover:border-accent transition-all disabled:opacity-50 shadow-sm"
                            >
                                {createCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="mb-12 p-8 rounded-xl bg-secondary/10 border border-secondary text-center">
                        <p className="text-muted-foreground mb-4">Join the conversation</p>
                        <Link to="/login" className="inline-block rounded-md bg-accent px-6 py-2 text-sm font-bold text-accent-foreground hover:opacity-90">
                            Login to Comment
                        </Link>
                    </div>
                )}

                <div className="space-y-6">
                    {comments.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8 italic">No comments yet. Be the first to share your thoughts!</p>
                    ) : (
                        comments.map((comment) => (
                            <div
                                key={comment.id}
                                className="rounded-xl bg-secondary/30 p-6 border border-secondary"
                            >
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="font-bold text-foreground">
                                        {(comment as any).user?.username || 'User'}
                                    </span>
                                    <time className="text-xs text-muted-foreground">
                                        {formatDate(comment.createdAt)}
                                    </time>
                                </div>
                                <p className="text-foreground/90 leading-relaxed">{comment.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}