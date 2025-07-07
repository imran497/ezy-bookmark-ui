import { useState } from 'react';
import Image from 'next/image';
import { getFaviconUrls } from '@/lib/favicon';

interface SmartIconProps {
  url: string;
  name: string;
  customFavicon?: string;
  size?: number;
  className?: string;
}

export default function SmartIcon({ url, name, customFavicon, size = 64, className = '' }: SmartIconProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const iconUrls = customFavicon 
    ? [customFavicon, ...getFaviconUrls(url)]
    : getFaviconUrls(url);
  
  const handleError = () => {
    if (currentIndex < iconUrls.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <Image
      src={iconUrls[currentIndex]}
      alt={`${name} icon`}
      width={size}
      height={size}
      className={`object-cover ${className}`}
      onError={handleError}
      unoptimized
    />
  );
}