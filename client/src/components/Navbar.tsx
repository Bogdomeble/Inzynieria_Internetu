import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-background shadow border-b border-secondary">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    {/* Lewa strona - Logo */}
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className="flex items-center text-xl font-bold text-primary-foreground hover:opacity-80 transition-opacity"
                        >
                            MiniBlog
                        </Link>
                    </div>

                    {/* Prawa strona - Linki */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            // Widok dla ZALOGOWANEGO użytkownika
                            <>
                                <Link
                                    to="/create"
                                    className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-text hover:bg-primary-700 border border-secondary"
                                >
                                    Create Post
                                </Link>

                                <div className="flex items-center gap-4 ml-4">
                                    <span className="text-text-muted text-sm hidden sm:block">
                                        {user.username}
                                    </span>
                                    <button
                                        onClick={logout}
                                        className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            // Widok dla NIEZALOGOWANEGO użytkownika
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-text hover:text-accent transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
