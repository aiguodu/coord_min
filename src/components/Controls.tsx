import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

interface ControlsProps {
  currentStep: number;
  totalSteps: number;
  status: 'idle' | 'loading' | 'playing' | 'paused';
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  onTogglePlay: () => void;
}

export default function Controls({ 
  currentStep, 
  totalSteps, 
  status, 
  onPrev, 
  onNext, 
  onReset,
  onTogglePlay
}: ControlsProps) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;
  const isPlaying = status === 'playing' || status === 'loading';

  return (
    <div className="h-20 bg-white border-t border-slate-200 flex items-center justify-between px-6 md:px-12">
      <div className="flex items-center gap-4">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm px-4 py-2 rounded-lg hover:bg-slate-100"
        >
          <RotateCcw size={16} />
          重新开始
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onPrev}
          disabled={isFirst}
          className="p-3 rounded-full text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <SkipBack size={20} />
        </button>

        <button 
          onClick={onTogglePlay}
          className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all"
        >
          {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
        </button>

        <button 
          onClick={onNext}
          disabled={isLast}
          className="p-3 rounded-full text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <SkipForward size={20} />
        </button>
      </div>

      <div className="text-sm font-medium text-slate-400 w-[100px] text-right">
        {currentStep + 1} / {totalSteps}
      </div>
    </div>
  );
}
