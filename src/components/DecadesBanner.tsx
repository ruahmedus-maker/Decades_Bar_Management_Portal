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

// Fixed preload function
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image(); // Use window.Image to avoid TypeScript issues
    img.src = src;
    img.onload = () => resolve();
    img.onerror = reject;
  });
};

export default function DecadesBanner() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
  const [loadError, setLoadError] = useState(false);

  // Preload all images on component mount
  useEffect(() => {
    const preloadAllImages = async () => {
      try {
        await Promise.all(bannerImages.map(img => preloadImage(img)));
        setImagesLoaded(bannerImages.map(() => true));
      } catch (error) {
        console.error('Failed to preload images:', error);
        setLoadError(true);
      }
    };

    preloadAllImages();
  }, []);

  // Set up banner rotation
  useEffect(() => {
    if (bannerImages.length > 1 && imagesLoaded.length === bannerImages.length) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [imagesLoaded]);

  const handleImageError = (index: number) => {
    console.error(`Failed to load image: ${bannerImages[index]}`);
    const newLoadedState = [...imagesLoaded];
    newLoadedState[index] = false;
    setImagesLoaded(newLoadedState);
    setLoadError(true);
  };

  if (loadError && imagesLoaded.every(loaded => !loaded)) {
    // Fallback background if all images fail to load
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(0,0,0,0.8) 100%)',
        }}></div>
      </div>
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
      {bannerImages.map((image, index) => (
        <div
          key={image}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: index === currentBanner ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}
        >
          <Image
            src={image}
            alt={`Decades Bar & Lounge ${index + 1}`}
            fill
            priority={index === 0}
            quality={85}
            onError={() => handleImageError(index)}
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
              filter: 'brightness(0.4) contrast(1.1) saturate(1.1)',
            }}
          />
        </div>
      ))}
      
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