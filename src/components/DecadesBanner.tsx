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

// Fallback color in case images fail to load
const fallbackColors = [
  'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
  'linear-gradient(135deg, #2d1a1a 0%, #3d2d2d 100%)',
  'linear-gradient(135deg, #1a2d1a 0%, #2d3d2d 100%)',
  'linear-gradient(135deg, #1a1a2d 0%, #2d2d3d 100%)',
  'linear-gradient(135deg, #2d1a2d 0%, #3d2d3d 100%)',
];

export default function DecadesBanner() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (bannerImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
        setImageLoaded(false);
        setImageError(false);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  const handleImageError = () => {
    console.error('Failed to load image:', bannerImages[currentBanner]);
    setImageError(true);
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

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
      {/* Fallback background */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: fallbackColors[currentBanner],
          zIndex: 1,
          display: imageLoaded ? 'none' : 'block',
        }}
      />
      
      {/* Main Image */}
      <Image
        src={bannerImages[currentBanner]}
        alt="Decades Bar & Lounge"
        fill
        priority={currentBanner === 0}
        quality={90}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
          filter: imageLoaded ? 'brightness(0.4) contrast(1.1) saturate(1.1)' : 'brightness(0.3)',
          transition: 'filter 0.5s ease-in-out, opacity 0.5s ease-in-out',
          opacity: imageLoaded ? 1 : 0,
          zIndex: 2,
        }}
      />
      
      {/* Enhanced gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(0,0,0,0.8) 100%)',
        pointerEvents: 'none',
        zIndex: 3,
      }}></div>

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          color: 'white',
          background: 'rgba(0,0,0,0.7)',
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 4,
        }}>
          Current: {bannerImages[currentBanner]}<br />
          Loaded: {imageLoaded ? 'Yes' : 'No'}<br />
          Error: {imageError ? 'Yes' : 'No'}
        </div>
      )}
    </div>
  );
}