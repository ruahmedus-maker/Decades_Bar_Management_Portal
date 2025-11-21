'use client';

import { useEffect, useState } from 'react';
import { getBuildInfo } from '@/lib/build-info';

export default function VersionChecker() {
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkVersion = () => {
      const buildInfo = getBuildInfo();
      const storedBuild = localStorage.getItem('app-build');
      const storedTime = localStorage.getItem('app-build-time');
      
      console.log('🔍 Version Check:', {
        current: buildInfo.id,
        stored: storedBuild,
        currentTime: buildInfo.time,
        storedTime: storedTime
      });

      // Only reload if this is a different build AND we haven't just reloaded
      if (storedBuild && storedBuild !== buildInfo.id && !hasChecked) {
        console.log('🔄 New build detected, updating cache...');
        
        // Update stored version
        localStorage.setItem('app-build', buildInfo.id);
        localStorage.setItem('app-build-time', buildInfo.time);
        
        // Clear caches without forcing immediate reload
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
          });
        }

        // Show a message to user instead of auto-reloading
        if (confirm('A new version is available. Reload to see the latest changes?')) {
          window.location.reload();
        }
        
        setHasChecked(true);
      } else if (!storedBuild) {
        // First time load - just store the version
        localStorage.setItem('app-build', buildInfo.id);
        localStorage.setItem('app-build-time', buildInfo.time);
        setHasChecked(true);
      }
    };

    // Check on mount
    checkVersion();
    
    // Only check every 2 minutes, not every 30 seconds
    const interval = setInterval(checkVersion, 120000);
    
    return () => clearInterval(interval);
  }, [hasChecked]);

  return null;
}