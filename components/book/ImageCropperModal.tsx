'use client';

import { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Check, RotateCw, RotateCcw, Crop as CropIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob, croppedDataUrl: string) => void;
}

export default function ImageCropperModal({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [rotation, setRotation] = useState<number>(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    // Default initial crop to 90% centered box
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        width / height,
        width,
        height
      ),
      width,
      height
    );
    setCrop(initialCrop);
  }

  const rotateLeft = () => setRotation((prev) => (prev - 90) % 360);
  const rotateRight = () => setRotation((prev) => (prev + 90) % 360);

  const getCroppedImg = async (): Promise<{ blob: Blob; dataUrl: string } | null> => {
    const image = imgRef.current;
    if (!image) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const cropToUse = completedCrop || {
      x: 0,
      y: 0,
      width: image.naturalWidth,
      height: image.naturalHeight,
      unit: 'px',
    };

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const cropX = cropToUse.x * scaleX;
    const cropY = cropToUse.y * scaleY;
    const cropWidth = cropToUse.width * scaleX;
    const cropHeight = cropToUse.height * scaleY;

    // Handle rotation math
    const rotRad = (rotation * Math.PI) / 180;
    const isRotatedQuarter = Math.abs(rotation % 180) === 90;

    const outputWidth = isRotatedQuarter ? cropHeight : cropWidth;
    const outputHeight = isRotatedQuarter ? cropWidth : cropHeight;

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    ctx.save();
    ctx.translate(outputWidth / 2, outputHeight / 2);
    ctx.rotate(rotRad);

    if (isRotatedQuarter) {
      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        -cropHeight / 2,
        -cropWidth / 2,
        cropHeight,
        cropWidth
      );
    } else {
      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        -cropWidth / 2,
        -cropHeight / 2,
        cropWidth,
        cropHeight
      );
    }

    ctx.restore();

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(null);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          resolve({ blob, dataUrl });
        },
        'image/jpeg',
        0.92
      );
    });
  };

  const handleApply = async () => {
    setIsProcessing(true);
    try {
      const result = await getCroppedImg();
      if (result) {
        onCropComplete(result.blob, result.dataUrl);
        onClose();
      }
    } catch (err) {
      console.error('Failed to crop image:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-2 font-serif text-lg font-semibold text-gray-900">
              <CropIcon className="h-5 w-5 text-gray-700" />
              Crop Page Image
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Canvas & Cropper Body */}
          <div className="relative flex flex-1 items-center justify-center overflow-auto bg-gray-950 p-6">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              className="max-h-[65vh] max-w-full"
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                onLoad={onImageLoad}
                style={{ transform: `rotate(${rotation}deg)` }}
                className="max-h-[65vh] w-auto object-contain transition-transform duration-200"
              />
            </ReactCrop>
          </div>

          {/* Toolbar & Footer Controls */}
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
            {/* Rotation Tools */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={rotateLeft}
                className="btn-secondary flex items-center gap-1.5 px-3 py-2 text-xs"
                title="Rotate Left 90°"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Rotate Left</span>
              </button>
              <button
                type="button"
                onClick={rotateRight}
                className="btn-secondary flex items-center gap-1.5 px-3 py-2 text-xs"
                title="Rotate Right 90°"
              >
                <RotateCw className="h-4 w-4" />
                <span>Rotate Right</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary px-4 py-2"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={isProcessing}
                className="btn-primary flex items-center gap-2 px-5 py-2"
              >
                <Check className="h-4 w-4" />
                {isProcessing ? 'Cropping...' : 'Apply Crop'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
