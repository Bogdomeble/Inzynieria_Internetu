import { Link, useSearchParams } from 'react-router-dom';
import type { Post } from '../lib/schemas';
import { formatDate } from '../lib/utils';
    
interface PostCardProps {
    post: Post;
    variant?: 'default' | 'featured';
}
    export function PostCard({ post, variant = "default" }: PostCardProps) {
    const isFeatured = variant === "featured";
    const [, setSearchParams] = useSearchParams();

    const handleTagClick = (e: React.MouseEvent, tagSlug: string) => {
        e.preventDefault(); // Zapobiegamy nawigacji do postu jeśli kliknięto tag
        setSearchParams((prev) => {
            prev.set("tag", tagSlug);
            return prev;
        });
    };
  
  return (
    <article className="overflow-hidden rounded-lg bg-secondary shadow transition-shadow hover:shadow-lg flex flex-col h-full">
      {/* Image Section */}
      {post.featuredImage && (
        <div className={isFeatured ? "md:h-64" : "h-48"}>
          <Link to={`/posts/${post.slug}`} className="block h-full w-full">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform hover:scale-105"
              loading="lazy"
            />
          </Link>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <Link to={`/posts/${post.slug}`} className="group block mb-3">
          <h2
            className={`
            font-bold text-secondary-foreground group-hover:text-primary/90
            ${isFeatured ? "text-2xl md:text-3xl" : "text-xl"}
          `}
          >
            {post.title}
          </h2>
        </Link>

        {/* Tagi - NOWE */}
        {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map(tag => (
                    <button
                        key={tag.id}
                        onClick={(e) => handleTagClick(e, tag.slug)}
                        className="text-xs font-medium text-accent border border-accent/30 rounded-full px-2 py-0.5 hover:bg-accent hover:text-background transition-colors"
                    >
                        #{tag.name}
                    </button>
                ))}
            </div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mt-auto text-text line-clamp-2 text-sm">{post.excerpt}</p>
        )}

        {/* Metadata */}
        <div className="mt-4 flex items-center justify-between text-xs text-text-muted border-t border-secondary-foreground/10 pt-4">
            <div className="flex items-center gap-2">
                <span>{post.category?.name}</span>
                <span>•</span>
                <time dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
                </time>
            </div>
            
            <span>{post.author?.username}</span>
        </div>
      </div>
    </article>
  );
}
