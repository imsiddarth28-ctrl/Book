'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface DeletePageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pageNumber: number;
}

export default function DeletePageDialog({ isOpen, onClose, onConfirm, pageNumber }: DeletePageDialogProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="modal-content bg-paper rounded-xl shadow-book max-w-sm w-full p-6 text-center"
        >
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-500">
            <AlertTriangle className="h-6 w-6" />
          </div>
          
          <h2 className="font-serif text-xl font-bold text-ink mb-2">Delete this page?</h2>
          <p className="text-ink/60 font-sans text-sm mb-6">
            You are about to delete page {pageNumber}. This action cannot be undone.
          </p>
          
          <div className="flex gap-3 justify-center">
            <button onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={onConfirm} className="btn-primary flex-1 bg-red-500 hover:bg-red-600 text-white border-none">
              Delete
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
