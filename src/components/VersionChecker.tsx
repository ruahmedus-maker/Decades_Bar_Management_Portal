'use client';

import { useEffect } from 'react';

const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID || `build-${Date.now()}`;

export default function VersionChecker() {
  useEffect(() => {
    const checkVersion = () => {
      const storedBuild = localStorage.getItem('app-build');
      const currentBuild = BUILD_ID;
      
      console.log('🔍 Version Check:', {
        stored: storedBuild,
        current: currentBuild,
        match: storedBuild === currentBuild
      });
      
      if (storedBuild !== currentBuild) {
        console.log('🔄 New build detected, clearing cache and reloading...');
        localStorage.setItem('app-build', currentBuild);
        
        // Clear all possible caches
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
          });
        }
        
        // Clear service workers
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => registration.unregister());
          });
        }
        
        // Clear various storages
        localStorage.clear();
        sessionStorage.clear();
        
        // Force reload with cache bust
        setTimeout(() => {
          window.location.href = window.location.href + '?v=' + Date.now();
        }, 1000);
      }
    };

    // Check on mount
    checkVersion();
    
    // Check every 30 seconds in case of background updates
    const interval = setInterval(checkVersion, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return null;
}