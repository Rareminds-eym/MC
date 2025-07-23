import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Settings, Zap, ThermometerSun, Shield, Target } from 'lucide-react';

interface Product2DProps {
  productName: string;
  batchNumber: string;
  hasDeviation: boolean;
  deviationType?: 'cleaning' | 'calibration' | 'environmental';
  isCompleted?: boolean;
  imageSrc?: string; // Add imageSrc prop
}

export const Product2D: React.FC<Product2DProps> = ({
  productName,
  batchNumber,
  hasDeviation,
  deviationType,
  isCompleted = false,
  imageSrc = "/Level4/product1.webp" // Default image if not provided
}) => {
  const getDeviationIcon = () => {
    switch (deviationType) {
      case 'cleaning':
        return <Settings className="w-4 h-4 text-red-500" />;
      case 'calibration':
        return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'environmental':
        return <ThermometerSun className="w-4 h-4 text-orange-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };
  const getStatusIndicator = () => {
    if (isCompleted) {
      return (
        <div className="absolute top-1 right-1 w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce-subtle">
          <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
        </div>
      );
    }
    if (hasDeviation) {
      return (
        <div className="absolute top-1 right-1 w-5 h-5 md:w-6 md:h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
          <XCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
        </div>      );
    }
    return null;
  };
  return (
    <div className="w-full max-w-[80px] sm:max-w-[100px] mx-auto pt-1">
      <div className="w-full flex flex-col items-center justify-center h-full overflow-visible flex-shrink-0 flex-grow-0">
      
        {/* Product Information */}
        <div className="text-center mt-1 w-full flex flex-col items-center animate-product-info">
        <div className="relative w-full flex items-center justify-center h-[48px] animate-fade-in-scale" style={{ animationDelay: '2.2s' }}>
            <img
              src={imageSrc}
              alt={productName}
              className="w-[60%] h-auto object-cover rounded-lg"
            />
          </div>
          <h3 className="text-xs lg:text-lg font-semibold text-cyan-200 animate-slide-up" style={{ animationDelay: '2.6s' }}>{productName}</h3>
          <p className="text-[9px] lg:text-lg text-cyan-200 animate-slide-up whitespace-nowrap" style={{ animationDelay: '3.0s' }}>Batch: {batchNumber}</p>
          <div className="mt-1 animate-bounce-in" style={{ animationDelay: '3.4s' }}>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs md:text-sm lg:text-base font-medium bg-red-100 text-red-800 animate-pulse whitespace-nowrap">
              <AlertTriangle className="w-4 h-4 mr-1" />Deviation Detected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
