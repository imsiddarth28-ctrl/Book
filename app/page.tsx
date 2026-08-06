'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Library, Plus, LogOut, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BookCard from '@/components/library/BookCard';
import NewBookModal from '@/components/library/NewBookModal';
import { cn } from '@/lib/utils';

interface Book {
  id: string;
  title: string;
  coverColor: string;
  createdAt: string;
  _count?: { pages: number };
}

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewBookModalOpen, setIsNewBookModalOpen] = useState(false);
  const router = useRouter();

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/books');
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-gray-900 p-6 md:p-12 font-sans">
      <header className="flex justify-between items-center mb-12">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-gray-900">Notebook</h1>
        <button 
          onClick={handleLogout}
          className="btn-ghost flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl flex items-center gap-3">
            <Library className="w-6 h-6 text-gray-400" />
            Your Library
            {!loading && <span className="text-gray-400 text-lg ml-2 font-sans">({books.length})</span>}
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card h-64 bg-gray-100 animate-pulse rounded-lg shadow-sm" />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <BookOpen className="w-16 h-16 mb-4 text-gray-300" />
            <h3 className="font-serif text-xl mb-2 text-gray-700">Your library is empty</h3>
            <p className="mb-6">Create your first book to start taking notes.</p>
            <button 
              onClick={() => setIsNewBookModalOpen(true)}
              className="btn-primary flex items-center px-6 py-2.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Book
            </button>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            {books.map((book) => (
              <motion.div
                key={book.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
                }}
              >
                <BookCard book={book} onUpdate={fetchBooks} />
              </motion.div>
            ))}
            
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <button
                onClick={() => setIsNewBookModalOpen(true)}
                className="w-full h-full min-h-[16rem] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-400 hover:bg-gray-50/50 transition-all duration-200"
              >
                <Plus className="w-8 h-8 mb-2" />
                <span className="font-medium">New Book</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </main>

      <AnimatePresence>
        {isNewBookModalOpen && (
          <NewBookModal 
            onClose={() => setIsNewBookModalOpen(false)}
            onCreate={() => {
              setIsNewBookModalOpen(false);
              fetchBooks();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
