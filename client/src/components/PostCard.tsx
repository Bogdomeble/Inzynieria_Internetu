import { Link } from "react-router-dom";
import type { Post } from "../lib/schemas";
import { formatDate } from "../lib/utils";

interface PostCardProps {
  post: Post;
  variant?: "default" | "featured";
}

export function PostCard({ post, variant = "default" }: PostCardProps) {
  const isFeatured = variant === "featured";

  return (
    <article className="overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-lg">
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
      <div className="p-6">
        {/* Title */}
        <Link to={`/posts/${post.slug}`} className="group block">
          <h2
            className={`
            font-bold text-gray-900 group-hover:text-primary/90
            ${isFeatured ? "text-2xl md:text-3xl" : "text-xl"}
          `}
          >
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mt-3 text-gray-600 line-clamp-2">{post.excerpt}</p>
        )}

        {/* Metadata */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            {/* Category */}
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {post.categoryId}
            </span>

            {/* Date */}
            <time dateTime={post.createdAt} className="text-gray-500">
              {formatDate(post.createdAt)}
            </time>
          </div>

          {/* Author placeholder */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-200"></div>
            <span className="text-gray-600">
              Author {post.authorId.slice(0, 4)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
