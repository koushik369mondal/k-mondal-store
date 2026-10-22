import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative mt-auto font-montserrat px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16 before:absolute before:top-0 before:left-0 before:h-px before:w-full before:bg-amber-600 before:opacity-10 before:[mask-image:linear-gradient(90deg,transparent_0%,black_35%,black_65%,transparent_100%)] dark:before:bg-orange-300">
            <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10">
                    {/* Brand Column */}
                    <div className="space-y-3">
                        <span className="font-brand text-lg sm:text-xl font-medium tracking-tight text-foreground block">
                            K Mondal Store
                        </span>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            Your trusted local kirana store in Santimore, Banarhat, delivering fresh daily groceries and household essentials.
                        </p>
                        <p className="text-xs text-muted-foreground pt-1">
                            Owned by <span className="text-foreground font-medium">Kamakhya Mandal</span>
                        </p>
                    </div>

                    {/* Contact Column */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-foreground">Contact</h4>
                        <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                            <a
                                href="tel:+919733257431"
                                className="flex items-center gap-2 hover:text-brand transition-colors"
                            >
                                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                <span>+91 9733257431</span>
                            </a>
                            <a
                                href="tel:+919593295965"
                                className="flex items-center gap-2 hover:text-brand transition-colors"
                            >
                                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                <span>+91 9593295965</span>
                            </a>
                            <a
                                href="mailto:kmondalstore@gmail.com"
                                className="flex items-center gap-2 hover:text-brand transition-colors"
                            >
                                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                                <span>kmondalstore@gmail.com</span>
                            </a>
                        </div>
                    </div>

                    {/* Location Column */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-foreground">Location</h4>
                        <div className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <div>
                                <p>Santimore, Kalabari Road</p>
                                <p>Banarhat, Jalpaiguri</p>
                                <p>West Bengal, India 735202</p>
                            </div>
                        </div>
                    </div>

                    {/* Business Hours Column */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-foreground">Store hours</h4>
                        <div className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-foreground font-medium">Monday to Saturday</p>
                                <p className="text-xs mb-2">6:00 AM to 11:45 AM, 3:00 PM to 9:00 PM</p>
                                <p className="text-foreground font-medium">Sunday</p>
                                <p className="text-xs">6:00 AM to 9:00 AM, 3:00 PM to 9:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subfooter */}
                <div className="mt-10 sm:mt-12 pt-6 border-t border-card-edge flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <p>© {new Date().getFullYear()} K Mondal Store. All rights reserved.</p>
                    <p>Designed with ChaiUI</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
