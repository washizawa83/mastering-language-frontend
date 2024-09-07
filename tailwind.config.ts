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
                light: '#f4f4f5',
                dark: '#525252',
            },
            medium: {
                light: '#e4e4e7',
                dark: '#404040',
            },
            deep: {
                light: '#d4d4d8',
                dark: '#262626',
            },
            profound: {
                light: '#a1a1aa',
                dark: '#171717',
            },
            abyssal: {
                light: '#71717a',
                dark: '#0a0a0a',
            },
            typography: {
                light: '#020617',
                dark: '#e5e7eb',
            },
            success: '#4ade80',
            danger: '#f43f5e',
        },
    },
    plugins: [],
    darkMode: 'class',
}
export default config
