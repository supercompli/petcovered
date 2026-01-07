
import React from 'react';

const GenricLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Green Arc */}
        <path
          d="M15 45C15 25 30 10 50 10C70 10 85 25 85 45"
          stroke="#7dbb26"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Stylized 'G' */}
        <path
          d="M80 60C80 75 65 90 45 90C25 90 10 75 10 55C10 35 25 20 45 20C55 20 65 25 72 32"
          stroke="white"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Fixed: changed strokeJoin to strokeLinejoin to match React SVG property naming conventions */}
        <path
          d="M45 55H78V75"
          stroke="white"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex flex-col justify-center leading-none">
        <span className="text-[#7dbb26] text-lg font-black tracking-widest uppercase">Genric</span>
        <span className="text-white text-xs tracking-[0.3em] font-light">Insurance</span>
      </div>
    </div>
  );
};

export default GenricLogo;
