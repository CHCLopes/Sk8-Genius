import React from 'react';
import { cn } from '../utils/cn';
import { Colors } from '../utils/gameLogic';

interface ColorPadProps {
  colorCode: Colors;
  isActive: boolean;
  isPowerOn: boolean;
  onClick: (color: Colors) => void;
  className?: string;
}

const colorStyles: Record<Colors, { base: string; active: string }> = {
  [Colors.GREEN]: {
    base: 'bg-green-900/40 border-green-700/50',
    active: 'bg-green-500 shadow-[0_0_35px_rgba(34,197,94,0.9)] border-green-400',
  },
  [Colors.RED]: {
    base: 'bg-red-900/40 border-red-700/50',
    active: 'bg-red-500 shadow-[0_0_35px_rgba(239,68,68,0.9)] border-red-400',
  },
  [Colors.YELLOW]: {
    base: 'bg-yellow-900/40 border-yellow-700/50',
    active: 'bg-yellow-400 shadow-[0_0_35px_rgba(250,204,21,0.9)] border-yellow-300',
  },
  [Colors.BLUE]: {
    base: 'bg-blue-900/40 border-blue-700/50',
    active: 'bg-blue-500 shadow-[0_0_35px_rgba(59,130,246,0.9)] border-blue-400',
  },
};

const colorNames: Record<Colors, string> = {
  [Colors.GREEN]: "Green",
  [Colors.RED]: "Red",
  [Colors.YELLOW]: "Yellow",
  [Colors.BLUE]: "Blue",
};

export const ColorPad: React.FC<ColorPadProps> = React.memo(({
  colorCode,
  isActive,
  isPowerOn,
  onClick,
  className,
}) => {
  const styles = colorStyles[colorCode];

  return (
    <button
      type="button"
      onPointerDown={() => onClick(colorCode)}
      className={cn(
        'w-full h-full relative cursor-pointer outline-none border-[6px]',
        'transition-all duration-150 ease-out touch-none select-none',
        // Glassmorphism default state
        'backdrop-blur-sm',
        isPowerOn ? styles.base : 'bg-slate-800 border-slate-700 opacity-50',
        isActive && isPowerOn ? styles.active : '',
        isActive && isPowerOn ? 'scale-[1.02] z-10' : 'hover:scale-[1.01]',
        className
      )}
      aria-label={`Color Pad ${colorNames[colorCode]}`}
      disabled={!isPowerOn}
    />
  );
});
