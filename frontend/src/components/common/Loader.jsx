import React from 'react';

const Loader = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-secondary"></div>
            <p className="mt-6 text-charcoal font-semibold text-lg">Loading...</p>
        </div>
    );
};

export default Loader;
