import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { BlogPage } from "./pages/BlogPage";
import {PostDetailPage} from "./pages/PostDetailPage";
// Create a client
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

console.log("App component initializing"); // Debug log

function App() {
  console.log("App component rendering"); // Debug log

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          {/* Navigation */}
          <nav className="bg-background shadow">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">

                  <Link
                    to="/"
                    className="flex items-center text-xl font-bold text-primary-foreground"
                  >

                    Blog App
                  </Link>

                </div>
                <div className="flex items-center space-x-4">
                  <Link
                    to="/create"
                    className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-text hover:bg-primary-700"
                  >
                    Create Post
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">
              <Routes>
                  <Route path="/" element={<BlogPage />} />
                  <Route path="/posts/:slug" element={<PostDetailPage />} />
                  <Route
                      path="*"
                      element={
                          <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                              <div className="text-center">
                                  <h2 className="text-2xl font-bold text-primary-foreground">
                                      404 - Page Not Found
                                  </h2>
                                  <p className="mt-2 text-text">
                                      The page you're looking for doesn't exist.
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
                © {new Date().getFullYear()} Blog App. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
