import { z } from 'zod';

// Base schema for timestamps
const timestampSchema = z.object({
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

// Schema for user data
export const userSchema = z
    .object({
        id: z.string().uuid(),
        username: z.string().min(3).max(50),
        email: z.string().email(),
        role: z.enum(['ADMIN', 'AUTHOR', 'USER']),
    })
    .merge(timestampSchema);

// Schema for categories
export const categorySchema = z
    .object({
        id: z.string().uuid(),
        name: z.string().min(2).max(50),
        slug: z.string().min(2).max(50),
        description: z.string().max(200).optional(),
    })
    .merge(timestampSchema);

// Schema for tags
export const tagSchema = z
    .object({
        id: z.string().uuid(),
        name: z.string().min(2).max(30),
        slug: z.string().min(2).max(30),
    })
    .merge(timestampSchema);

// Schema for comments
export const commentSchema = z
    .object({
        id: z.string().uuid(),
        content: z.string().min(1).max(1000),
        userId: z.string().uuid(),
        postId: z.string().uuid(),
        parentId: z.string().uuid().optional(),
    })
    .merge(timestampSchema);

// Schema for blog posts
export const postSchema = z
    .object({
        id: z.string().uuid(),
        title: z.string().min(5).max(200),
        slug: z.string().min(5).max(200),
        content: z.string().min(10),
        excerpt: z.string().max(300).optional(),
        published: z.boolean().default(false),
        featuredImage: z.string().url().optional(),
        authorId: z.string().uuid(),
        categoryId: z.string().uuid(),
        tags: z.array(tagSchema).optional(),
        author: z
            .object({
                username: z.string(),
                email: z.string().optional(),
            })
            .optional(),

        category: z
            .object({
                name: z.string(),
                slug: z.string(),
            })
            .optional(),
        comments: z.array(commentSchema).optional(),
    })
    .merge(timestampSchema);

// Input schemas for forms
export const createPostSchema = postSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export const updatePostSchema = createPostSchema.partial();

export const createCommentSchema = commentSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

// Type inference
export type User = z.infer<typeof userSchema>;
export type Post = z.infer<typeof postSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Tag = z.infer<typeof tagSchema>;
export type Comment = z.infer<typeof commentSchema>;
export type CreatePost = z.infer<typeof createPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;
export type CreateComment = z.infer<typeof createCommentSchema>;
