// DecadesBanner.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const bannerImages = [
  '/images/decades/banner-main.jpg',
  '/images/decades/banner-main2.jpg',
  '/images/decades/banner-main3.jpg',
  '/images/decades/banner-main4.jpg',
  '/images/decades/banner-main5.jpg',
];

export default function DecadesBanner() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (bannerImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, []);

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
      <Image
        src={bannerImages[currentBanner]}
        alt="Decades Bar & Lounge"
        width={150} 
        height={50}
        priority
        onLoad={() => setImageLoaded(true)}
        onError={(e) => {
          console.error('Failed to load image:', bannerImages[currentBanner]);
          e.currentTarget.style.display = 'none';
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          filter: imageLoaded ? 'brightness(0.4) contrast(1.1) saturate(1.1)' : 'none',
          transition: 'filter 0.5s ease-in-out',
          position: 'fixed',
          top: 0,
          left: 0,
        }}
      />
      
      {/* Enhanced gradient overlay */}
      <div style={{
        position: 'fixed',
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