import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
} from "firebase/auth";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { getUser, User } from "../services/auth";

setPersistence(auth, browserLocalPersistence);

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
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

  const login = (user: User) => {
    setIsAuthenticated(true);
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("user");
    auth.signOut();
  };

  const updateUser = (user: User) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firUser) => {
      if (firUser) {
        // Fetch your custom user profile from Firestore
        try {
          const appUser = await getUser(firUser.uid);
          setUser(appUser);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(appUser));
        } catch (err) {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("user");
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
