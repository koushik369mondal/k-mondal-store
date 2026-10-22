import React from 'react';

const Loader = ({ label = 'Loading products...' }) => {
    return (
        <div className="flex flex-col justify-center items-center min-h-[360px] space-y-4">
            <div
                className="w-8 h-8 rounded-full border-2 border-border border-t-foreground animate-spin"
                role="status"
                aria-label="Loading"
            />
            <p className="font-montserrat text-xs sm:text-sm text-muted-foreground font-medium">
                {label}
            </p>
        </div>
    );
};

export default Loader;
