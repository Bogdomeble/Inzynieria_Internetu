import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../lib/api';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const data = await authApi.login({ email, password });
            login( data.user);
            navigate('/'); // Przekieruj na stronę główną po zalogowaniu
        } catch (err: any) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
            <div className="w-full max-w-md rounded-lg bg-card p-8 shadow-lg border border-secondary">
                <h2 className="mb-6 text-center text-2xl font-bold text-text">
                    Login
                </h2>

                {error && (
                    <div className="mb-4 rounded bg-red-900/50 p-3 text-sm text-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-muted">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-secondary bg-primary px-3 py-2 text-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-muted">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-secondary bg-primary px-3 py-2 text-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-md bg-primary-600 px-4 py-2 text-white bg-accent hover:bg-accent/90 transition-colors"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-text-muted">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="text-accent hover:underline"
                    >
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}
