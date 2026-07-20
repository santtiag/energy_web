import type { Metadata } from 'next';
import { Fraunces, Public_Sans } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import '@/styles/globals.css';

const fraunces = Fraunces({
    subsets: ['latin'],
    variable: '--font-fraunces',
    axes: ['opsz'],
});

const publicSans = Public_Sans({
    subsets: ['latin'],
    variable: '--font-public-sans',
});

export const metadata: Metadata = {
    title: 'Energy Analytics',
    description: 'Sistema de monitoreo energético',
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}})()`;

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
            </head>
            <body className={`${fraunces.variable} ${publicSans.variable} font-sans`}>
                <AuthProvider>
                    <ThemeProvider>{children}</ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
