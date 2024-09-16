'use client'
import { createContext, useContext, useEffect, useState } from 'react'

import { LoadingComponent } from '@/app/_components/Loading'
import { Footer } from '@/app/_layouts/Footer'
import { Header } from '@/app/_layouts/Header'
import { AuthProvider } from '@/app/providers/AuthProvider'
import { LayoutProvider } from '@/app/providers/LayoutProvider'
import { CookiesProvider } from 'react-cookie'
import './globals.css'

type ThemeContextType = {
    theme: string
    toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
    undefined,
)

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
            setTheme(savedTheme || 'light')
        }
    }, [])

    useEffect(() => {
        if (theme) {
            localStorage.setItem('theme', theme)
        }
    }, [theme])

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    return (
        <html lang="en" className={theme}>
            <body className="tracking-wider bg-medium-light dark:bg-medium-dark">
                <ThemeContext.Provider value={{ theme, toggleTheme }}>
                    <CookiesProvider>
                        <LayoutProvider>
                            <AuthProvider>
                                <Header />
                                <LoadingComponent />
                                {children}
                                <Footer />
                            </AuthProvider>
                        </LayoutProvider>
                    </CookiesProvider>
                </ThemeContext.Provider>
            </body>
        </html>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
