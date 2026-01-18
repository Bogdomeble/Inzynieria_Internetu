import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../lib/api';
import { InputError } from '../components/InputError';
import { z } from 'zod';

const registerSchema = z.object({
    email: z.string().email('Niepoprawny format adresu e-mail'),
    username: z.string().min(3, 'Nazwa użytkownika musi mieć min. 3 znaki'),
    password: z.string().min(6, 'Hasło musi mieć co najmniej 6 znaków'),
});

export function RegisterPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // error - dla ogólnych błędów (np. błąd serwera)
    const [error, setError] = useState('');
    // fieldErrors - dla konkretnych pól (email, username, password)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});

        const validation = registerSchema.safeParse({ email, username, password });

        if (!validation.success) {
            const formattedErrors: Record<string, string> = {};
            validation.error.issues.forEach((issue) => {
                formattedErrors[issue.path[0]] = issue.message;
            });
            setFieldErrors(formattedErrors);
            return; // Przerywamy, nie wysyłamy żądania do API
        }

        try {
            const data = await authApi.register({ email, username, password });
            login(data.user);
            navigate('/');
        } catch (err: any) {
            // 2. Obsługa błędów z BACKENDU
            if (err.response?.status === 409) {
                // Jeśli e-mail jest zajęty (ConflictException w NestJS)
                setFieldErrors({ email: 'Użytkownik o tym adresie e-mail już istnieje' });
            } else if (err.response?.status === 400) {
                // Obsługa błędów walidacji z NestJS (ValidationPipe)
                const backendMsg = err.response.data.message;
                setError(Array.isArray(backendMsg) ? backendMsg[0] : backendMsg);
            } else {
                setError('Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
            }
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl bg-secondary/30 p-8 shadow-2xl border border-secondary backdrop-blur-sm">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-black text-foreground tracking-tight">
                        Create Account
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Join our community today
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-900/20 border border-red-900/50 p-4 text-sm text-red-200 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username Field */}
                    <div>
                        <label className="block text-sm font-bold text-muted-foreground mb-2 ml-1">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="johndoe"
                            className={`w-full rounded-xl border px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 transition-all ${
                                fieldErrors.username
                                    ? 'border-red-500/50 bg-red-500/5 focus:border-red-500 focus:ring-red-500'
                                    : 'border-secondary bg-secondary/50 focus:border-accent focus:ring-accent'
                            }`}
                        />
                        <InputError message={fieldErrors.username} />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-bold text-muted-foreground mb-2 ml-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className={`w-full rounded-xl border px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 transition-all ${
                                fieldErrors.email
                                    ? 'border-red-500/50 bg-red-500/5 focus:border-red-500 focus:ring-red-500'
                                    : 'border-secondary bg-secondary/50 focus:border-accent focus:ring-accent'
                            }`}
                        />
                        <InputError message={fieldErrors.email} />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-bold text-muted-foreground mb-2 ml-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min. 6 characters"
                            className={`w-full rounded-xl border px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 transition-all ${
                                fieldErrors.password
                                    ? 'border-red-500/50 bg-red-500/5 focus:border-red-500 focus:ring-red-500'
                                    : 'border-secondary bg-secondary/50 focus:border-accent focus:ring-accent'
                            }`}
                        />
                        <InputError message={fieldErrors.password} />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-accent px-4 py-3.5 text-sm font-bold text-accent-foreground hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 mt-2"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="font-bold text-accent hover:text-accent/80 hover:underline transition-colors"
                    >
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}