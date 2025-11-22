'use client';

import DecadesBanner from '@/components/DecadesBanner';
import PWAInstaller from '@/components/PWAInstaller';
import InstallPrompt from '@/components/InstallPrompt';
import ChunkErrorHandler from '@/components/ChunkErrorHandler';
import VersionChecker from '@/components/VersionChecker';
import VersionDisplay from '@/components/VersionDisplay';
import ImageManager from '@/components/ImageManager';
import { useApp } from '@/contexts/AppContext';
import { Inter } from "next/font/google";

const inter = Inter({ 
  subsets: ["latin"],
});

export default function ClientBody({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useApp();

  return (
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
      
      {/* Image Manager - Only show for admins */}
      {isAdmin && <ImageManager />}
    </body>
  );
}