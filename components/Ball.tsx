
import React from 'react';

interface BallProps {
  color: string;
  isTop?: boolean;
}

const Ball: React.FC<BallProps> = ({ color, isTop }) => {
  return (
    <div
      className={`
        w-7 h-7 md:w-9 md:h-9 lg:w-11 lg:h-11 rounded-full shrink-0
        transition-all duration-500 transform
        ${isTop ? 'group-hover:scale-105 group-hover:-translate-y-1' : ''}
        relative shadow-lg overflow-hidden z-20
      `}
      style={{ 
        backgroundColor: color,
        boxShadow: `
          inset -3px -3px 6px rgba(0,0,0,0.5), 
          inset 3px 3px 6px rgba(255,255,255,0.4), 
          0 4px 10px rgba(0,0,0,0.6),
          0 0 8px ${color}44
        `
      }}
    >
      {/* 主要高光 */}
      <div className="absolute top-[10%] left-[15%] w-[40%] h-[30%] bg-white/40 rounded-full blur-[2px] -rotate-[35deg]" />
      
      {/* 次要反光 */}
      <div className="absolute bottom-[10%] right-[10%] w-[20%] h-[20%] bg-white/10 rounded-full blur-[1px]" />

      {/* 球體核心陰影 */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30" />
    </div>
  );
};

export default Ball;
