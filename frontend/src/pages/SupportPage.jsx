import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/common/Loader';

const SupportPage = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <Loader />;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container mx-auto px-6 py-12 min-h-screen">
            <div className="card max-w-4xl mx-auto border border-cream-dark">
                <h1 className="text-4xl font-bold text-charcoal mb-8 border-b-2 border-secondary pb-4">
                    Customer Support
                </h1>

                <div className="space-y-6">
                    {/* Contact Information */}
                    <div className="bg-cream rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-charcoal mb-6">Get in Touch</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl p-6 border border-cream-dark">
                                <div className="flex items-center gap-3 mb-3">
                                    <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <h3 className="text-lg font-bold text-charcoal">Phone Support</h3>
                                </div>
                                <p className="text-gray-600 mb-2">Call us at:</p>
                                <p className="text-primary font-bold text-xl">
                                    <a href="tel:+919733257431" className="hover:text-primary-dark transition-colors">+91 9733257431</a>
                                </p>
                                <p className="text-primary font-bold text-xl">
                                    <a href="tel:+919593295965" className="hover:text-primary-dark transition-colors">+91 9593295965</a>
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-cream-dark">
                                <div className="flex items-center gap-3 mb-3">
                                    <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <h3 className="text-lg font-bold text-charcoal">Email Support</h3>
                                </div>
                                <p className="text-gray-600 mb-2">Email us at:</p>
                                <p className="text-primary font-bold text-lg">
                                    <a href="mailto:kmondalstore@gmail.com" className="hover:text-primary-dark transition-colors">kmondalstore@gmail.com</a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Store Location */}
                    <div className="bg-cream rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-charcoal mb-6">Visit Our Store</h2>
                        <div className="bg-white rounded-xl p-6 border border-cream-dark">
                            <div className="flex items-start gap-3">
                                <svg className="w-8 h-8 text-secondary flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div>
                                    <h3 className="text-lg font-bold text-charcoal mb-2">K Mondal Store</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Santimore, Kalabari Road<br />
                                        Banarhat, Jalpaiguri<br />
                                        West Bengal, India - 735202
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Business Hours */}
                    <div className="bg-cream rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-charcoal mb-6">Business Hours</h2>
                        <div className="bg-white rounded-xl p-6 border border-cream-dark">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center pb-3 border-b border-cream-dark">
                                    <span className="font-semibold text-charcoal">Monday - Saturday</span>
                                    <span className="text-primary font-bold">6:00 AM - 11:45 AM & 3:00 PM - 9:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-charcoal">Sunday</span>
                                    <span className="text-primary font-bold">6:00 AM - 9:00 AM & 3:00 PM - 9:00 PM</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Note */}
                    <div className="bg-secondary/10 border-2 border-secondary rounded-xl p-6 text-center">
                        <p className="text-gray-600 text-lg">
                            <strong>Note:</strong> Live chat and ticket support system coming soon!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
