import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-dark text-white mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">K Mondal Store</h3>
                        <p className="text-gray-300">
                            Your trusted local kirana store in Banarhat, Jalpaiguri
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                        <p className="text-gray-300">Phone: +91 9733257431</p>
                        <p className="text-gray-300">Phone: +91 9593295965</p>
                        <p className="text-gray-300">Email: kmondalstore@gmail.com</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4">Location</h3>
                        <p className="text-gray-300">
                            K Mondal Store<br />
                            Santimore, Kalabari Road<br />
                            Banarhat, Jalpaiguri<br />
                            West Bengal, India - 735202
                        </p>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold mb-2">Business Hours</h4>
                            <p className="text-gray-300 text-sm">Monday - Friday: 8:00 AM - 9:00 PM</p>
                            <p className="text-gray-300 text-sm">Saturday: 8:00 AM - 10:00 PM</p>
                            <p className="text-gray-300 text-sm">Sunday: 8:00 AM - 8:00 PM</p>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="text-gray-300 text-sm">
                                © {new Date().getFullYear()} K Mondal Store. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
