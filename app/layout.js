import './globals.css';
import { Inter } from 'next/font/google';
import { NavigationBar } from '@/components/navigation-bar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Lakes Explorer',
  description: 'Discover beautiful lakes around the world',
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={`${inter.className} water-gradient min-h-screen`}>
        <NavigationBar />
        <main>{children}</main>
      </body>
    </html>
  );
}