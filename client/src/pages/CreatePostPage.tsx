import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { postsApi, categoriesApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { createSlug } from '../lib/utils';
import { TagSelector } from '../components/TagSelector';
import { ImageUpload } from '../components/ImageUpload';
import { InputError } from '../components/InputError';
import { z } from 'zod';

const postValidationSchema = z.object({
    title: z.string().min(5, 'Tytuł musi mieć co najmniej 5 znaków'),
    content: z.string().min(10, 'Treść musi mieć co najmniej 10 znaków'),
    categoryId: z.string().uuid('Wybierz kategorię z listy'),
    featuredImage: z.string().url('To nie jest poprawny adres URL').optional().or(z.literal('')),
});

export function CreatePostPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [featuredImage, setFeaturedImage] = useState('');

    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: categoriesApi.getAll,
    });

    const createPostMutation = useMutation({
        mutationFn: postsApi.create,
        onSuccess: (newPost) => {
            navigate(`/posts/${newPost.slug}`);
        },
        onError: (error: any) => {
            const message = error.response?.data?.message;
            if (Array.isArray(message)) {
                alert(message[0]);
            } else {
                alert(message || 'Failed to create post');
            }
        },
    });

    const handleTagsChange = (tags: string[]) => {
        if (tags.length <= 3) setSelectedTags(tags);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFieldErrors({});

        //Walidacja Zodem
        const validation = postValidationSchema.safeParse({
            title,
            content,
            categoryId,
            featuredImage
        });

        if (!validation.success) {
            const formattedErrors: Record<string, string> = {};
            validation.error.issues.forEach((issue) => {
                formattedErrors[issue.path[0]] = issue.message;
            });
            setFieldErrors(formattedErrors);
            return;
        }

        if (!user) return;

        createPostMutation.mutate({
            title,
            content,
            slug: createSlug(title) + '-' + Date.now().toString().slice(-4),
            authorId: user.id,
            categoryId: categoryId,
            published: true,
            tags: selectedTags.map(id => ({ id })) as any,
            featuredImage: featuredImage || undefined,
        });
    };

    return (
        <div className="mx-auto max-w-3xl px-4 py-12">
            <h1 className="mb-8 text-4xl font-black text-foreground tracking-tight">
                Create New Post
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-8 bg-secondary/20 p-8 rounded-2xl border border-secondary shadow-xl backdrop-blur-sm"
            >
                <ImageUpload
                    value={featuredImage}
                    onChange={setFeaturedImage}
                />
                <InputError message={fieldErrors.featuredImage} />

                {/* Tytuł */}
                <div>
                    <label className="block text-sm font-bold text-muted-foreground mb-2 ml-1">
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter an engaging title..."
                        className={`w-full rounded-xl border px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 transition-all ${
                            fieldErrors.title ? 'border-red-500/50 bg-red-500/5 focus:ring-red-500' : 'border-secondary bg-secondary focus:ring-accent'
                        }`}
                    />
                    <InputError message={fieldErrors.title} />
                </div>

                {/* Kategoria */}
                <div>
                    <label className="block text-sm font-bold text-muted-foreground mb-2 ml-1">
                        Category
                    </label>
                    <div className="relative">
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className={`w-full appearance-none rounded-xl border px-4 py-3 text-foreground focus:outline-none focus:ring-1 transition-all cursor-pointer ${
                                fieldErrors.categoryId ? 'border-red-500/50 bg-red-500/5 focus:ring-red-500' : 'border-secondary bg-secondary focus:ring-accent'
                            }`}
                        >
                            <option value="" className="bg-background text-muted-foreground">Select a category</option>
                            {categories?.map((cat: any) => (
                                <option key={cat.id} value={cat.id} className="bg-background">
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                    <InputError message={fieldErrors.categoryId} />
                </div>

                {/* Tagi */}
                <div>
                    <div className="flex justify-between items-center mb-2 ml-1">
                        <label className="block text-sm font-bold text-muted-foreground">
                            Tags
                        </label>
                        <span className={`text-xs font-medium ${selectedTags.length === 3 ? 'text-accent' : 'text-muted-foreground'}`}>
                            Selected: {selectedTags.length}/3
                        </span>
                    </div>
                    <div className="p-4 rounded-xl border border-secondary bg-secondary/30">
                        <TagSelector selectedTags={selectedTags} onChange={handleTagsChange} />
                    </div>
                </div>

                {/* Treść */}
                <div>
                    <label className="block text-sm font-bold text-muted-foreground mb-2 ml-1">
                        Content
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your story here..."
                        className={`w-full rounded-xl border px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 transition-all h-64 resize-y leading-relaxed ${
                            fieldErrors.content ? 'border-red-500/50 bg-red-500/5 focus:ring-red-500' : 'border-secondary bg-secondary focus:ring-accent'
                        }`}
                    />
                    <InputError message={fieldErrors.content} />
                </div>

                {/* Przyciski */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-secondary">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="px-6 py-2.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={createPostMutation.isPending}
                        className="rounded-xl bg-accent px-8 py-3 text-sm font-bold text-accent-foreground hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {createPostMutation.isPending ? 'Publishing...' : 'Publish Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}
