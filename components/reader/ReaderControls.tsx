'use client'

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReaderControlsProps {
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function ReaderControls({
  onPrev,
  onNext,
  hasPrev,
  hasNext
}: ReaderControlsProps) {
  const [activeSide, setActiveSide] = useState<'left' | 'right' | null>(null);

  const handleTap = (side: 'left' | 'right') => {
    setActiveSide(side);
    setTimeout(() => setActiveSide(null), 300);
    
    if (side === 'left' && hasPrev) onPrev();
    else if (side === 'right' && hasNext) onNext();
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex">
      <div 
        className="w-1/4 h-full pointer-events-auto cursor-pointer flex items-center justify-start px-4"
        onClick={(e) => {
          e.stopPropagation();
          handleTap('left');
        }}
      >
        <AnimatePresence>
          {activeSide === 'left' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-black/20 dark:bg-white/20 p-4 rounded-full backdrop-blur-sm text-white"
            >
              <ChevronLeft size={32} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-2/4 h-full pointer-events-none"></div>

      <div 
        className="w-1/4 h-full pointer-events-auto cursor-pointer flex items-center justify-end px-4"
        onClick={(e) => {
          e.stopPropagation();
          handleTap('right');
        }}
      >
        <AnimatePresence>
          {activeSide === 'right' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-black/20 dark:bg-white/20 p-4 rounded-full backdrop-blur-sm text-white"
            >
              <ChevronRight size={32} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
