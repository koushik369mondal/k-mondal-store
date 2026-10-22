import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * chaicode.com's half-shaded circle theme switch.
 * One label for both themes: the server cannot know the stored theme,
 * and a label that depends on it mismatches on hydration.
 */
export function ThemeSwitcher({ className = '' }) {
    const { toggle } = useTheme();

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label="Toggle theme"
            title="Toggle theme"
            className={`inline-flex w-9 h-9 cursor-pointer items-center justify-center rounded-md text-foreground transition-colors duration-200 outline-none hover:text-brand focus-visible:ring-2 focus-visible:ring-ring ${className}`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="w-5 h-5"
            >
                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                <path d="M12 3l0 18" />
                <path d="M12 9l4.65 -4.65" />
                <path d="M12 14.3l7.37 -7.37" />
                <path d="M12 19.6l8.85 -8.85" />
            </svg>
        </button>
    );
}

export default ThemeSwitcher;
