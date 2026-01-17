import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-background shadow border-b border-secondary sticky top-0 z-50">
            <div className="mx-auto w-full max-w-[1600px] px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className="flex items-center text-2xl font-bold text-foreground hover:opacity-80 transition-opacity"
                        >
                            MiniBlog
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link
                                    to="/create"
                                    className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/80 border border-secondary transition-colors"
                                >
                                    Create Post
                                </Link>

                                <div className="flex items-center gap-4 ml-4">
                                    <span className="text-muted-foreground text-sm hidden sm:block">
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
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 transition-opacity"
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
