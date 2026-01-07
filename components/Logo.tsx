
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'light';
}

const Logo: React.FC<LogoProps> = ({ className = '', variant = 'default' }) => {
  const isLight = variant === 'light';
  const primaryColor = isLight ? '#FFFFFF' : '#a94694';
  const secondaryColor = isLight ? 'rgba(255, 255, 255, 0.7)' : '#666666';

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Protective Arc / Roof */}
        <path
          d="M5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20"
          stroke={primaryColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        
        {/* Heart-shaped Paw Base */}
        <path
          d="M20 32C20 32 14 28 14 24C14 21.7909 15.7909 20 18 20C18.8 20 19.5 20.3 20 20.8C20.5 20.3 21.2 20 22 20C24.2091 20 26 21.7909 26 24C26 28 20 32 20 32Z"
          fill={primaryColor}
        />
        
        {/* Paw Toes */}
        <circle cx="15" cy="17" r="2.5" fill={primaryColor} />
        <circle cx="20" cy="14" r="2.5" fill={primaryColor} />
        <circle cx="25" cy="17" r="2.5" fill={primaryColor} />
      </svg>
      
      <div className="flex flex-col leading-none">
        <span 
          style={{ color: primaryColor }} 
          className="text-xl font-black tracking-tight"
        >
          Pet<span className="font-medium">Covered</span>
        </span>
        <span 
          style={{ color: secondaryColor }} 
          className="text-[8px] uppercase font-bold tracking-[0.2em] mt-0.5"
        >
          Smart Protection
        </span>
      </div>
    </div>
  );
};

export default Logo;
