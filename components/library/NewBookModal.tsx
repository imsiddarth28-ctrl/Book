'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const PRESET_COLORS = [
  '#6B6358', '#8B7355', '#5B7065', '#6B5B7B', '#7B5B5B', '#4A5568',
  '#744210', '#285E61', '#553C9A', '#9B2C2C', '#2C5282', '#276749'
];

export default function NewBookModal({ onClose, onCreate }: { onClose: () => void; onCreate: () => void }) {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, coverColor: color }),
      });
      
      if (res.ok) {
        onCreate();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="modal-content bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}
      >
        {/* Left Side: Form */}
        <div className="flex-1 p-6 md:p-8 border-r border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl text-gray-900">Create New Book</h2>
            <button onClick={onClose} className="btn-icon p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors md:hidden">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Book Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="E.g., Design Notes, Journal..."
                className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                autoFocus
                required
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">Cover Color</label>
              <div className="grid grid-cols-6 gap-3">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border-2",
                      color === c ? "border-gray-900 scale-110 shadow-md" : "border-transparent hover:scale-110"
                    )}
                    style={{ backgroundColor: c }}
                  >
                    {color === c && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button 
                type="button" 
                onClick={onClose}
                className="btn-secondary px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="btn-primary px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Book
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Preview */}
        <div className="hidden md:flex w-72 bg-gray-50 flex-col items-center justify-center p-8 relative">
          <button onClick={onClose} className="btn-icon absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-sm font-medium text-gray-400 mb-6 tracking-wider uppercase">Preview</div>
          
          {/* Book Card Preview */}
          <div className="card w-full max-w-[180px] aspect-[3/4] rounded-r-lg rounded-l-sm shadow-book overflow-hidden flex flex-col bg-white">
            <div 
              className="h-32 relative flex items-center justify-center p-3 shadow-inner"
              style={{ backgroundColor: color }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/10 shadow-[1px_0_2px_rgba(0,0,0,0.1)] border-r border-black/5" />
              <h3 className="text-white font-serif text-lg font-medium text-center line-clamp-3 ml-2 drop-shadow-md break-words w-full" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                {title || 'Untitled Book'}
              </h3>
            </div>
            <div className="p-3 flex-1 flex flex-col justify-between bg-white">
              <h4 className="font-serif text-gray-900 font-medium line-clamp-1 text-sm">{title || 'Untitled Book'}</h4>
              <div className="text-[10px] text-gray-500 mt-2">0 pages</div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
