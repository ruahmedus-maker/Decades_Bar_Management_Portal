'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

export default function DecadesBanner() {
  const { backgroundImages } = useApp();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);

  useEffect(() => {
    setImagesLoaded(new Array(backgroundImages.length).fill(false));
  }, [backgroundImages]);

  useEffect(() => {
    if (backgroundImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % backgroundImages.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [backgroundImages.length]);

  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => {
      const newLoaded = [...prev];
      newLoaded[index] = true;
      return newLoaded;
    });
  };

  const handleImageError = (index: number) => {
    console.error(`Failed to load background image: ${backgroundImages[index]}`);
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
      {backgroundImages.map((image, index) => (
        <img
          key={image}
          src={image}
          alt={`Decades Bar & Lounge Background ${index + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'brightness(0.4) contrast(1.1) saturate(1.1)',
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: index === currentBanner && imagesLoaded[index] ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}
          onLoad={() => handleImageLoad(index)}
          onError={() => handleImageError(index)}
        />
      ))}
      
      {/* Loading fallback */}
      {(!imagesLoaded[currentBanner] || backgroundImages.length === 0) && (
        <div style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 50%, #000000 100%)',
          position: 'absolute',
          top: 0,
          left: 0,
        }} />
      )}
      
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