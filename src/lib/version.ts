// lib/version.ts
export const APP_VERSION = '1.0.0-' + Date.now();

export const checkVersion = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return true;
  
  const storedVersion = localStorage.getItem('app-version');
  const currentVersion = APP_VERSION;
  
  if (storedVersion !== currentVersion) {
    console.log(`🔄 New version detected: ${currentVersion}`);
    localStorage.setItem('app-version', currentVersion);
    
    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
    
    // Clear service worker
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(reg => reg.unregister()));
    }
    
    // Force reload if version changed
    if (storedVersion) {
      window.location.reload();
      return false;
    }
  }
  
  return true;
};

export const getCurrentVersion = (): string => {
  if (typeof window === 'undefined') return APP_VERSION;
  return localStorage.getItem('app-version') || APP_VERSION;
};