/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0F3D2E',
                    light: '#1A5A45',
                    dark: '#0A2A1F',
                },
                secondary: {
                    DEFAULT: '#F0A01A',
                    light: '#FFB84D',
                },
                cream: {
                    DEFAULT: '#FDF7EB',
                    dark: '#F5EDDB',
                },
                charcoal: '#1A1A1A',
            },
            boxShadow: {
                'premium': '0 4px 20px rgba(15, 61, 46, 0.1)',
                'premium-lg': '0 8px 30px rgba(15, 61, 46, 0.15)',
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
            },
            keyframes: {
                'slide-up': {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'bounce-slow': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
            },
            animation: {
                'slide-up': 'slide-up 0.3s ease-out',
                'bounce-slow': 'bounce-slow 2s ease-in-out infinite',
            },
        },
    },
    plugins: [],
}
