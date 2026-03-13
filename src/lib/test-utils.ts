export const ENABLE_TESTS = 
  (process.env.NEXT_PUBLIC_ENABLE_TESTS === 'true' || 
  (typeof window !== 'undefined' && window.location.search.includes('enableTests=true'))) &&
  !(typeof window !== 'undefined' && window.location.search.includes('enableTests=false'));

