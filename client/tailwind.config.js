// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                text: {
                    DEFAULT: 'rgb(var(--text) / <alpha-value>)',
                    muted: 'rgb(var(--text-muted) / <alpha-value>)',
                },
                primary: {
                    DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
                    foreground:
                        'rgb(var(--primary-foreground) / <alpha-value>)',
                    600: 'rgb(var(--primary) / 0.9)',
                    700: 'rgb(var(--primary) / 0.8)',
                },
                secondary: {
                    DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
                    foreground:
                        'rgb(var(--secondary-foreground) / <alpha-value>)',
                },
                background: 'rgb(var(--background) / <alpha-value>)',
                foreground: 'rgb(var(--foreground) / <alpha-value>)',
                accent: {
                    DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
                    foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
                },
                card: {
                    DEFAULT: 'rgb(var(--card) / <alpha-value>)',
                    foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
                },
                destructive: {
                    DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
                    foreground:
                        'rgb(var(--destructive-foreground) / <alpha-value>)',
                },
            },
            spacing: {
                container: '2rem',
                'container-lg': '4rem',
            },
            maxWidth: {
                container: '80rem',
            },
        },
    },
    plugins: [],
};
