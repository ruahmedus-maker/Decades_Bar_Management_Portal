// components/SectionWithBackground.tsx
import Image from 'next/image';

interface SectionWithBackgroundProps {
  children: React.ReactNode;
  imagePath: string;
  overlay?: boolean;
  height?: string;
}

export default function SectionWithBackground({ 
  children, 
  imagePath, 
  overlay = true,
  height = '400px'
}: SectionWithBackgroundProps) {
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
        style={{
          objectFit: 'cover',
          objectPosition: 'center'
        }}
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