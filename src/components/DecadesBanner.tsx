'use client';

import { useState, useEffect } from 'react';

const bannerImages = [
  '/images/decades/banner-main.jpg',
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
      width: '100%',
      height: '100vh',
      zIndex: -1,
      overflow: 'hidden',
    }}>
      <img
        src={bannerImages[currentBanner]}
        alt="Decades Bar & Lounge"
        onLoad={() => setImageLoaded(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          filter: imageLoaded ? 'brightness(0.4) contrast(1.1) saturate(1.1)' : 'none',
          transition: 'filter 0.5s ease-in-out',
          transform: 'scale(1.01)', // Prevents white edges
        }}
      />
      
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(0,0,0,0.6) 70%)',
      }}></div>
    </div>
  );
}