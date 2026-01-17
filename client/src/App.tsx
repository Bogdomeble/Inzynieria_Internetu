import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { BlogPage } from './pages/BlogPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CreatePostPage } from './pages/CreatePostPage';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router>
                    <div className="min-h-screen bg-background text-foreground font-sans">
                        <Navbar />
                        <main>
                            <Routes>
                                <Route path="/" element={<BlogPage />} />
                                <Route path="/posts/:slug" element={<PostDetailPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                                <Route path="/create" element={<CreatePostPage />} />
                                <Route
                                    path="*"
                                    element={
                                        <div className="flex h-[80vh] items-center justify-center">
                                            <div className="text-center">
                                                <h1 className="text-4xl font-bold text-foreground">404</h1>
                                                <p className="mt-2 text-muted-foreground">Page not found.</p>
                                                <Link
                                                    to="/"
                                                    className="mt-4 inline-block rounded-md bg-secondary px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/80"
                                                >
                                                    Go Home
                                                </Link>
                                            </div>
                                        </div>
                                    }
                                />
                            </Routes>
                        </main>

                        <footer className="mt-12 border-t border-secondary bg-background">
                            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                                <p className="text-center text-sm text-muted-foreground">
                                    © {new Date().getFullYear()} MiniBlog. All rights reserved.
                                </p>
                            </div>
                        </footer>
                    </div>
                </Router>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;