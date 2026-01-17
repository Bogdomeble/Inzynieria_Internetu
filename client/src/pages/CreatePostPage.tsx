import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { postsApi, categoriesApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { createSlug } from '../lib/utils';
import { TagSelector } from '../components/TagSelector';
import { ImageUpload } from '../components/ImageUpload';

export function CreatePostPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [featuredImage, setFeaturedImage] = useState('');

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
            alert(error.response?.data?.message || 'Failed to create post');
        },
    });

    const handleTagsChange = (tags: string[]) => {
        if (tags.length <= 3) setSelectedTags(tags);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !categoryId) {
            alert('Please select a category');
            return;
        }

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
        <div className="mx-auto max-w-2xl px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold text-text">
                Create New Post
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border border-secondary">

                {/* Obrazek */}
                <ImageUpload
                    value={featuredImage}
                    onChange={setFeaturedImage}
                />

                <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-md border border-secondary bg-primary px-3 py-2 text-text focus:ring-1 focus:ring-accent outline-none"
                        required
                        minLength={5}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">Category</label>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full rounded-md border border-secondary bg-primary px-3 py-2 text-text focus:ring-1 focus:ring-accent outline-none"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories?.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-text-muted">Tags</label>
                        <span className={`text-xs ${selectedTags.length === 3 ? 'text-accent' : 'text-text-muted'}`}>
                            Selected: {selectedTags.length}/3
                        </span>
                    </div>
                    <div className="p-4 rounded-md border border-secondary bg-primary/50">
                        <TagSelector selectedTags={selectedTags} onChange={handleTagsChange} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full rounded-md border border-secondary bg-primary px-3 py-2 text-text focus:ring-1 focus:ring-accent outline-none h-48"
                        required
                        minLength={10}
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="px-4 py-2 text-sm text-text-muted hover:text-text transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={createPostMutation.isPending}
                        className="rounded-md bg-accent px-6 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {createPostMutation.isPending ? 'Publishing...' : 'Publish Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}