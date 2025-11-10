import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const GoogleIcon: React.FC = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.485 11.23C34.566 7.72 29.63 5.5 24 5.5C11.798 5.5 2 14.798 2 27s9.798 21.5 22 21.5c11.026 0 21.059-8.384 21.059-21.059c0-1.223-.11-2.42-.318-3.593z"></path>
        <path fill="#FF3D00" d="M6.306 14.691c-1.464 2.84-2.306 6.059-2.306 9.491c0 3.432 .842 6.65 2.306 9.491l-6.012 4.758C.131 34.116 0 29.626 0 25s.131-9.116 2.294-13.558l6.012 4.249z"></path>
        <path fill="#4CAF50" d="M24 48c5.63 0 10.566-1.72 14.485-4.77l-5.99-4.738c-2.488 1.66-5.57 2.65-8.495 2.65c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.485 11.23C34.566 7.72 29.63 5.5 24 5.5C11.798 5.5 2 14.798 2 27s9.798 21.5 22 21.5z"></path>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.485 11.23C34.566 7.72 29.63 5.5 24 5.5C11.798 5.5 2 14.798 2 27s9.798 21.5 22 21.5c11.026 0 21.059-8.384 21.059-21.059c0-1.223-.11-2.42-.318-3.593z"></path>
    </svg>
);


const LoginDialog: React.FC<LoginDialogProps> = ({ isOpen, onClose }) => {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, signup, signInWithGoogle } = useAuth();

    useEffect(() => {
        // Reset state when dialog opens
        if (isOpen) {
            setMode('login');
            setName('');
            setEmail('');
            setPassword('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'login') {
            if (email && password) {
                login(email);
                onClose();
            } else {
                alert('Please enter email and password.');
            }
        } else { // signup mode
            if (name && email && password) {
                signup(name, email);
                onClose();
            } else {
                alert('Please fill in all fields.');
            }
        }
    };

    const handleGoogleSignIn = () => {
        signInWithGoogle();
        onClose();
    };
    
    const toggleMode = () => {
        setMode(prevMode => prevMode === 'login' ? 'signup' : 'login');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="login-dialog-title">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 sm:p-8" onClick={e => e.stopPropagation()}>
                <h2 id="login-dialog-title" className="text-2xl font-bold text-center text-[#0c4b83] mb-2">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                <p className="text-center text-gray-600 text-sm mb-6">{mode === 'login' ? 'Log in to manage your bookings.' : 'Get started with your free account.'}</p>
                
                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full flex justify-center items-center p-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-4"
                >
                    <GoogleIcon />
                    Sign in with Google
                </button>

                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-xs text-gray-400 font-semibold">OR</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                    {mode === 'signup' && (
                         <div>
                            <label htmlFor="login-name" className="text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                id="login-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 w-full p-3 border-2 border-gray-200 rounded-md text-sm transition focus:outline-none focus:border-[#0c4b83]"
                                placeholder="John Doe"
                                required
                                autoComplete="name"
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor="login-email" className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full p-3 border-2 border-gray-200 rounded-md text-sm transition focus:outline-none focus:border-[#0c4b83]"
                            placeholder="you@example.com"
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div>
                        <label htmlFor="login-password"  className="text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full p-3 border-2 border-gray-200 rounded-md text-sm transition focus:outline-none focus:border-[#0c4b83]"
                            placeholder="••••••••"
                            required
                            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                        />
                    </div>
                     <div className="text-xs text-gray-500 text-center pt-2 h-4">
                        {mode === 'login' && <p>For demo, any email/password will work.</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-2 p-3.5 bg-gradient-to-br from-[#0c4b83] to-[#1a6aaf] text-white font-semibold rounded-lg transition-transform transform hover:-translate-y-0.5"
                    >
                        {mode === 'login' ? 'Login' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={toggleMode} className="font-semibold text-[#0c4b83] hover:underline ml-1">
                        {mode === 'login' ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginDialog;