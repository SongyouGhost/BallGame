
import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Trophy, Info, Move, Columns } from 'lucide-react';
import { ROWS, CAPACITY, COLS, BALL_COLORS } from './constants';
import { Ball, Grid } from './types';
import Column from './components/Column';

const App: React.FC = () => {
  const [grid, setGrid] = useState<Grid>([]);
  const [heldBall, setHeldBall] = useState<Ball | null>(null);
  const [steps, setSteps] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [dragOverCol, setDragOverCol] = useState<number | null>(null);

  // Initialize: Each Row has the same color. 12 columns filled, 13th column empty.
  const initGame = useCallback(() => {
    const newGrid: Grid = Array.from({ length: COLS }, () => []);
    
    // Fill the first 12 columns (c: 0-11)
    // For each column, fill 12 balls such that Row 'r' has BALL_COLORS[r]
    for (let c = 0; c < 12; c++) {
      for (let r = 0; r < ROWS; r++) {
        newGrid[c].push({
          id: `ball-${r}-${c}`,
          color: BALL_COLORS[r]
        });
      }
    }
    
    // The 13th column (index 12) remains an empty array []
    setGrid(newGrid);
    setHeldBall(null);
    setSteps(0);
    setIsWon(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Win condition: 12 columns are solid color (12 balls each), 1 column is empty.
  const checkWin = useCallback((currentGrid: Grid) => {
    let sortedCols = 0;
    let emptyCols = 0;

    currentGrid.forEach(col => {
      if (col.length === 0) {
        emptyCols++;
      } else if (col.length === CAPACITY) {
        const firstColor = col[0].color;
        if (col.every(ball => ball.color === firstColor)) {
          sortedCols++;
        }
      }
    });

    return sortedCols === 12 && emptyCols === 1;
  }, []);

  const handleAction = (colIndex: number) => {
    if (isWon) return;

    if (heldBall) {
      if (grid[colIndex].length < CAPACITY) {
        const newGrid = [...grid];
        newGrid[colIndex] = [...newGrid[colIndex], heldBall];
        setGrid(newGrid);
        setHeldBall(null);
        setSteps(prev => prev + 1);
        if (checkWin(newGrid)) setIsWon(true);
      }
    } else {
      if (grid[colIndex].length > 0) {
        const newGrid = [...grid];
        const picked = newGrid[colIndex].pop();
        if (picked) {
          setGrid(newGrid);
          setHeldBall(picked);
        }
      }
    }
  };

  const onDragStart = (e: React.DragEvent, colIndex: number) => {
    if (heldBall || isWon || grid[colIndex].length === 0) {
      e.preventDefault();
      return;
    }
    const newGrid = [...grid];
    const picked = newGrid[colIndex].pop();
    if (picked) {
      setGrid(newGrid);
      setHeldBall(picked);
    }
  };

  const onDrop = (e: React.DragEvent, colIndex: number) => {
    e.preventDefault();
    setDragOverCol(null);
    if (heldBall && grid[colIndex].length < CAPACITY) {
      const newGrid = [...grid];
      newGrid[colIndex] = [...newGrid[colIndex], heldBall];
      setGrid(newGrid);
      setHeldBall(null);
      setSteps(prev => prev + 1);
      if (checkWin(newGrid)) setIsWon(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 select-none bg-slate-950 text-slate-100 font-sans">
      <header className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-900/40">
            <Columns className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white italic uppercase">Transpose Pro</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Rows to Columns Challenge</p>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-slate-900/80 p-4 rounded-3xl border border-white/5 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col items-center px-4 border-r border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Moves</span>
            <span className="text-3xl font-mono font-black text-indigo-400 leading-none mt-1">{steps}</span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowInfo(true)}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700 text-slate-300"
            >
              <Info className="w-5 h-5" />
            </button>
            <button
              onClick={initGame}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-900/40 font-bold text-white uppercase text-sm tracking-widest"
            >
              <RefreshCw className="w-4 h-4" />
              <span>重置</span>
            </button>
          </div>
        </div>
      </header>

      {/* Buffer Space Indicator */}
      <div className="mb-6 flex flex-col items-center">
        <div className={`
          w-24 h-24 rounded-[2rem] border-2 border-dashed flex items-center justify-center transition-all duration-500
          ${heldBall ? 'border-indigo-400 bg-indigo-400/20 scale-110 shadow-lg' : 'border-slate-800 bg-slate-900/20'}
        `}>
          {heldBall ? (
            <div
              className="w-16 h-16 rounded-full shadow-2xl animate-pulse"
              style={{ 
                backgroundColor: heldBall.color,
                boxShadow: `0 0 30px ${heldBall.color}aa, inset -4px -4px 12px rgba(0,0,0,0.4), inset 4px 4px 12px rgba(255,255,255,0.4)` 
              }}
            />
          ) : (
            <div className="flex flex-col items-center text-slate-800 opacity-20">
              <Move className="w-8 h-8" />
            </div>
          )}
        </div>
        <span className="mt-2 text-[10px] font-black uppercase text-slate-600 tracking-widest">
          {heldBall ? '球已拿起' : '從欄位中取球'}
        </span>
      </div>

      {/* Game Board */}
      <main className="w-full flex-grow flex justify-center items-end overflow-x-auto pb-12 px-4 scrollbar-hide">
        <div className="flex gap-3 p-8 bg-slate-900/40 rounded-[3.5rem] border border-white/5 backdrop-blur-xl min-w-max relative shadow-2xl">
          <div className="flex gap-2 md:gap-3">
            {grid.map((columnBalls, idx) => (
              <div
                key={`col-wrapper-${idx}`}
                onDragOver={(e) => { e.preventDefault(); setDragOverCol(idx); }}
                onDrop={(e) => onDrop(e, idx)}
                onDragLeave={() => setDragOverCol(null)}
                draggable={!heldBall && columnBalls.length > 0}
                onDragStart={(e) => onDragStart(e, idx)}
              >
                <Column
                  balls={columnBalls}
                  isTarget={heldBall !== null}
                  isDragOver={dragOverCol === idx}
                  onClick={() => handleAction(idx)}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Win Modal */}
      {isWon && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center z-50 p-6">
          <div className="bg-slate-900 p-12 rounded-[4rem] border border-indigo-500/30 shadow-[0_0_100px_rgba(99,102,241,0.2)] max-w-sm w-full text-center">
            <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Trophy className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-5xl font-black mb-4 text-white italic tracking-tighter">COMPLETE!</h2>
            <p className="text-slate-400 mb-10 font-bold uppercase tracking-widest text-sm">
              你已將橫列成功轉置為縱列<br/>總共花費 <span className="text-indigo-400 text-2xl font-mono mx-1">{steps}</span> 步
            </p>
            <button
              onClick={initGame}
              className="w-full py-6 bg-white text-slate-950 font-black rounded-[2rem] transition-all transform hover:scale-105 active:scale-95 shadow-2xl uppercase tracking-[0.2em]"
            >
              再次挑戰
            </button>
          </div>
        </div>
      )}

      {/* Help Panel */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-6" onClick={() => setShowInfo(false)}>
          <div className="bg-slate-900 p-10 rounded-[3rem] border border-slate-800 max-w-md shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-black italic mb-8 text-white flex items-center gap-3">
              <Info className="w-6 h-6 text-indigo-500" /> 遊戲規則
            </h3>
            <div className="space-y-6 text-slate-300 font-bold text-sm tracking-wide leading-relaxed">
              <p>1. <span className="text-indigo-400">初始狀態：</span>12 個橫列 (Row) 的顏色分別相同，其中一欄 (Column) 是完全空的。</p>
              <p>2. <span className="text-white font-black">勝利目標：</span>移動球體，使 12 個縱欄 (Column) 各自變成單一顏色，並留下一欄全空。</p>
              <p>3. <span className="text-indigo-400">空間限制：</span>每欄只有 12 個位置。由於 12 欄已經全滿，唯一的移動空間就是那一欄空位。</p>
              <p>4. <span className="text-indigo-400">操作：</span>點擊取出頂部的球，點擊目標欄放置球。亦可使用拖曳操作。</p>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="mt-10 w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-indigo-900/40"
            >
              開始解謎
            </button>
          </div>
        </div>
      )}

      <footer className="mt-auto pt-8 flex items-center gap-4 text-slate-800 font-black text-[10px] tracking-[0.4em] uppercase">
        <span>13 Columns</span>
        <span className="w-1.5 h-1.5 bg-slate-800 rounded-full"></span>
        <span>12 Rows</span>
      </footer>
    </div>
  );
};

export default App;
