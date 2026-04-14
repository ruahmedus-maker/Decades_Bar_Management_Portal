'use client';

import { useEffect } from 'react';

/**
 * RecoveryMechanism - Client Component to handle emergency URL sanitization
 * and legacy Service Worker cleanup.
 */
export default function RecoveryMechanism() {
  useEffect(() => {
    // 1. Unregister any Service Workers (Legacy Cleanup)
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations: readonly ServiceWorkerRegistration[]) => {
        for (const registration of registrations) {
          registration.unregister().then(() => { 
            console.log('✅ Legacy SW Unregistered in Recovery Component'); 
          });
        }
      });
    }

    // 2. Clear Caches if we detected a loop previously
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      if (search.includes('?v=') && search.split('?v=').length > 2) {
        console.warn('⚠️ URL Loop Detected. Cleaning up...');
        if ('caches' in window) {
          caches.keys().then((names) => {
            for (const name of names) caches.delete(name);
          });
        }
        // Sanitize URL
        window.location.href = window.location.origin + window.location.pathname;
      }
    }
  }, []);

  return null;
}
