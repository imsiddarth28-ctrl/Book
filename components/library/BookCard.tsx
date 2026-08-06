'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import BookActionsMenu from './BookActionsMenu';
import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  coverColor: string;
  createdAt: string;
  _count?: { pages: number };
}

export default function BookCard({ book, onUpdate }: { book: Book; onUpdate: () => void }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.book-actions-menu')) return;
    router.push(`/book/${book.id}`);
  };

  const pagesCount = book._count?.pages || 0;
  const dateFormatted = new Date(book.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div 
      className="card card-hover relative group cursor-pointer transition-all duration-300 hover:-translate-y-0.5 shadow-book hover:shadow-book-hover rounded-r-lg rounded-l-sm overflow-hidden flex flex-col h-full bg-white border border-gray-100"
      onClick={handleClick}
    >
      {/* Menu Button */}
      <div className="absolute top-2 right-2 z-20 book-actions-menu">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          className="btn-icon p-1.5 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {isMenuOpen && (
          <BookActionsMenu 
            book={book} 
            onClose={() => setIsMenuOpen(false)} 
            onUpdate={onUpdate} 
          />
        )}
      </div>

      {/* Top Cover Section */}
      <div 
        className="h-40 relative flex items-center justify-center p-4 shadow-inner"
        style={{ backgroundColor: book.coverColor }}
      >
        {/* Spine effect */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/10 shadow-[1px_0_2px_rgba(0,0,0,0.1)] border-r border-black/5" />
        
        <h3 className="text-white font-serif text-xl font-medium text-center line-clamp-3 ml-2 drop-shadow-md z-10" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
          {book.title}
        </h3>
      </div>

      {/* Bottom Info Section */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-white">
        <div>
          <h4 className="font-serif text-gray-900 font-medium line-clamp-1 mb-1">{book.title}</h4>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
          <span>{pagesCount} {pagesCount === 1 ? 'page' : 'pages'}</span>
          <span>{dateFormatted}</span>
        </div>
      </div>
    </div>
  );
}
