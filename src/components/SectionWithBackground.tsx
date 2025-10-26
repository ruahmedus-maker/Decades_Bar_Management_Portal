// components/SectionWithBackground.tsx
import Image from 'next/image';
import { useState } from 'react';

interface SectionWithBackgroundProps {
  children: React.ReactNode;
  imagePath: string;
  overlay?: boolean;
  height?: string;
  priority?: boolean;
}

export default function SectionWithBackground({ 
  children, 
  imagePath, 
  overlay = true,
  height = '400px',
  priority = false
}: SectionWithBackgroundProps) {
  const [imageError, setImageError] = useState(false);

  // Fallback background if image fails to load
  const fallbackBackground = {
    background: 'linear-gradient(135deg, rgba(26, 54, 93, 0.8), rgba(45, 55, 72, 0.9))'
  };

  if (imageError) {
    return (
      <div style={{
        position: 'relative',
        width: '100%',
        height: height,
        borderRadius: '12px',
        overflow: 'hidden',
        margin: '20px 0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        ...fallbackBackground
      }}>
        {overlay ? (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {children}
          </div>
        ) : children}
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: height,
      borderRadius: '12px',
      overflow: 'hidden',
      margin: '20px 0',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    }}>
      <Image
        src={imagePath}
        alt="Section background"
        fill
        priority={priority}
        onError={() => setImageError(true)}
        style={{
          objectFit: 'cover',
          objectPosition: 'center'
        }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
      />
      
      {overlay && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {children}
        </div>
      )}
      
      {!overlay && children}
    </div>
  );
}