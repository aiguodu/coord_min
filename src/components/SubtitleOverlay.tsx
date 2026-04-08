import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Loader2 } from 'lucide-react';

interface SubtitleOverlayProps {
  text: string;
  progress: number;
  status: 'idle' | 'loading' | 'playing' | 'paused';
}

export default function SubtitleOverlay({ text, progress, status }: SubtitleOverlayProps) {
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-50"
      >
        <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-white/10 overflow-hidden relative">
          
          {/* Progress Bar Background */}
          <div className="absolute bottom-0 left-0 h-1 bg-white/10 w-full" />
          
          {/* Active Progress Bar */}
          <motion.div 
            className="absolute bottom-0 left-0 h-1 bg-blue-500"
            style={{ width: `${progress}%` }}
            transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
          />

          <div className="flex items-start gap-4">
            <div className="mt-1 flex-shrink-0">
              {status === 'loading' ? (
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              ) : (
                <Volume2 className={`w-5 h-5 ${status === 'playing' ? 'text-blue-400 animate-pulse' : 'text-slate-400'}`} />
              )}
            </div>
            
            <div className="flex-1 max-h-[100px] overflow-y-auto custom-scrollbar">
              <p className="text-white/90 text-base leading-relaxed font-medium tracking-wide">
                {text}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
