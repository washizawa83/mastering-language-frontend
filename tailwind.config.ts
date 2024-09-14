import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
            },
        },
        colors: {
            shallow: {
                light: '#fafafa',
                dark: '#525252',
            },
            medium: {
                light: '#f4f4f5',
                dark: '#404040',
            },
            deep: {
                light: '#e4e4e7',
                dark: '#262626',
            },
            profound: {
                light: '#d4d4d8',
                dark: '#171717',
            },
            abyssal: {
                light: '#a1a1aa',
                dark: '#0a0a0a',
            },
            typography: {
                light: '#020617',
                dark: '#e5e7eb',
            },
            success: '#22c55e',
            danger: '#f43f5e',
            transparent: 'transparent',
            focus: '#6366f1',
            error: '#e11d48',
            nav: '#818cf8',
            teal: '#4da6a6',
            flowerBlue: '#6495ed',
        },
    },
    plugins: [],
    darkMode: 'class',
}
export default config
