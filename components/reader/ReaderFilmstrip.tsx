'use client'

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Page {
  id: string;
  imageUrl: string;
  pageNumber: number;
}

interface ReaderFilmstripProps {
  pages: Page[];
  currentPage: number;
  onPageSelect: (page: number) => void;
  isVisible: boolean;
}

export default function ReaderFilmstrip({
  pages,
  currentPage,
  onPageSelect,
  isVisible
}: ReaderFilmstripProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isVisible && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeThumb = container.querySelector('[data-active="true"]') as HTMLElement;
      
      if (activeThumb) {
        const containerCenter = container.clientWidth / 2;
        const thumbCenter = activeThumb.offsetLeft + activeThumb.clientWidth / 2;
        
        container.scrollTo({
          left: thumbCenter - containerCenter,
          behavior: 'smooth'
        });
      }
    }
  }, [currentPage, isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute bottom-0 left-0 right-0 z-50 flex flex-col backdrop-blur-md"
          style={{ 
            backgroundColor: 'var(--reader-surface, rgba(255, 255, 255, 0.8))',
            borderTop: '1px solid var(--reader-border, rgba(0,0,0,0.1))'
          }}
        >
          <div className="w-full px-4 pt-2 pb-1">
            <input
              type="range"
              min={1}
              max={pages.length}
              value={currentPage}
              onChange={(e) => onPageSelect(parseInt(e.target.value, 10))}
              className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
            />
          </div>
          
          <div 
            ref={scrollContainerRef}
            className="flex w-full overflow-x-auto gap-2 px-4 pb-3 pt-1 items-center"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {pages.map((page) => {
              const isActive = page.pageNumber === currentPage;
              return (
                <button
                  key={page.id}
                  data-active={isActive}
                  onClick={() => onPageSelect(page.pageNumber)}
                  className={cn(
                    "relative flex-shrink-0 h-12 aspect-[3/4] overflow-hidden rounded-sm transition-all",
                    isActive ? "ring-2 ring-blue-500 scale-110" : "opacity-60 hover:opacity-100"
                  )}
                >
                  <img
                    src={page.imageUrl}
                    alt={`Page ${page.pageNumber}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
