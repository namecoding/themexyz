// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
    title: 'Already made websites, wordpress themes, website templates from Themeleaf',
    description: 'Already made websites, wordpress themes, website templates from Themeleaf',
    generator: 'namecoding.net',
    icons: {
    icon: [
      { url: '/favicon.png', type: 'image/x-icon' }
    ]
  },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}
