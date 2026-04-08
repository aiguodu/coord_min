import React from 'react';
import { motion } from 'motion/react';
import { steps } from '../data';

interface StepPanelProps {
  currentStep: number;
}

export default function StepPanel({ currentStep }: StepPanelProps) {
  return (
    <div className="w-full h-full bg-slate-50 p-6 md:p-8 overflow-y-auto border-l border-slate-200">
      <div className="space-y-6 pb-12">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isPast = index < currentStep;
          const Icon = step.icon;

          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isActive || isPast ? 1 : 0.4, y: 0 }}
              className={`relative pl-8 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}
            >
              {/* Timeline line */}
              {index !== steps.length - 1 && (
                <div className={`absolute left-3 top-8 bottom-[-24px] w-0.5 ${isPast ? 'bg-blue-500' : 'bg-slate-200'}`} />
              )}
              
              {/* Timeline dot */}
              <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 
                ${isActive ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]' : 
                  isPast ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-300 bg-white text-slate-400'}`}
              >
                <Icon size={12} />
              </div>

              <div className={`bg-white rounded-xl p-5 shadow-sm border ${isActive ? 'border-blue-200 shadow-blue-100/50' : 'border-slate-100'}`}>
                <h3 className={`font-semibold text-lg mb-2 ${isActive ? 'text-blue-900' : 'text-slate-700'}`}>
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm mb-3 font-medium">
                  {step.desc}
                </p>
                
                {/* 详细推导过程 */}
                <motion.div 
                  initial={false}
                  animate={{ height: isActive || isPast ? 'auto' : 0, opacity: isActive || isPast ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 border-t border-slate-100 text-sm text-slate-500 leading-relaxed">
                    {step.detail}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
