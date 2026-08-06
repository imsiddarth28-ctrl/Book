'use client'

import { X, Sun, Moon, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Theme = 'light' | 'sepia' | 'dark';

interface ReaderHeaderProps {
  title: string;
  currentPage: number;
  totalPages: number;
  theme: Theme;
  onThemeChange: () => void;
  isVisible: boolean;
  onClose: () => void;
}

export default function ReaderHeader({
  title,
  currentPage,
  totalPages,
  theme,
  onThemeChange,
  isVisible,
  onClose
}: ReaderHeaderProps) {
  const ThemeIcon = theme === 'light' ? Sun : theme === 'sepia' ? Coffee : Moon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute top-0 left-0 right-0 z-50 flex h-12 items-center justify-between px-4 backdrop-blur-md"
          style={{ 
            backgroundColor: 'var(--reader-surface, rgba(255, 255, 255, 0.8))',
            borderBottom: '1px solid var(--reader-border, rgba(0,0,0,0.1))'
          }}
        >
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Close reader"
          >
            <X size={20} />
          </button>
          
          <div className="flex flex-col items-center justify-center overflow-hidden px-4">
            <h1 className="truncate font-serif text-sm font-medium w-full max-w-[200px] sm:max-w-md text-center">
              {title}
            </h1>
            <span className="text-xs opacity-70">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          
          <button 
            onClick={onThemeChange}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle theme"
          >
            <ThemeIcon size={18} />
          </button>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
