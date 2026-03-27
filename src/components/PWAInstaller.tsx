'use client';

import { useEffect } from 'react';

export default function PWAInstaller() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let registration of registrations) {
          registration.unregister().then((success) => {
            console.log('Unregistered rogue Service Worker:', success);
            // Optional: force a reload if needed, but unregistering is usually enough.
          });
        }
      });
    }
  }, []);

  return null;
}