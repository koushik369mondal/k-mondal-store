import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';

const SupportPage = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <Loader />;
    if (!user) return <Navigate to="/login" />;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
            <div className="border-b border-card-edge pb-4">
                <h1 className="font-montserrat text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                    Customer support
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Reach out for order inquiries, delivery assistance, or local kirana questions
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Phone Support */}
                <div className="card-chai p-6 space-y-3">
                    <div className="w-10 h-10 rounded-lg border border-card-edge bg-muted/20 flex items-center justify-center text-foreground">
                        <Phone className="w-5 h-5 text-brand" />
                    </div>
                    <h2 className="font-montserrat text-base sm:text-lg font-semibold text-foreground">
                        Phone support
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        Call Kamakhya Mandal directly for immediate delivery assistance:
                    </p>
                    <div className="pt-1 space-y-1">
                        <a
                            href="tel:+919733257431"
                            className="font-montserrat text-sm sm:text-base font-semibold text-foreground hover:text-brand transition-colors block"
                        >
                            +91 9733257431
                        </a>
                        <a
                            href="tel:+919593295965"
                            className="font-montserrat text-sm sm:text-base font-semibold text-foreground hover:text-brand transition-colors block"
                        >
                            +91 9593295965
                        </a>
                    </div>
                </div>

                {/* Email Support */}
                <div className="card-chai p-6 space-y-3">
                    <div className="w-10 h-10 rounded-lg border border-card-edge bg-muted/20 flex items-center justify-center text-foreground">
                        <Mail className="w-5 h-5 text-brand" />
                    </div>
                    <h2 className="font-montserrat text-base sm:text-lg font-semibold text-foreground">
                        Email support
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        Send questions, invoices, or feedback to our store inbox:
                    </p>
                    <div className="pt-1">
                        <a
                            href="mailto:kmondalstore@gmail.com"
                            className="font-montserrat text-sm sm:text-base font-semibold text-foreground hover:text-brand transition-colors"
                        >
                            kmondalstore@gmail.com
                        </a>
                    </div>
                </div>

                {/* Physical Store Location */}
                <div className="card-chai p-6 space-y-3">
                    <div className="w-10 h-10 rounded-lg border border-card-edge bg-muted/20 flex items-center justify-center text-foreground">
                        <MapPin className="w-5 h-5 text-brand" />
                    </div>
                    <h2 className="font-montserrat text-base sm:text-lg font-semibold text-foreground">
                        Store location
                    </h2>
                    <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        <p className="text-foreground font-medium">K Mondal Store</p>
                        <p>Santimore, Kalabari Road</p>
                        <p>Banarhat, Jalpaiguri</p>
                        <p>West Bengal, India 735202</p>
                    </div>
                </div>

                {/* Operating Hours */}
                <div className="card-chai p-6 space-y-3">
                    <div className="w-10 h-10 rounded-lg border border-card-edge bg-muted/20 flex items-center justify-center text-foreground">
                        <Clock className="w-5 h-5 text-brand" />
                    </div>
                    <h2 className="font-montserrat text-base sm:text-lg font-semibold text-foreground">
                        Operating hours
                    </h2>
                    <div className="text-xs sm:text-sm text-muted-foreground space-y-2">
                        <div>
                            <p className="font-medium text-foreground">Monday to Saturday</p>
                            <p className="text-xs">6:00 AM to 11:45 AM, 3:00 PM to 9:00 PM</p>
                        </div>
                        <div>
                            <p className="font-medium text-foreground">Sunday</p>
                            <p className="text-xs">6:00 AM to 9:00 AM, 3:00 PM to 9:00 PM</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Assistant Banner */}
            <div className="card-chai p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-lg border border-card-edge bg-card-fill text-foreground">
                        <MessageSquare className="w-5 h-5 text-brand" />
                    </div>
                    <div>
                        <h3 className="font-montserrat text-sm font-semibold text-foreground">Need quick answers?</h3>
                        <p className="text-xs text-muted-foreground">Use the store assistant widget in the bottom right corner of any page.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
