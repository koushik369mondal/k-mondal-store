import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-dark text-white mt-auto">
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <h3 className="text-lg font-bold mb-2">K Mondal Store</h3>
                        <p className="text-gray-300 text-sm">
                            Your trusted local kirana store in Banarhat, Jalpaiguri
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-2">Contact Us</h3>
                        <p className="text-gray-300 text-sm">Phone: +91 9733257431</p>
                        <p className="text-gray-300 text-sm">Phone: +91 9593295965</p>
                        <p className="text-gray-300 text-sm">Email: kmondalstore@gmail.com</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-2">Location</h3>
                        <p className="text-gray-300 text-sm">
                            K Mondal Store<br />
                            Santimore, Kalabari Road<br />
                            Banarhat, Jalpaiguri<br />
                            West Bengal, India - 735202
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-2">Business Hours</h3>
                        <p className="text-gray-300 text-sm">Mon - Fri: 8:00 AM - 9:00 PM</p>
                        <p className="text-gray-300 text-sm">Saturday: 8:00 AM - 10:00 PM</p>
                        <p className="text-gray-300 text-sm">Sunday: 8:00 AM - 8:00 PM</p>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700 text-center">
                    <p className="text-gray-300 text-sm">
                        © {new Date().getFullYear()} K Mondal Store. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
