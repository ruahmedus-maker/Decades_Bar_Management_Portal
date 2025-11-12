import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DecadesBanner from '@/components/DecadesBanner';
import PWAInstaller from '@/components/PWAInstaller';
import InstallPrompt from '@/components/InstallPrompt';
import MigrationHandler from '@/components/MigrationHandler';


const inter = Inter({ 
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Decades Bar Training Portal",
  description: "Training & Procedures Portal for Decades Bar Staff",
  manifest: "/manifest.json",
  themeColor: "#2DD4BF",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Decades Bar",
  },
};

// FIXED: Move themeColor to viewport instead of metadata
export const viewport: Viewport = {
  themeColor: "#2DD4BF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2DD4BF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Decades Bar" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        
        {/* Enhanced Mobile Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Additional PWA Tags */}
        <meta name="application-name" content="Decades Bar" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#2DD4BF" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body 
        className={inter.className}
        style={{ 
          margin: 0, 
          padding: 0,
          minHeight: '100vh',
          fontFamily: 'system-ui, sans-serif',
          background: 'transparent',
          overflowX: 'hidden',
        }}
      >
        <DecadesBanner />
        <div style={{ 
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          background: 'transparent',
        }}>
          {children}
        </div>
        
        {/* PWA Components */}
        <PWAInstaller />
        <InstallPrompt />
        <MigrationHandler />
      </body>
    </html>
  );
}