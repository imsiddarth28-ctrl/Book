'use client';

import { useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DeletePageDialog from './DeletePageDialog';

export interface Page {
  id: string;
  imageUrl: string;
  pageNumber: number;
}

interface PageGridProps {
  bookId: string;
  pages: Page[];
  onUpdate: () => void;
}

export default function PageGrid({ bookId, pages, onUpdate }: PageGridProps) {
  const router = useRouter();
  const [items, setItems] = useState(pages);
  const [deletePageId, setDeletePageId] = useState<string | null>(null);

  useEffect(() => {
    setItems(pages);
  }, [pages]);

  const handleReorder = async (newOrder: Page[]) => {
    setItems(newOrder);
    
    try {
      const pageIds = newOrder.map(p => p.id);
      await fetch('/api/pages/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, pageIds }),
      });
      onUpdate();
    } catch (err) {
      console.error('Failed to reorder', err);
    }
  };

  const handleDelete = async () => {
    if (!deletePageId) return;
    const targetId = deletePageId;
    setDeletePageId(null);
    
    // Optimistic UI update: remove page from state instantly
    setItems(prev => prev.filter(p => p.id !== targetId));

    try {
      await fetch(`/api/pages/${targetId}`, { method: 'DELETE' });
      onUpdate();
    } catch (err) {
      console.error('Failed to delete', err);
      onUpdate(); // Re-sync if failed
    }
  };

  const deletingPage = pages.find(p => p.id === deletePageId);

  return (
    <>
      <Reorder.Group 
        axis="y" 
        values={items} 
        onReorder={handleReorder}
        className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
        layoutScroll
      >
        {items.map((page) => (
          <Reorder.Item 
            key={page.id} 
            value={page}
            className="group relative cursor-pointer"
            whileDrag={{ scale: 1.05, zIndex: 10 }}
          >
            <div 
              className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-book transition-shadow hover:shadow-book-hover bg-paper"
              onClick={() => router.push(`/book/${bookId}/read?page=${page.pageNumber}`)}
            >
              <Image 
                src={page.imageUrl} 
                alt={`Page ${page.pageNumber}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
            </div>
            
            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md font-sans backdrop-blur-sm">
              {page.pageNumber}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeletePageId(page.id);
              }}
              className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <X className="h-4 w-4" />
            </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <DeletePageDialog 
        isOpen={!!deletePageId}
        onClose={() => setDeletePageId(null)}
        onConfirm={handleDelete}
        pageNumber={deletingPage?.pageNumber || 0}
      />
    </>
  );
}
