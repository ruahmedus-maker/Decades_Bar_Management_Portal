// DecadesBanner.tsx - RESTORED ORIGINAL VERSION
'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

const bannerImages = [
  'https://waclqm1d0d2eutah.public.blob.vercel-storage.com/banner-main5.jpg',
  'https://waclqm1d0d2eutah.public.blob.vercel-storage.com/banner-main2.jpg',
  'https://waclqm1d0d2eutah.public.blob.vercel-storage.com/banner-main4.jpg',
  'https://waclqm1d0d2eutah.public.blob.vercel-storage.com/banner-main3.jpg',
  'https://waclqm1d0d2eutah.public.blob.vercel-storage.com/banner-main.jpg',
];

export default function DecadesBanner() {
  const { currentUser } = useApp();
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    // Only run rotater if we don't have a user (login page)
    if (!currentUser && bannerImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  // Performance Optimization: If logged in, show a solid black background
  // This removes heavy image rendering and filters from the main utility app
  if (currentUser) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        background: '#0a0a0a', // Solid near-black for performance
      }} />
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1,
      overflow: 'hidden',
    }}>
      <img
        src={bannerImages[currentBanner]}
        alt={`Decades Bar & Lounge`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          filter: 'brightness(0.4) contrast(1.1) saturate(1.1)',
        }}
      />
      
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(0,0,0,0.8) 100%)',
        pointerEvents: 'none',
      }}></div>
    </div>
  );
}