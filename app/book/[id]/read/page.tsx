'use client'

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ReaderView from '@/components/reader/ReaderView';
import { Loader2 } from 'lucide-react';

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

export default function ReaderPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const bookId = params.id as string;
  const pageParam = searchParams.get('page');
  const initialPage = pageParam ? parseInt(pageParam, 10) : 1;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/books/${bookId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch book');
        }
        const data = await res.json();
        setBook(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  if (loading) {
    return (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-[#FBF9F5]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-[#FBF9F5] text-red-500">
        <p>Error: {error || 'Book not found'}</p>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full overflow-hidden">
      <ReaderView book={book} initialPage={initialPage} />
    </div>
  );
}
