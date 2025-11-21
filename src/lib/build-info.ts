// lib/build-info.ts

// This will be set during build time
export const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID || 'dev-build';
export const BUILD_TIME = process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString();

export const getBuildInfo = () => {
  return {
    id: BUILD_ID,
    time: BUILD_TIME,
    timestamp: new Date(BUILD_TIME).getTime()
  };
};