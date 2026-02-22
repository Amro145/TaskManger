"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import api from '../../utils/api';

export default function SigninPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/users/signin', { email, password });
            toast.success("Welcome back!");
            router.push('/');
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to sign in");
        } finally {
            setLoading(false);
        }
    }

    const handleGuestSignin = async () => {
        setLoading(true);
        try {
            await api.post('/users/signin', { email: 'guest@gmail.com', password: 'guest@gmail.com' });
            toast.success("Welcome, Guest!");
            router.push('/');
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to sign in as guest");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-900 via-neutral-950 to-neutral-950">
            <div className="w-full max-w-md p-8 space-y-8 bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Sign in</h2>
                    <p className="text-neutral-400">Welcome back! Please enter your details.</p>
                </div>

                <form onSubmit={handleSignin} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
                            <input
                                type="email"
                                required
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-neutral-500 text-white"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
                            <input
                                type="password"
                                required
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-neutral-500 text-white"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                    {/* Todo login as Guest  with email:guest@gmail.com and password:guest@gmail.com*/}
                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleGuestSignin}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
                        {loading ? 'Logging in as Guest...' : 'Login as Guest'}
                    </button>

                    <p className="text-center text-sm text-neutral-400">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}