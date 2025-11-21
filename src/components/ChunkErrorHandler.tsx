'use client';

import { useEffect } from 'react';

export default function ChunkErrorHandler() {
  useEffect(() => {
    const handleChunkError = (event: ErrorEvent) => {
      if (event.error && event.error.message && event.error.message.includes('Loading chunk')) {
        console.log('Chunk load error detected, reloading page...');
        
        // Only retry once per session
        if (!sessionStorage.getItem('chunkRetry')) {
          sessionStorage.setItem('chunkRetry', 'true');
          window.location.reload();
        }
      }
    };

    // Listen for chunk loading errors
    window.addEventListener('error', handleChunkError);

    // Also handle unhandled promise rejections (common with chunk errors)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && event.reason.message && event.reason.message.includes('Loading chunk')) {
        console.log('Chunk load promise rejection detected, reloading page...');
        
        if (!sessionStorage.getItem('chunkRetry')) {
          sessionStorage.setItem('chunkRetry', 'true');
          window.location.reload();
        }
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleChunkError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null; // This component doesn't render anything
}