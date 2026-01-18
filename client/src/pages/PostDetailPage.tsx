import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { Post } from '../lib/schemas';
import { formatDate } from '../lib/utils';
import { postsApi, commentsApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import {LinkifiedText} from "../components/LinkifiedText.tsx";

interface Comment {
    id: string;
    author: string;
    content: string;
    createdAt: string;
    likes: number;
}

export function PostDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
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

    const deletePostMutation = useMutation({
        mutationFn: postsApi.delete,
        onSuccess: () => {
            alert('Post deleted successfully');
            navigate('/'); // Wróć na stronę główną
        },
        onError: (err) => alert('Failed to delete post'),
    });

    const deleteCommentMutation = useMutation({
        mutationFn: commentsApi.delete,
        onSuccess: () => {
            // Odśwież tylko komentarze, nie całą stronę
            queryClient.invalidateQueries({ queryKey: ['comments', post?.id] });
        },
        onError: (err) => alert('Failed to delete comment'),
    });

    const handleDeletePost = () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            if (post) deletePostMutation.mutate(post.id);
        }
    };

    const handleDeleteComment = (commentId: string) => {
        if (window.confirm('Delete this comment?')) {
            deleteCommentMutation.mutate(commentId);
        }
    };

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !post || !user) return;

        createCommentMutation.mutate({
            content: newComment,
            postId: post.id,
            userId: user.id,
        });
    };

    const isPostAuthor = user && post && (user.id === post.authorId || user.role === 'ADMIN');

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
            {/* Top Navigation */}
            <div className="flex justify-between items-center mb-8">
                <Link
                    to="/"
                    className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-foreground border border-secondary hover:bg-secondary hover:text-foreground transition-all duration-300"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Blog
                </Link>

                {/* delete post button */}
                {isPostAuthor && (
                    <button
                        onClick={handleDeletePost}
                        disabled={deletePostMutation.isPending}
                        className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors disabled:opacity-50"
                    >
                        {deletePostMutation.isPending ? 'Deleting...' : 'Delete Post'}
                    </button>
                )}
            </div>

            {/* Featured Image */}
            {post.featuredImage && (
                <div className="mb-10 overflow-hidden rounded-2xl border border-secondary/50">
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="h-[500px] w-full object-cover"
                    />
                </div>
            )}

            {/* Header */}
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
                    <span className="font-medium">By {post.author?.username}</span>
                </div>
            </header>

            {/* Content */}
            <article className="prose prose-invert prose-lg max-w-none mb-16 text-foreground/90 leading-relaxed">
                <div className="whitespace-pre-wrap leading-relaxed text-foreground/90">
                    <LinkifiedText text={post.content} />
                </div>
            </article>

            {/* Comments Section */}
            <section className="mt-16 border-t border-secondary pt-12">
                <h2 className="mb-8 text-3xl font-bold text-foreground flex items-center gap-3">
                    Comments <span className="text-lg text-muted-foreground font-normal">({comments.length})</span>
                </h2>

                {/* Comment Form */}
                {user ? (
                    <form onSubmit={handleSubmitComment} className="mb-12 bg-secondary/20 p-6 rounded-xl border border-secondary">
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

                {/* Comments List */}
                <div className="space-y-6">
                    {comments.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8 italic">No comments yet. Be the first to share your thoughts!</p>
                    ) : (
                        comments.map((comment) => {
                            const isCommentAuthor = user && (user.id === comment.userId || user.role === 'ADMIN');

                            return (
                                <div
                                    key={comment.id}
                                    className="rounded-xl bg-secondary/30 p-6 border border-secondary group relative"
                                >
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="font-bold text-foreground">
                                            {comment.user?.username || 'User'}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <time className="text-xs text-muted-foreground">
                                                {formatDate(comment.createdAt)}
                                            </time>
                                            
                                            {/* delete comment button */}
                                            {isCommentAuthor && (
                                                <button
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className="text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-300 hover:underline"
                                                    title="Delete comment"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-foreground/90 leading-relaxed">{comment.content}</p>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>
        </div>
    );
}