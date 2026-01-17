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
            login(data.user);
            navigate('/');
        } catch (err: any) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl bg-secondary/30 p-8 shadow-2xl border border-secondary backdrop-blur-sm">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-black text-foreground tracking-tight">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Enter your details to sign in
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-900/20 border border-red-900/50 p-4 text-sm text-red-200 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-muted-foreground mb-2 ml-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full rounded-xl border border-secondary bg-secondary/50 px-4 py-3 text-foreground placeholder-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-muted-foreground mb-2 ml-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-secondary bg-secondary/50 px-4 py-3 text-foreground placeholder-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-accent px-4 py-3.5 text-sm font-bold text-accent-foreground hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 mt-2"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="font-bold text-accent hover:text-accent/80 hover:underline transition-colors"
                    >
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    );
}