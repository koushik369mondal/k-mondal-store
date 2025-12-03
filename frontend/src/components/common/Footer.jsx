import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-charcoal text-cream mt-auto border-t-4 border-secondary">
            <div className="container mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-secondary">K Mondal Store</h3>
                        <p className="text-cream/80 text-sm leading-relaxed">
                            Your trusted local kirana store in, Santimore, Banarhat, Jalpaiguri
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4 text-secondary">Contact Us</h3>
                        <p className="text-cream/80 text-sm mb-1">Phone: +91 9733257431</p>
                        <p className="text-cream/80 text-sm mb-1">Phone: +91 9593295965</p>
                        <p className="text-cream/80 text-sm">Email: kmondalstore@gmail.com</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4 text-secondary">Location</h3>
                        <p className="text-cream/80 text-sm leading-relaxed">
                            K Mondal Store<br />
                            Santimore, Kalabari Road<br />
                            Banarhat, Jalpaiguri<br />
                            West Bengal, India - 735202
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4 text-secondary">Business Hours</h3>
                        <p className="text-cream/80 text-sm mb-2">Mon - Sat: 6:00 AM - 11:45 AM & 3:00 PM - 9:00 PM</p>
                        <p className="text-cream/80 text-sm">Sunday: 6:00 AM - 9:00 AM & 3:00 PM - 9:00 PM</p>
                    </div>

                </div>

                <div className="mt-8 pt-6 border-t border-cream/20 text-center">
                    <p className="text-cream/70 text-sm">
                        © {new Date().getFullYear()} K Mondal Store. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
