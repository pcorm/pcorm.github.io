import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Icon */}
      <div className={`relative ${sizeClasses[size]} flex-shrink-0`}>
        {/* Main glass */}
        <div className="w-full h-full bg-gradient-to-b from-blue-400 to-blue-600 rounded-b-full border-2 border-blue-700 relative overflow-hidden">
          {/* Liquid inside */}
          <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-b from-yellow-300 to-orange-400 rounded-b-full"></div>
          
          {/* Bubbles */}
          <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full opacity-70"></div>
          <div className="absolute top-3 right-3 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
          <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-white rounded-full opacity-80"></div>
          
          {/* Straw */}
          <div className="absolute -top-1 -right-1 w-1 h-6 bg-green-500 transform rotate-12 rounded-full"></div>
        </div>
        
        {/* Clock hands */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-0.5 h-3 bg-white rounded-full transform rotate-45 origin-bottom"></div>
          <div className="w-0.5 h-2 bg-white rounded-full transform -rotate-45 origin-bottom absolute"></div>
        </div>
        
        {/* Clock center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-gray-900 ${textSizes[size]} leading-tight`}>
            Happy Hour
          </span>
          <span className={`text-gray-600 ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'} leading-tight`}>
            Near Me
          </span>
        </div>
      )}
    </div>
  );
};

// Alternative logo with different style
export const LogoAlt: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Modern logo icon */}
      <div className={`relative ${sizeClasses[size]} flex-shrink-0`}>
        {/* Background circle */}
        <div className="w-full h-full bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
          {/* Beer mug */}
          <div className="w-3/4 h-3/4 bg-white rounded-b-full relative">
            {/* Handle */}
            <div className="absolute -right-1 top-1/4 w-1 h-1/2 bg-white rounded-l-full"></div>
            {/* Foam */}
            <div className="absolute top-0 left-0 right-0 h-1/4 bg-yellow-200 rounded-t-full"></div>
            {/* Liquid */}
            <div className="absolute top-1/4 left-0 right-0 h-1/2 bg-yellow-400 rounded-b-full"></div>
          </div>
          
          {/* Clock overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-0.5 h-2 bg-white rounded-full transform rotate-45 origin-bottom"></div>
            <div className="w-0.5 h-1.5 bg-white rounded-full transform -rotate-45 origin-bottom absolute"></div>
          </div>
        </div>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent ${textSizes[size]} leading-tight`}>
            Happy Hour
          </span>
          <span className={`text-gray-600 ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'} leading-tight`}>
            Near Me
          </span>
        </div>
      )}
    </div>
  );
};
