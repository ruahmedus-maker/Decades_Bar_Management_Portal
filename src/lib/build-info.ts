export function getBuildInfo() {
  if (typeof window !== 'undefined') {
    // Client-side: read from meta tag or window
    const buildMeta = document.querySelector('meta[name="build-id"]');
    const timeMeta = document.querySelector('meta[name="build-time"]');
    
    const buildId = (buildMeta as HTMLMetaElement)?.content 
                   || document.documentElement.getAttribute('data-build')
                   || 'unknown';
    
    const buildTime = (timeMeta as HTMLMetaElement)?.content || new Date().toISOString();
    
    return {
      id: buildId,
      time: buildTime
    };
  }
  
  // Server-side: should match next.config.js logic
  return {
    id: process.env.VERCEL_GIT_COMMIT_SHA 
      ? `build-${process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 8)}`
      : `build-${new Date().toISOString().split('T')[0]}`,
    time: new Date().toISOString()
  };
}