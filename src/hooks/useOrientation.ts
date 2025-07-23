import { useState, useEffect } from 'react';

/**
 * useDeviceLayout - Detects device layout properties such as mobile, horizontal (landscape), and portrait orientation.
 * Returns: { isMobile, isHorizontal, isPortrait, orientation }
 */
export function useDeviceLayout() {
  const getLayout = () => {
    if (typeof window === 'undefined') {
      return { isMobile: false, isHorizontal: false, isPortrait: false, orientation: 'portrait' };
    }
    const width = window.innerWidth;
    const height = window.innerHeight;
    let orientation: 'portrait' | 'landscape';
    if (window.screen && window.screen.orientation && window.screen.orientation.type) {
      orientation = window.screen.orientation.type.startsWith('landscape') ? 'landscape' : 'portrait';
    } else {
      orientation = width > height ? 'landscape' : 'portrait';
    }
    // Improved mobile detection: width or user agent
    const userAgent = window.navigator.userAgent || '';
    const isMobileUA = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    return {
      isMobile: width <= 600 || isMobileUA,
      isHorizontal: orientation === 'landscape',
      isPortrait: orientation === 'portrait',
      orientation,
    };
  };

  const [layout, setLayout] = useState(getLayout);

  useEffect(() => {
    const handleResize = () => setLayout(getLayout());
    window.addEventListener('resize', handleResize);
    if (window.screen && window.screen.orientation && window.screen.orientation.addEventListener) {
      window.screen.orientation.addEventListener('change', handleResize);
      return () => window.screen.orientation.removeEventListener('change', handleResize);
    }
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return layout;
}
