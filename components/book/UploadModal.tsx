'use client';

import { useState, useRef } from 'react';
import { AnimatePresence, motion, Reorder } from 'framer-motion';
import { Upload, Camera, X, Loader2, Plus } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface UploadModalProps {
  bookId: string;
  currentPageCount: number;
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

interface PreviewFile {
  id: string;
  file: File;
  previewUrl: string;
}

export default function UploadModal({ bookId, currentPageCount, isOpen, onClose, onUploadComplete }: UploadModalProps) {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | File[]) => {
    const validFiles = Array.from(newFiles).filter(f => f.type.startsWith('image/'));
    const newPreviewFiles = validFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      previewUrl: URL.createObjectURL(file)
    }));
    setFiles(prev => [...prev, ...newPreviewFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const filtered = prev.filter(f => f.id !== id);
      const removed = prev.find(f => f.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return filtered;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setIsUploading(true);

    try {
      const uploadedUrls: string[] = [];
      for (const f of files) {
        const formData = new FormData();
        formData.append('file', f.file);
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!res.ok) throw new Error('Upload failed');
        const { url } = await res.json();
        uploadedUrls.push(url);
      }

      const pages = uploadedUrls.map((url, i) => ({
        imageUrl: url,
        pageNumber: currentPageCount + i + 1
      }));

      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, pages })
      });

      if (!res.ok) throw new Error('Failed to create pages');

      onUploadComplete();
      handleClose();
    } catch (err) {
      console.error(err);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    files.forEach(f => URL.revokeObjectURL(f.previewUrl));
    setFiles([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="modal-content bg-paper rounded-xl shadow-book w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-ink/10 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-ink">Add Pages</h2>
            <button onClick={handleClose} className="p-2 hover:bg-black/5 rounded-full transition-colors text-ink/60">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            {files.length === 0 ? (
              <div 
                className={cn(
                  "border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center transition-colors",
                  isDragging ? "border-ink bg-ink/5" : "border-ink/20 hover:border-ink/40"
                )}
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <div className="flex gap-4 mb-6">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-secondary flex flex-col items-center gap-2 p-4 h-auto"
                  >
                    <Upload className="h-6 w-6" />
                    <span>Upload Files</span>
                  </button>
                  <button 
                    onClick={() => cameraInputRef.current?.click()}
                    className="btn-secondary flex flex-col items-center gap-2 p-4 h-auto sm:hidden"
                  >
                    <Camera className="h-6 w-6" />
                    <span>Take Photo</span>
                  </button>
                </div>
                <p className="text-ink/60 font-sans text-sm">Or drop images here</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Reorder.Group 
                  axis="y" 
                  values={files} 
                  onReorder={setFiles}
                  className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4"
                >
                  {files.map((f, i) => (
                    <Reorder.Item key={f.id} value={f} className="relative group cursor-grab active:cursor-grabbing">
                      <div className="aspect-[3/4] relative rounded-lg overflow-hidden border border-ink/10">
                        <Image src={f.previewUrl} alt="Preview" fill className="object-cover" />
                        <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm">
                          {currentPageCount + i + 1}
                        </div>
                        <button
                          onClick={() => removeFile(f.id)}
                          className="absolute top-1 right-1 bg-white/90 text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
                
                <div className="flex justify-center pt-4">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-ink/60 hover:text-ink text-sm flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Add more images
                  </button>
                </div>
              </div>
            )}

            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              multiple 
              onChange={e => e.target.files && handleFiles(e.target.files)}
            />
            <input 
              type="file" 
              ref={cameraInputRef} 
              className="hidden" 
              accept="image/*" 
              capture="environment" 
              onChange={e => e.target.files && handleFiles(e.target.files)}
            />
          </div>

          <div className="p-6 border-t border-ink/10 flex justify-end gap-3 bg-white/50">
            <button onClick={handleClose} disabled={isUploading} className="btn-secondary">
              Cancel
            </button>
            <button 
              onClick={handleUpload} 
              disabled={files.length === 0 || isUploading}
              className="btn-primary min-w-[140px] justify-center"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                `Upload ${files.length} page${files.length !== 1 ? 's' : ''}`
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
