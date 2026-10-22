/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Manrope', 'system-ui', 'sans-serif'],
                montserrat: ['Montserrat', 'system-ui', 'sans-serif'],
                brand: ['Onest', 'system-ui', 'sans-serif'],
                mono: ['Geist Mono', 'monospace'],
            },
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                card: {
                    DEFAULT: 'var(--card)',
                    foreground: 'var(--card-foreground)',
                },
                popover: {
                    DEFAULT: 'var(--popover)',
                    foreground: 'var(--popover-foreground)',
                },
                primary: {
                    DEFAULT: 'var(--primary)',
                    foreground: 'var(--primary-foreground)',
                },
                secondary: {
                    DEFAULT: 'var(--secondary)',
                    foreground: 'var(--secondary-foreground)',
                },
                muted: {
                    DEFAULT: 'var(--muted)',
                    foreground: 'var(--muted-foreground)',
                },
                accent: {
                    DEFAULT: 'var(--accent)',
                    foreground: 'var(--accent-foreground)',
                },
                border: 'var(--border)',
                input: 'var(--input)',
                ring: 'var(--ring)',
                brand: 'var(--brand)',
                highlight: 'var(--highlight)',
                'card-edge': 'var(--card-edge)',
                'card-edge-hover': 'var(--card-edge-hover)',
                'card-fill': 'var(--card-fill)',
            },
            borderRadius: {
                xl: 'calc(var(--radius) + 4px)',
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                'chai-spin': {
                    to: { transform: 'translate(-50%, -50%) rotate(360deg)' },
                },
                'chai-bounce': {
                    '0%, 100%': { transform: 'translateY(-6%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
                    '50%': { transform: 'none', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
            animation: {
                'chai-spin': 'chai-spin 4s linear infinite',
                'chai-bounce': 'chai-bounce 2s infinite',
                fadeIn: 'fadeIn 0.2s ease-in',
                slideUp: 'slideUp 0.25s ease-out',
            },
        },
    },
    plugins: [],
}

