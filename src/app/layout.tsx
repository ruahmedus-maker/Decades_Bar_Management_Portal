import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DecadesBanner from '@/components/DecadesBanner';
import PWAInstaller from '@/components/PWAInstaller';
import InstallPrompt from '@/components/InstallPrompt';
import ChunkErrorHandler from '@/components/ChunkErrorHandler';

const inter = Inter({ 
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Decades Bar Training Portal",
  description: "Training & Procedures Portal for Decades Bar Staff",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent", // Changed for Safari
    title: "Decades Bar",
  },
  // Added for Safari compatibility
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
  // Safari-specific viewport settings
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Generate a unique build ID for cache busting
  const buildId = `build-${Date.now()}`;

  return (
    <html lang="en">
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
        
        {/* Enhanced Cache Prevention */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate, max-age=0" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta httpEquiv="Expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
        
        {/* Version-based cache busting */}
        <meta name="version" content={buildId} />
        
        {/* Cache busting for CSS and JS */}
        <link rel="stylesheet" href={`/globals.css?v=${buildId}`} />
        
        {/* Prevent search engine caching */}
        <meta name="robots" content="noarchive" />
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
          // Safari-specific body styles
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          KhtmlUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          userSelect: 'none',
        }}
        data-build={buildId}
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
        
        {/* Chunk Error Handler */}
        <ChunkErrorHandler />
        
        {/* Cache busting script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Force cache refresh on page load
              if (performance.navigation.type === 1) {
                // Page was reloaded
                console.log('Page reload detected - ensuring fresh content');
              }
              
              // Additional cache busting for service worker
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.update();
                  }
                });
              }
              
              // Version check for cache busting
              const currentBuild = '${buildId}';
              const storedBuild = localStorage.getItem('app-build');
              
              if (storedBuild !== currentBuild) {
                console.log('New build detected, clearing caches');
                localStorage.setItem('app-build', currentBuild);
                
                // Clear various caches
                if ('caches' in window) {
                  caches.keys().then(function(names) {
                    for (let name of names) {
                      caches.delete(name);
                    }
                  });
                }
              }
            `,
          }}
        />
      </body>
    </html>
  );
}