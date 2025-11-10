import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    login: (email: string) => void;
    signup: (name: string, email: string) => void;
    signInWithGoogle: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Mock login function
    const login = (email: string) => {
        if (email) {
            // In a real app, you'd look up the user. Here, we'll generate a name.
            const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const mockUser: User = { id: `user_${email.replace(/@.*/, '')}`, email, name };
            setUser(mockUser);
        }
    };
    
    // Mock signup function
    const signup = (name: string, email: string) => {
        if (name && email) {
            const mockUser: User = { id: `user_${email.replace(/@.*/, '')}`, email, name };
            setUser(mockUser);
        }
    };
    
    // Mock Google Sign-In function
    const signInWithGoogle = () => {
        const mockUser: User = { 
            id: 'user_google_123', 
            email: 'google.user@example.com',
            name: 'Google User'
        };
        setUser(mockUser);
    };


    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, signInWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};