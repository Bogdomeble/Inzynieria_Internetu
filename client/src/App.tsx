import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
//import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Dodano Link z powrotem dla strony 404

// Import kontekstu i komponentów
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';

// Import stron
import { BlogPage } from './pages/BlogPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CreatePostPage } from './pages/CreatePostPage'; // Do odkomentowania w przyszłości

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
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
                    <div className="min-h-screen bg-background">
                        {/* Navbar został wydzielony, ale jest wewnątrz Routera i AuthProvidera */}
                        <Navbar />

                        {/* Główna zawartość */}
                        <main className="container mx-auto px-4 py-8">
                            <Routes>
                                <Route path="/" element={<BlogPage />} />
                                <Route
                                    path="/posts/:slug"
                                    element={<PostDetailPage />}
                                />

                                {/*  trasy autoryzacji */}
                                <Route path="/login" element={<LoginPage />} />
                                <Route
                                    path="/register"
                                    element={<RegisterPage />}
                                />

                                {/* Przyszła trasa chroniona (przykład) */}
                                <Route
                                    path="/create"
                                    element={<CreatePostPage />}
                                />

                                {/* Strona 404 */}
                                <Route
                                    path="*"
                                    element={
                                        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                                            <div className="text-center">
                                                <h2 className="text-2xl font-bold text-primary-foreground">
                                                    404 - Page Not Found
                                                </h2>
                                                <p className="mt-2 text-text">
                                                    The page you're looking for
                                                    doesn't exist.
                                                </p>
                                                <Link
                                                    to="/"
                                                    className="mt-4 inline-block rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-text hover:bg-primary-700"
                                                >
                                                    Go Home
                                                </Link>
                                            </div>
                                        </div>
                                    }
                                />
                            </Routes>
                        </main>

                        {/* Footer */}
                        <footer className="mt-12 border-t bg-background">
                            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                                <p className="text-center text-sm text-text">
                                    © {new Date().getFullYear()} MiniBlog. All
                                    rights reserved.
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
