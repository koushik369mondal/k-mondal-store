import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, ArrowUpRight } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const response = await login(email, password);
            if (response.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-20 flex items-center justify-center min-h-[70vh]">
            <div className="card-chai w-full max-w-md p-6 sm:p-8 space-y-6">
                <div className="text-center space-y-1.5">
                    <h1 className="font-montserrat text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                        Sign in
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        Enter your credentials to access your orders and account
                    </p>
                </div>

                {errorMsg && (
                    <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-500 text-xs sm:text-sm">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-foreground">
                            Email address
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full px-3.5 py-2 rounded-lg border border-card-edge bg-card-fill text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand/70 focus:ring-1 focus:ring-brand/40 transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-foreground">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                className="w-full px-3.5 py-2 pr-10 rounded-lg border border-card-edge bg-card-fill text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand/70 focus:ring-1 focus:ring-brand/40 transition-colors"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-asym inline-flex h-10 w-full items-center justify-center gap-2 bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold text-sm hover:bg-black/90 dark:hover:bg-neutral-200 transition-colors disabled:opacity-70 mt-2"
                    >
                        <span>{loading ? 'Signing in...' : 'Sign in'}</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="pt-2 text-center text-xs text-muted-foreground">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-foreground hover:text-brand font-medium transition-colors underline">
                        Register here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
