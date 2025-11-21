import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DecadesBanner from '@/components/DecadesBanner';
import PWAInstaller from '@/components/PWAInstaller';
import InstallPrompt from '@/components/InstallPrompt';
import ChunkErrorHandler from '@/components/ChunkErrorHandler';
import VersionChecker from '@/components/VersionChecker';
import VersionDisplay from '@/components/VersionDisplay';
import { getBuildInfo } from '@/lib/build-info';

const inter = Inter({ 
  subsets: ["latin"],
});

const buildInfo = getBuildInfo();

export const metadata: Metadata = {
  title: "Decades Bar Training Portal",
  description: "Training & Procedures Portal for Decades Bar Staff",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Decades Bar",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#2DD4BF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-build={buildInfo.id}>
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Enhanced Safari PWA Support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Decades Bar" />
        
        {/* Safari Icons */}
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icon-167x167.png" />
        
        {/* Safari Splash Screens */}
        <link rel="apple-touch-startup-image" href="/splash-640x1136.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splash-750x1334.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splash-1242x2208.png" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)" />
        
        {/* Enhanced Mobile Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Additional PWA Tags */}
        <meta name="application-name" content="Decades Bar" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#2DD4BF" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Build Info */}
        <meta name="build-id" content={buildInfo.id} />
        <meta name="build-time" content={buildInfo.time} />
        
        {/* Cache Prevention */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
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
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          KhtmlUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          userSelect: 'none',
        }}
      >
        {/* Version Display - Remove this after testing */}
        <VersionDisplay />
        
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
        
        {/* Chunk Error Handler */}
        <ChunkErrorHandler />
        
        {/* Version Checker - Fixed to prevent loops */}
        <VersionChecker />
        
      </body>
    </html>
  );
}