import { Link, useSearchParams } from 'react-router-dom';
import type { Post } from '../lib/schemas';
import { formatDate } from '../lib/utils';

interface PostCardProps {
    post: Post;
    variant?: 'default' | 'featured';
}

export function PostCard({ post}: PostCardProps) {
    const [, setSearchParams] = useSearchParams();

    const handleTagClick = (e: React.MouseEvent, tagSlug: string) => {
        e.preventDefault();
        setSearchParams((prev) => {
            prev.set("tag", tagSlug);
            return prev;
        });
    };

    return (
        <article className="group overflow-hidden rounded-xl bg-secondary shadow-md transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col h-full border border-secondary/50">
            {/* Image Section */}
            {post.featuredImage && (
                <div className="h-48 md:h-56 w-full relative overflow-hidden">
                    <Link to={`/posts/${post.slug}`} className="block h-full w-full">
                        <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                    </Link>
                </div>
            )}

            <div className="p-6 flex flex-col flex-grow">

                {/* Tagi */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 3).map(tag => (
                            <button
                                key={tag.id}
                                onClick={(e) => handleTagClick(e, tag.slug)}
                                className="text-xs font-semibold text-accent hover:text-accent/80 transition-colors uppercase tracking-wider"
                            >
                                #{tag.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Title */}
                <Link to={`/posts/${post.slug}`} className="block mb-3">
                    <h2
                        className={`
            font-bold text-secondary-foreground leading-tight transition-colors group-hover:text-accent
            text-xl md:text-2xl
            `}
                    >
                        {post.title}
                    </h2>
                </Link>

                {/* Excerpt */}
                {post.excerpt && (
                    <p className="mt-auto text-text-muted leading-relaxed text-sm md:text-base mb-4 line-clamp-3">
                        {post.excerpt}
                    </p>
                )}

                {/* Metadata */}
                <div className="mt-auto flex items-center justify-between text-xs md:text-sm text-text-muted border-t border-secondary-foreground/10 pt-4">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-text">{post.category?.name}</span>
                        <span>•</span>
                        <time dateTime={post.createdAt}>
                            {formatDate(post.createdAt)}
                        </time>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="font-medium">{post.author?.username}</span>
                    </div>
                </div>
            </div>
        </article>
    );
}