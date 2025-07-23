import React from 'react';
import { useDeviceLayout } from '../../hooks/useOrientation';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'game';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  loading?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'game', 
  size = 'md', 
  children, 
  className = '',
  style = {},
  loading = false,
  disabled,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props 
}) => {
  const layout = useDeviceLayout();
  const variants = {
    primary: 'linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%)',
    secondary: 'linear-gradient(90deg, #6b7280 0%, #4b5563 100%)',
    success: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
    danger: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
    game: 'linear-gradient(90deg, #2ecc40 0%, #baffb6 100%)'
  };

  const sizes = {
    sm: { width: '180px', height: '36px', fontSize: '16px' },
    md: { width: '270px', height: '44px', fontSize: '20px' },
    lg: { width: '320px', height: '52px', fontSize: '24px' }
  };

  // Responsive/compact for mobile horizontal
  const compactMobile = layout.isMobile && layout.isHorizontal;
  const compactStyle = compactMobile
    ? {
        width: '200px',
        minWidth: 'max-content',
        maxWidth: '100%',
        height: '28px',
        fontSize: '12px',
        padding: '0 6px',
        borderRadius: '6px',
        margin: '0 0 6px 0',
        border: '2px solid #222', // reduced border size
      }
    : {};

  const baseStyle = {
    margin: '0 auto 28px auto',
    fontFamily: "'Arial Black', Arial, sans-serif",
    color: '#000',
    background: variants[variant],
    border: '3px solid #222',
    borderRadius: '4px',
    boxShadow: '-8px 8px 0 #111',
    cursor: 'pointer',
    transition: 'transform 0.1s, box-shadow 0.1s',
    textAlign: 'center' as const,
    letterSpacing: '1px',
    textShadow: 'none',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...sizes[size],
    ...compactStyle,
    ...style
  };

  const hoverStyle = {
    transform: 'translateY(-2px) scale(1.03)',
    boxShadow: '-10px 12px 0 #111'
  };

  return (
    <button
      className={`game-button ${className}`}
      style={{
        ...baseStyle,
        opacity: disabled || loading ? 0.6 : 1,
        cursor: disabled || loading ? 'not-allowed' : 'pointer'
      }}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled || loading}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.currentTarget.style, hoverStyle);
          if (variant === 'game') {
            e.currentTarget.style.background = 'linear-gradient(90deg, #baffb6 0%, #2ecc40 100%)';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '-8px 8px 0 #111';
          e.currentTarget.style.background = variants[variant];
        }
      }}
      onKeyDown={(e) => {
        // Enhanced keyboard navigation
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!disabled && !loading && props.onClick) {
            props.onClick(e as any);
          }
        }
      }}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="loading-spinner" style={{
            width: '16px',
            height: '16px',
            border: '2px solid #333',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Loading...
        </span>
      ) : children}
    </button>
  );
};

export default Button;
