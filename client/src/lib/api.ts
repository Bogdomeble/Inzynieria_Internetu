import type {
    Post,
    CreatePost,
    UpdatePost,
    Comment,
    CreateComment,
} from './schemas';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Posts API
export const postsApi = {
    getAll: async (): Promise<Post[]> => {
        const { data } = await api.get('/posts');
        return data;
    },

    getById: async (id: string): Promise<Post> => {
        const { data } = await api.get(`/posts/${id}`);
        return data;
    },

    getBySlug: async (slug: string): Promise<Post> => {
        const { data } = await api.get(`/posts/slug/${slug}`);
        return data;
    },

    create: async (post: CreatePost): Promise<Post> => {
        const { data } = await api.post('/posts', post);
        return data;
    },

    update: async (id: string, post: UpdatePost): Promise<Post> => {
        const { data } = await api.put(`/posts/${id}`, post);
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/posts/${id}`);
    },
};

// Comments API
export const commentsApi = {
    getByPostId: async (postId: string): Promise<Comment[]> => {
        const { data } = await api.get(`/posts/${postId}/comments`);
        return data;
    },

    create: async (comment: CreateComment): Promise<Comment> => {
        const { data } = await api.post('/comments', comment);
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/comments/${id}`);
    },
};

// Categories API
export const categoriesApi = {
    getAll: async () => {
        const { data } = await api.get('/categories');
        return data;
    },

    getById: async (id: string) => {
        const { data } = await api.get(`/categories/${id}`);
        return data;
    },
};

// Tags API
export const tagsApi = {
    getAll: async () => {
        const { data } = await api.get('/tags');
        return data;
    },

    getById: async (id: string) => {
        const { data } = await api.get(`/tags/${id}`);
        return data;
    },
};

export const authApi = {
    login: async (credentials: { email: string; password: string }) => {
        const { data } = await api.post('/auth/login', credentials);
        return data;
    },

    register: async (credentials: {
        email: string;
        username: string;
        password: string;
    }) => {
        const { data } = await api.post('/auth/register', credentials);
        return data;
    },

    getProfile: async () => {
        const { data } = await api.get('/auth/profile');
        return data;
    },
};

export default api;
