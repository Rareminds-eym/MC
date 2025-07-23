// Constants
export const BACKGROUND_IMAGE_URL = "/backgrounds/m1l3.webp";

// Utility Functions
export const preloadImage = (url: string) => {
  const img = new window.Image();
  img.src = url;
};

export const getModuleIdFromPath = () => {
  const match = window.location.pathname.match(/modules\/(\w+)/);
  return match ? match[1] : "";
};
