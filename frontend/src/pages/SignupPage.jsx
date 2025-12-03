import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (formData.password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            await signup(formData.name, formData.email, formData.password);
            alert('Account created successfully!');
            navigate('/');
        } catch (error) {
            alert('Signup failed: ' + (error.response?.data?.message || 'Something went wrong'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-20">
            <div className="card max-w-lg mx-auto border border-cream-dark">
                <h2 className="text-4xl font-bold text-center mb-10 text-charcoal">Create Account</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-base font-semibold mb-2 text-charcoal">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="input-field"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div>
                        <label className="block text-base font-semibold mb-2 text-charcoal">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="input-field"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="block text-base font-semibold mb-2 text-charcoal">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="input-field"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Minimum 6 characters"
                            minLength="6"
                        />
                    </div>

                    <div>
                        <label className="block text-base font-semibold mb-2 text-charcoal">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            className="input-field"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter your password"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full text-lg py-4">
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-center mt-8 text-gray-600 text-base">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:text-primary-light font-bold transition-colors underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
