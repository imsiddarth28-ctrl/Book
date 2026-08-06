'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import PageGrid from '@/components/book/PageGrid';
import UploadModal from '@/components/book/UploadModal';

interface Page {
  id: string;
  imageUrl: string;
  pageNumber: number;
}

interface Book {
  id: string;
  title: string;
  coverColor: string;
  createdAt: string;
  pages: Page[];
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState('');

  const fetchBook = async () => {
    try {
      const res = await fetch(`/api/books/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setBook(data);
        setTitle(data.title);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [params.id]);

  const handleTitleUpdate = async () => {
    setEditingTitle(false);
    if (title !== book?.title && title.trim()) {
      try {
        const res = await fetch(`/api/books/${params.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title }),
        });
        if (res.ok) {
          setBook((prev) => prev ? { ...prev, title } : null);
        } else {
          setTitle(book?.title || '');
        }
      } catch (err) {
        console.error(err);
        setTitle(book?.title || '');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FBF9F5]">
        <Loader2 className="h-8 w-8 animate-spin text-ink/50" />
      </div>
    );
  }

  if (!book) {
    return <div className="p-8 min-h-screen bg-[#FBF9F5]">Book not found.</div>;
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] p-4 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="btn-icon p-2 hover:bg-black/5 rounded-full transition-colors">
              <ArrowLeft className="h-6 w-6 text-ink" />
            </Link>
            <div className="flex items-center gap-3">
              <div 
                className="h-4 w-4 rounded-full shadow-sm" 
                style={{ backgroundColor: book.coverColor }} 
              />
              {editingTitle ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleUpdate}
                  onKeyDown={(e) => e.key === 'Enter' && handleTitleUpdate()}
                  className="font-serif text-3xl font-bold text-ink bg-transparent border-b border-ink/20 focus:outline-none focus:border-ink"
                  autoFocus
                />
              ) : (
                <h1 
                  className="font-serif text-3xl font-bold text-ink cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setEditingTitle(true)}
                >
                  {book.title}
                </h1>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href={`/book/${book.id}/read?page=1`}
              className={cn(
                "btn-primary inline-flex items-center gap-2",
                book.pages.length === 0 && "opacity-50 pointer-events-none"
              )}
            >
              <BookOpen className="h-4 w-4" />
              Read
            </Link>
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Pages
            </button>
          </div>
        </header>

        <div>
          <p className="text-ink/60 font-sans text-sm">
            {book.pages.length} {book.pages.length === 1 ? 'page' : 'pages'} • Created {new Date(book.createdAt).toLocaleDateString()}
          </p>
        </div>

        {book.pages.length === 0 ? (
          <div className="card border-dashed border-2 border-ink/10 bg-transparent flex flex-col items-center justify-center p-16 text-center space-y-4 rounded-xl">
            <BookOpen className="h-12 w-12 text-ink/20" />
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-medium text-ink">No pages yet</h3>
              <p className="text-ink/60 font-sans max-w-sm">Add some photos of your notes to get started building your digital notebook.</p>
            </div>
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="btn-secondary mt-4 inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Pages
            </button>
          </div>
        ) : (
          <PageGrid 
            bookId={book.id} 
            pages={book.pages} 
            onUpdate={fetchBook} 
          />
        )}
      </div>

      <UploadModal 
        bookId={book.id}
        currentPageCount={book.pages.length}
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={fetchBook}
      />
    </div>
  );
}
