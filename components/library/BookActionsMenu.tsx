'use client';
import { useState, useRef, useEffect } from 'react';
import { Pencil, Palette, Trash2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const PRESET_COLORS = [
  '#6B6358', '#8B7355', '#5B7065', '#6B5B7B', '#7B5B5B', '#4A5568',
  '#744210', '#285E61', '#553C9A', '#9B2C2C', '#2C5282', '#276749'
];

interface BookActionsMenuProps {
  book: { id: string; title: string; coverColor: string };
  onClose: () => void;
  onUpdate: () => void;
}

export default function BookActionsMenu({ book, onClose, onUpdate }: BookActionsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'menu' | 'rename' | 'color' | 'delete'>('menu');
  const [newTitle, setNewTitle] = useState(book.title);
  const [newColor, setNewColor] = useState(book.coverColor);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleUpdate = async (updates: { title?: string; coverColor?: string }) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/books/${book.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        onUpdate();
        onClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/books/${book.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onUpdate();
        onClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      ref={menuRef}
      className="absolute top-10 right-0 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden font-sans text-sm"
    >
      {mode === 'menu' && (
        <div className="py-1">
          <button 
            onClick={() => setMode('rename')}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center text-gray-700 transition-colors"
          >
            <Pencil className="w-4 h-4 mr-2 text-gray-400" /> Rename
          </button>
          <button 
            onClick={() => setMode('color')}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center text-gray-700 transition-colors"
          >
            <Palette className="w-4 h-4 mr-2 text-gray-400" /> Change cover
          </button>
          <div className="h-px bg-gray-100 my-1" />
          <button 
            onClick={() => setMode('delete')}
            className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2 text-red-400" /> Delete book
          </button>
        </div>
      )}

      {mode === 'rename' && (
        <div className="p-3">
          <label className="block text-xs text-gray-500 mb-1">New Title</label>
          <input 
            type="text" 
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="input-field w-full border border-gray-200 rounded px-2 py-1 mb-2 focus:outline-none focus:border-gray-400"
            autoFocus
          />
          <div className="flex gap-2">
            <button onClick={() => setMode('menu')} className="btn-ghost flex-1 py-1 text-gray-500 border rounded hover:bg-gray-50">Cancel</button>
            <button 
              onClick={() => handleUpdate({ title: newTitle })} 
              disabled={isSubmitting || !newTitle.trim()}
              className="btn-primary flex-1 py-1 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {mode === 'color' && (
        <div className="p-3">
          <label className="block text-xs text-gray-500 mb-2">Select Color</label>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setNewColor(c)}
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center relative transition-all duration-200",
                  newColor === c ? "border-2 border-gray-900 scale-110 shadow-sm" : "border border-black/10 hover:scale-110"
                )}
                style={{ backgroundColor: c }}
              >
                {newColor === c && <Check className="w-3 h-3 text-white drop-shadow-md" />}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setMode('menu')} className="btn-ghost flex-1 py-1 text-gray-500 border rounded hover:bg-gray-50">Cancel</button>
            <button 
              onClick={() => handleUpdate({ coverColor: newColor })} 
              disabled={isSubmitting}
              className="btn-primary flex-1 py-1 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {mode === 'delete' && (
        <div className="p-3 text-center">
          <p className="text-gray-800 mb-1">Delete this book?</p>
          <p className="text-xs text-gray-500 mb-3">This action cannot be undone.</p>
          <div className="flex gap-2">
            <button onClick={() => setMode('menu')} className="btn-ghost flex-1 py-1 text-gray-500 border rounded hover:bg-gray-50">Cancel</button>
            <button 
              onClick={handleDelete} 
              disabled={isSubmitting}
              className="btn-primary flex-1 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
