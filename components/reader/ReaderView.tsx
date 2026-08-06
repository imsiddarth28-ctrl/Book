'use client'

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import ReaderHeader from './ReaderHeader';
import ReaderCanvas from './ReaderCanvas';
import ReaderControls from './ReaderControls';
import ReaderFilmstrip from './ReaderFilmstrip';

type Theme = 'light' | 'sepia' | 'dark';

interface Page {
  id: string;
  imageUrl: string;
  pageNumber: number;
}

interface Book {
  id: string;
  title: string;
  pages: Page[];
}

interface ReaderViewProps {
  book: Book;
  initialPage: number;
}

export default function ReaderView({ book, initialPage }: ReaderViewProps) {
  const router = useRouter();
  const sortedPages = [...book.pages].sort((a, b) => a.pageNumber - b.pageNumber);
  
  const validInitialPage = Math.max(1, Math.min(initialPage, sortedPages.length));
  const [currentPage, setCurrentPage] = useState(validInitialPage);
  const [theme, setTheme] = useState<Theme>('light');
  const [isZoomed, setIsZoomed] = useState(false);
  const [showUI, setShowUI] = useState(true);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('reader-theme') as Theme;
    if (savedTheme && ['light', 'sepia', 'dark'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('reader-theme', theme);
  }, [theme]);

  useEffect(() => {
    const preloadImage = (index: number) => {
      if (index >= 0 && index < sortedPages.length) {
        const img = new Image();
        img.src = sortedPages[index].imageUrl;
      }
    };
    preloadImage(currentPage);
    preloadImage(currentPage - 2);
  }, [currentPage, sortedPages]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const resetTimeout = () => {
      setShowUI(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setShowUI(false);
      }, 3000);
    };

    if (showUI && !isZoomed) {
      resetTimeout();
    }

    const handleInteraction = () => resetTimeout();
    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [showUI, isZoomed]);

  const goToPage = useCallback((pageNum: number) => {
    const targetPage = Math.max(1, Math.min(pageNum, sortedPages.length));
    setCurrentPage(targetPage);
    window.history.replaceState(null, '', `/book/${book.id}/read?page=${targetPage}`);
  }, [book.id, sortedPages.length]);

  const nextPage = useCallback(() => {
    if (currentPage < sortedPages.length) goToPage(currentPage + 1);
  }, [currentPage, sortedPages.length, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextPage();
      else if (e.key === 'ArrowLeft') prevPage();
      else if (e.key === 'Escape') router.push(`/book/${book.id}`);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextPage, prevPage, router, book.id]);

  const handleThemeChange = () => {
    const themes: Theme[] = ['light', 'sepia', 'dark'];
    const currentIndex = themes.indexOf(theme);
    setTheme(themes[(currentIndex + 1) % themes.length]);
  };

  return (
    <div 
      className={cn(
        "relative h-[100dvh] w-full overflow-hidden select-none",
        `reader-${theme}`
      )}
      style={{
        backgroundColor: 'var(--reader-bg, #FBF9F5)',
        color: 'var(--reader-text, #1A1A1A)'
      }}
    >
      <ReaderHeader 
        title={book.title}
        currentPage={currentPage}
        totalPages={sortedPages.length}
        theme={theme}
        onThemeChange={handleThemeChange}
        isVisible={showUI && !isZoomed}
        onClose={() => router.push(`/book/${book.id}`)}
      />
      
      <ReaderCanvas 
        pages={sortedPages}
        currentPage={currentPage}
        onPageChange={goToPage}
        onToggleUI={() => setShowUI(prev => !prev)}
        isZoomed={isZoomed}
        setIsZoomed={setIsZoomed}
      />
      
      {!isZoomed && (
        <ReaderControls 
          onPrev={prevPage}
          onNext={nextPage}
          hasPrev={currentPage > 1}
          hasNext={currentPage < sortedPages.length}
        />
      )}
      
      <ReaderFilmstrip 
        pages={sortedPages}
        currentPage={currentPage}
        onPageSelect={goToPage}
        isVisible={showUI && !isZoomed}
      />
    </div>
  );
}
