import React, { useState, useEffect, useRef } from 'react';
import { steps } from './data';
import GeometrySVG from './components/GeometrySVG';
import StepPanel from './components/StepPanel';
import SubtitleOverlay from './components/SubtitleOverlay';
import Controls from './components/Controls';
import { playTTS, stopTTS } from './ttsService';

export type PlayStatus = 'idle' | 'loading' | 'playing' | 'paused';

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<PlayStatus>('idle');
  const [ttsProgress, setTtsProgress] = useState(0);
  
  // 用于追踪组件是否卸载或步骤是否切换
  const stepRef = useRef(currentStep);

  useEffect(() => {
    stepRef.current = currentStep;
    setTtsProgress(0);
    
    // 自动开始播放当前步骤
    handlePlayStep(currentStep);
    
    return () => {
      stopTTS();
    };
  }, [currentStep]);

  const handlePlayStep = async (stepIndex: number) => {
    setStatus('loading');
    setTtsProgress(0);
    stopTTS();

    try {
      setStatus('playing');
      await playTTS(steps[stepIndex].tts, (progress) => {
        if (stepRef.current === stepIndex) {
          setTtsProgress(progress);
        }
      });
      
      if (stepRef.current === stepIndex) {
        setStatus('idle');
        setTtsProgress(100);
      }
    } catch (error) {
      console.error("TTS Playback failed", error);
      if (stepRef.current === stepIndex) {
        setStatus('idle');
      }
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  const handleTogglePlay = () => {
    if (status === 'playing' || status === 'loading') {
      stopTTS();
      setStatus('paused');
    } else {
      handlePlayStep(currentStep);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="h-16 border-b border-slate-200 flex items-center px-6 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full tracking-wider">
              几何动点
            </span>
            <h1 className="text-lg font-bold text-slate-800">
              双动点线段和最小值问题 (将军饮马进阶)
            </h1>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row h-[570px]">
          
          {/* Left: Geometry Visualization */}
          <div className="w-full md:w-[55%] h-full bg-white relative">
            <GeometrySVG step={currentStep} />
            
            <SubtitleOverlay 
              text={steps[currentStep].tts} 
              progress={ttsProgress} 
              status={status} 
            />
          </div>

          {/* Right: Step Explanations */}
          <div className="w-full md:w-[45%] h-full">
            <StepPanel currentStep={currentStep} />
          </div>
          
        </div>

        {/* Footer Controls */}
        <Controls 
          currentStep={currentStep}
          totalSteps={steps.length}
          status={status}
          onPrev={handlePrev}
          onNext={handleNext}
          onReset={handleReset}
          onTogglePlay={handleTogglePlay}
        />
        
      </div>
    </div>
  );
}
