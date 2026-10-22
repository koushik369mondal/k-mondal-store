import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, ArrowUpRight } from 'lucide-react';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (formData.password !== formData.confirmPassword) {
            setErrorMsg('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setErrorMsg('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await signup(formData.name, formData.email, formData.password);
            navigate('/');
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-20 flex items-center justify-center min-h-[75vh]">
            <div className="card-chai w-full max-w-md p-6 sm:p-8 space-y-6">
                <div className="text-center space-y-1.5">
                    <h1 className="font-montserrat text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                        Create an account
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        Order groceries online with fast local Banarhat delivery
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
                            Full name
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-3.5 py-2 rounded-lg border border-card-edge bg-card-fill text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand/70 focus:ring-1 focus:ring-brand/40 transition-colors"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-foreground">
                            Email address
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-3.5 py-2 rounded-lg border border-card-edge bg-card-fill text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand/70 focus:ring-1 focus:ring-brand/40 transition-colors"
                            value={formData.email}
                            onChange={handleChange}
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
                                name="password"
                                required
                                minLength={6}
                                className="w-full px-3.5 py-2 pr-10 rounded-lg border border-card-edge bg-card-fill text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand/70 focus:ring-1 focus:ring-brand/40 transition-colors"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="At least 6 characters"
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

                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-foreground">
                            Confirm password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                required
                                className="w-full px-3.5 py-2 pr-10 rounded-lg border border-card-edge bg-card-fill text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand/70 focus:ring-1 focus:ring-brand/40 transition-colors"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-asym inline-flex h-10 w-full items-center justify-center gap-2 bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold text-sm hover:bg-black/90 dark:hover:bg-neutral-200 transition-colors disabled:opacity-70 mt-3"
                    >
                        <span>{loading ? 'Creating account...' : 'Create account'}</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="pt-2 text-center text-xs text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/login" className="text-foreground hover:text-brand font-medium transition-colors underline">
                        Sign in here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
