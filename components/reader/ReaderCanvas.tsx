'use client'

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Page {
  id: string;
  imageUrl: string;
  pageNumber: number;
}

interface ReaderCanvasProps {
  pages: Page[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onToggleUI: () => void;
  isZoomed: boolean;
  setIsZoomed: (zoomed: boolean) => void;
}

export default function ReaderCanvas({
  pages,
  currentPage,
  onPageChange,
  onToggleUI,
  isZoomed,
  setIsZoomed
}: ReaderCanvasProps) {
  const [direction, setDirection] = useState(0);
  const prevPageRef = useRef(currentPage);
  
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const touchStartRef = useRef<{x: number, y: number} | null>(null);
  const initialPinchDistRef = useRef<number | null>(null);
  const lastScaleRef = useRef(1);
  
  useEffect(() => {
    if (currentPage > prevPageRef.current) setDirection(1);
    else if (currentPage < prevPageRef.current) setDirection(-1);
    prevPageRef.current = currentPage;
    
    setIsZoomed(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [currentPage, setIsZoomed]);

  const currentIndex = currentPage - 1;
  const currentImage = pages[currentIndex];

  if (!currentImage) return null;

  const handleDoubleTap = () => {
    if (scale > 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setIsZoomed(false);
    } else {
      setScale(2);
      setPosition({ x: 0, y: 0 });
      setIsZoomed(true);
    }
  };

  const getDistance = (t1: React.Touch, t2: React.Touch) => {
    return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      initialPinchDistRef.current = getDistance(e.touches[0], e.touches[1]);
      lastScaleRef.current = scale;
    } else if (e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistRef.current) {
      const dist = getDistance(e.touches[0], e.touches[1]);
      const delta = dist / initialPinchDistRef.current;
      const newScale = Math.min(Math.max(1, lastScaleRef.current * delta), 4);
      
      setScale(newScale);
      if (newScale > 1) {
        setIsZoomed(true);
      } else {
        setIsZoomed(false);
        setPosition({ x: 0, y: 0 });
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      initialPinchDistRef.current = null;
    }
    
    if (e.changedTouches.length === 1 && !isZoomed && touchStartRef.current) {
      const endX = e.changedTouches[0].clientX;
      const dx = endX - touchStartRef.current.x;
      
      if (Math.abs(dx) > 50) {
        if (dx > 0 && currentPage > 1) onPageChange(currentPage - 1);
        else if (dx < 0 && currentPage < pages.length) onPageChange(currentPage + 1);
      } else if (Math.abs(dx) < 10 && Math.abs(e.changedTouches[0].clientY - touchStartRef.current.y) < 10) {
        // Handled by onClick mostly, but for mobile tap compatibility
        const width = window.innerWidth;
        if (endX < width * 0.25) { if (currentPage > 1) onPageChange(currentPage - 1); }
        else if (endX > width * 0.75) { if (currentPage < pages.length) onPageChange(currentPage + 1); }
        else { onToggleUI(); }
      }
      touchStartRef.current = null;
    }
  };

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 100 : -100, opacity: 0 }),
  };

  return (
    <div 
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center z-0"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleTap}
      style={{ touchAction: isZoomed ? 'none' : 'auto' }}
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentPage}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute flex h-full w-full items-center justify-center p-4 md:p-8"
        >
          <motion.img
            src={currentImage.imageUrl}
            alt={`Page ${currentPage}`}
            className="max-h-full max-w-full rounded-md shadow-book object-contain"
            style={{ 
              scale, 
              x: position.x, 
              y: position.y,
              cursor: isZoomed ? 'grab' : 'default',
              transformOrigin: 'center'
            }}
            drag={isZoomed}
            dragConstraints={containerRef}
            dragElastic={0.1}
            onDrag={(e, info) => {
              setPosition({ x: info.point.x, y: info.point.y });
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
