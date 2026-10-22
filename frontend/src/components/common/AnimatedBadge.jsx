import React from 'react';

/**
 * ChaiUI Animated badge with the 1px orange glint running round the border.
 */
export function AnimatedBadge({ children, className = '' }) {
    return (
        <span className={`relative inline-flex w-fit overflow-hidden rounded-full p-px ${className}`}>
            <span
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 h-6 w-[320px] rounded-full bg-gradient-to-r from-transparent via-transparent to-orange-500 motion-safe:animate-[chai-spin_4s_linear_infinite]"
                style={{ transform: 'translate(-50%,-50%)' }}
            />
            <span className="relative z-10 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs sm:text-sm font-medium text-neutral-800 dark:bg-stone-900 dark:text-neutral-100 border border-card-edge">
                {children}
            </span>
        </span>
    );
}

export default AnimatedBadge;
