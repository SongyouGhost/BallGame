
import React from 'react';
import { Ball } from '../types';
import { CAPACITY } from '../constants';
import BallComponent from './Ball';

interface ColumnProps {
  balls: Ball[];
  isTarget: boolean;
  isDragOver?: boolean;
  onClick: () => void;
}

const Column: React.FC<ColumnProps> = ({ balls, isTarget, isDragOver, onClick }) => {
  const emptySlots = CAPACITY - balls.length;

  return (
    <div
      onClick={onClick}
      className={`
        relative group cursor-pointer w-10 md:w-12 lg:w-14 
        flex flex-col-reverse items-center gap-1 p-1.5
        rounded-b-[2.5rem] rounded-t-2xl transition-all duration-500
        ${isDragOver ? 'bg-indigo-500/20 ring-4 ring-indigo-500/40 border-indigo-400/50' : isTarget && balls.length < CAPACITY ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-slate-950/60 hover:bg-slate-900/80 border-white/5'}
        border-x border-b
      `}
      style={{ height: `${CAPACITY * 3.3}rem` }}
    >
      {/* Visual Glass Effect */}
      <div className="absolute inset-y-0 left-2 w-[15%] bg-white/5 pointer-events-none rounded-l-full z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5 pointer-events-none rounded-b-[2.5rem]" />
      
      {/* Balls rendered from bottom to top */}
      {balls.map((ball, idx) => (
        <BallComponent key={ball.id} color={ball.color} isTop={idx === balls.length - 1} />
      ))}

      {/* Empty Slots */}
      {Array.from({ length: emptySlots }).map((_, i) => (
        <div 
          key={`empty-${i}`} 
          className={`
            w-7 h-7 md:w-9 md:h-9 lg:w-11 lg:h-11 rounded-full shrink-0 
            transition-all duration-700 
            ${i === emptySlots - 1 && isTarget ? 'border-2 border-dashed border-indigo-500/40 animate-pulse' : 'bg-black/20 border border-white/5'}
          `}
        />
      ))}
    </div>
  );
};

export default Column;
