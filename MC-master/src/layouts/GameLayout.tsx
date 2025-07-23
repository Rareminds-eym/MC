import React from 'react';
import { useDeviceLayout } from '../hooks/useOrientation';
import { RotateDeviceOverlay } from '../components/RotateDeviceOverlay';

interface GameLayoutProps {
  children: React.ReactNode;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
  const { isMobile, isPortrait } = useDeviceLayout();

  // Show overlay if on mobile and in portrait mode (example logic)
  if (isMobile && isPortrait) {
    return <RotateDeviceOverlay />;
  }

  return (
    <>
      {children}
    </>
  );
};