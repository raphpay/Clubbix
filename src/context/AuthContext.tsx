import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
} from "firebase/auth";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { auth } from "../config/firebase";
import { getUser, User } from "../services/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (user: User) => {
    setIsAuthenticated(true);
    setUser(user);
  };

  const logout = useCallback(async () => {
    setIsAuthenticated(false);
    setUser(null);
    await auth.signOut();
  }, []);

  const updateUser = (user: User) => {
    setUser(user);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        const unsubscribe = onAuthStateChanged(auth, async (firUser) => {
          if (firUser) {
            try {
              const appUser = await getUser(firUser.uid);
              if (appUser) {
                setUser(appUser);
                setIsAuthenticated(true);
              } else {
                setUser(null);
                setIsAuthenticated(false);
              }
            } catch (err) {
              // ... handle error getting user profile
              setUser(null);
              setIsAuthenticated(false);
            }
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
          setLoading(false);
        });
        return () => unsubscribe();
      } catch (error) {
        // Handle persistence error
        console.error("Failed to set persistence", error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, updateUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
