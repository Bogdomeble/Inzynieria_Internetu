import  {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from 'react';
import { authApi } from '../lib/api';

interface User {
    id: string;
    username: string;
    email?: string;
    role: string;
    userId?: string;
}

interface AuthContextType {
    user: User | null;
    login: ( user: User) => void; // token juz nie jest tutaj potrzebny
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Przy starcie aplikacji sprawdź token
    useEffect(() => {
const checkAuth = async () => {
      try {
        // Próba pobrania profilu. 
        // Jeśli ciasteczko HttpOnly istnieje i jest poprawne, dostaniemy usera.
        const userData = await authApi.getProfile();
        
        // Mapowanie danych jeśli backend zwraca userId zamiast id
        const normalizedUser = {
            ...userData,
            id: userData.id || userData.userId 
        };
        
        setUser(normalizedUser);
      } catch (error) {

        // (401 Unauthorized), znaczy że nie jesteśmy zalogowani

        // lub token wygasł. Czyścimy usera.

        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

        checkAuth();
    }, []);

const login = (newUser: User) => {
        // Nie zapisujemy już tokena
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
    };

    const logout = async () => {
        try {
            await authApi.logout(); // Wywołujemy backend, żeby usunął ciasteczko
        } catch (error) {
            console.error('Logout failed', error);
                        setUser(null);

        } finally {
            // czyścimy frontend niezależnie od wyniku backendu
            // dodatkowo czyscimy dane query
        window.location.reload();
        }
    }

return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {isLoading ? (
          <div style={{ 
              height: '100vh', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              backgroundColor: '#0d080a', 
              color: 'white',
              fontSize: '1.5rem'
          }}>
              Loading session...
          </div>
      ) : (
          children
      )}
    </AuthContext.Provider>
  );
}



export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}