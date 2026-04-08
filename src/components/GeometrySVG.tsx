import React, { useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'motion/react';

interface GeometrySVGProps {
  step: number;
}

export default function GeometrySVG({ step }: GeometrySVGProps) {
  // 坐标系转换配置
  // 原点 (120, 320), 缩放比例 40px = 1单位
  const scale = 40;
  const ox = 120;
  const oy = 320;

  const toX = (x: number) => ox + x * scale;
  const toY = (y: number) => oy - y * scale;

  // 动态 x 坐标 (点 A 的 x 坐标)
  // 步骤 0-3 时，A 在 x=2.5 的位置；步骤 4-5 时，A 滑动到最优解 x=1 的位置
  const targetX = step >= 4 ? 1 : 2.5;
  const animatedX = useSpring(targetX, { stiffness: 60, damping: 15 });

  // 依赖于 animatedX 的动态坐标
  const ax = useTransform(animatedX, x => toX(x));
  const ay = toY(0);
  const bx = useTransform(animatedX, x => toX(x + 2));
  const by = toY(0);
  const cx = useTransform(animatedX, x => toX(x + 2));
  const cy = toY(2);

  // 静态点坐标
  const qx = toX(0);
  const qy = toY(2);
  const px = toX(5);
  const py = toY(6);
  const pPrimeX = toX(3);
  const pPrimeY = toY(4);
  const qPrimeX = toX(0);
  const qPrimeY = toY(-2);

  // 动态路径
  const trianglePath = useTransform(animatedX, x => `M ${toX(x)} ${toY(0)} L ${toX(x+2)} ${toY(0)} L ${toX(x+2)} ${toY(2)} Z`);
  const aqPath = useTransform(animatedX, x => `M ${toX(0)} ${toY(2)} L ${toX(x)} ${toY(0)}`);
  const pcPath = useTransform(animatedX, x => `M ${toX(5)} ${toY(6)} L ${toX(x+2)} ${toY(2)}`);
  const apPrimePath = useTransform(animatedX, x => `M ${toX(x)} ${toY(0)} L ${toX(3)} ${toY(4)}`);
  const pPrimeCPath = useTransform(animatedX, x => `M ${toX(3)} ${toY(4)} L ${toX(x+2)} ${toY(2)}`);
  const acVectorPath = useTransform(animatedX, x => `M ${toX(x)} ${toY(0)} L ${toX(x+2)} ${toY(2)}`);
  const parallelogramFillPath = useTransform(animatedX, x => `M ${toX(x)} ${toY(0)} L ${toX(3)} ${toY(4)} L ${toX(5)} ${toY(6)} L ${toX(x+2)} ${toY(2)} Z`);

  return (
    <div className="w-full h-full flex items-start pt-8 pb-24 justify-center relative select-none">
      <svg width="100%" height="100%" viewBox="0 0 480 500" className="overflow-visible">
        {/* 坐标轴 */}
        <g className="text-slate-400">
          <line x1={ox - 40} y1={oy} x2={ox + 320} y2={oy} stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <line x1={ox} y1={oy + 120} x2={ox} y2={oy - 300} stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <text x={ox + 310} y={oy + 20} className="font-serif italic text-sm fill-slate-500">x</text>
          <text x={ox - 20} y={oy - 290} className="font-serif italic text-sm fill-slate-500">y</text>
          <text x={ox - 15} y={oy + 20} className="font-serif italic text-sm fill-slate-500">O</text>
        </g>

        {/* 箭头定义 */}
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-400" />
          </marker>
        </defs>

        {/* 静态点 Q, P */}
        <circle cx={qx} cy={qy} r="4" className="fill-slate-800" />
        <text x={qx - 20} y={qy + 5} className="font-serif italic text-lg fill-slate-800">Q</text>
        
        <circle cx={px} cy={py} r="4" className="fill-slate-800" />
        <text x={px + 10} y={py - 10} className="font-serif italic text-lg fill-slate-800">P</text>

        {/* 动态三角形 ABC */}
        <motion.path 
          d={trianglePath} 
          className="fill-blue-100/50 stroke-blue-600" 
          strokeWidth="2" 
        />
        
        {/* 动态点 A, B, C 及其标签 */}
        <motion.g style={{ x: ax, y: ay }}>
          <circle r="4" className="fill-blue-600" />
          <text dx="-10" dy="20" className="font-serif italic text-lg fill-blue-800">A</text>
        </motion.g>
        <motion.g style={{ x: bx, y: by }}>
          <circle r="4" className="fill-blue-600" />
          <text dx="10" dy="20" className="font-serif italic text-lg fill-blue-800">B</text>
        </motion.g>
        <motion.g style={{ x: cx, y: cy }}>
          <circle r="4" className="fill-blue-600" />
          <text dx="15" dy="-10" className="font-serif italic text-lg fill-blue-800">C</text>
        </motion.g>

        {/* 线段 AQ 和 PC (步骤 0-2 显示 PC，步骤 3 之后隐藏 PC) */}
        <motion.path d={aqPath} className="stroke-slate-800" strokeWidth="2" />
        <AnimatePresence>
          {step <= 2 && (
            <motion.path 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              d={pcPath} 
              className="stroke-slate-800" 
              strokeWidth="2" 
            />
          )}
        </AnimatePresence>

        {/* 步骤 1: 强调向量 AC */}
        <AnimatePresence>
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.path 
                d={acVectorPath}
                className="stroke-red-500"
                strokeWidth="2"
                strokeDasharray="4 4"
                markerEnd="url(#arrow-red)"
              />
              <defs>
                <marker id="arrow-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" className="fill-red-500" />
                </marker>
              </defs>
            </motion.g>
          )}
        </AnimatePresence>

        {/* 步骤 2及以后: 平移点 P 到 P' */}
        <AnimatePresence>
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 向量 PP' */}
              <line x1={px} y1={py} x2={pPrimeX} y2={pPrimeY} className="stroke-red-500" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow-red)" />
              
              {/* 点 P' */}
              <circle cx={pPrimeX} cy={pPrimeY} r="4" className="fill-red-600" />
              <text x={pPrimeX - 25} y={pPrimeY - 10} className="font-serif italic text-lg fill-red-600">P'</text>
              
              {/* 平行四边形 AP'PC */}
              {step === 2 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <motion.path d={apPrimePath} className="stroke-red-400" strokeWidth="2" strokeDasharray="4 4" />
                  <motion.path d={pPrimeCPath} className="stroke-red-400" strokeWidth="2" strokeDasharray="4 4" />
                  <motion.path d={parallelogramFillPath} className="fill-red-100/30" />
                </motion.g>
              )}

              {/* 步骤 3及以后: 突出显示 AP' */}
              {step >= 3 && (
                <motion.path d={apPrimePath} className="stroke-red-500" strokeWidth="2.5" />
              )}
            </motion.g>
          )}
        </AnimatePresence>

        {/* 步骤 4及以后: 轴对称点 Q' 和连线 Q'P' */}
        <AnimatePresence>
          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <circle cx={qPrimeX} cy={qPrimeY} r="4" className="fill-emerald-600" />
              <text x={qPrimeX - 25} y={qPrimeY + 15} className="font-serif italic text-lg fill-emerald-600">Q'</text>
              <line x1={qx} y1={qy} x2={qPrimeX} y2={qPrimeY} className="stroke-emerald-500" strokeWidth="2" strokeDasharray="4 4" />
              
              <motion.line 
                x1={qPrimeX} y1={qPrimeY} x2={pPrimeX} y2={pPrimeY} 
                className="stroke-emerald-500" 
                strokeWidth="2.5" 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
              />
            </motion.g>
          )}
        </AnimatePresence>

        {/* 步骤 5: 构造直角三角形计算 */}
        <AnimatePresence>
          {step >= 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <path d={`M ${qPrimeX} ${qPrimeY} L ${pPrimeX} ${qPrimeY} L ${pPrimeX} ${pPrimeY}`} className="stroke-slate-400" strokeWidth="2" strokeDasharray="4 4" />
              <text x={(qPrimeX + pPrimeX) / 2} y={qPrimeY + 20} className="font-serif text-sm fill-slate-600">3</text>
              <text x={pPrimeX + 10} y={(qPrimeY + pPrimeY) / 2} className="font-serif text-sm fill-slate-600">6</text>
              
              {/* 直角符号 */}
              <path d={`M ${pPrimeX - 10} ${qPrimeY} L ${pPrimeX - 10} ${qPrimeY - 10} L ${pPrimeX} ${qPrimeY - 10}`} className="stroke-slate-400 fill-none" strokeWidth="1.5" />
            </motion.g>
          )}
        </AnimatePresence>

      </svg>
    </div>
  );
}
