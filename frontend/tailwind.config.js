/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2E7D32',
                secondary: '#F0A01A',
                'light-green': '#81C784',
                'soft-gold': '#F4B350',
                'neutral-white': '#F7F7F7',
                dark: '#2B2B2B'
            }
        },
    },
    plugins: [],
}
