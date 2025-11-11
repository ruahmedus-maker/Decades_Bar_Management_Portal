import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // This should be imported
import DecadesBanner from '@/components/DecadesBanner';



const inter = Inter({ 
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Decades Bar Training Portal",
  description: "Training & Procedures Portal for Decades Bar Staff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body 
      className={inter.className}
      style={{ 
        margin: 0, 
        padding: 0,
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
        background: 'transparent',
        overflowX: 'hidden',
      }}>
        <DecadesBanner />
        <div style={{ 
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          background: 'transparent',
        }}>
          
            {children}
          
        </div>
      </body>
    </html>
  );
}