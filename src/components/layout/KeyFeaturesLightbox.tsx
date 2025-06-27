import React, { useState } from 'react';

interface KeyFeaturesLightboxProps {
  images: { src: string; alt?: string }[];
  photoIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const KeyFeaturesLightbox: React.FC<KeyFeaturesLightboxProps> = ({ images, photoIndex, isOpen, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [index, setIndex] = useState(photoIndex);

  React.useEffect(() => {
    if (isOpen) setIndex(photoIndex);
    setZoom(1);
  }, [isOpen, photoIndex]);

  if (!isOpen) return null;
  const img = images[index];
  if (!img) {
    // Defensive: if index is out of bounds, close modal
    setTimeout(onClose, 0);
    return null;
  }
  const hasPrev = images.length > 1;
  const hasNext = images.length > 1;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm transition-all">
      <button className="absolute top-6 right-8 text-white text-3xl font-bold z-10 hover:scale-110 transition-transform" onClick={onClose} aria-label="Close">×</button>
      {hasPrev && (
        <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl z-10 hover:scale-125 transition-transform" onClick={() => { setIndex((index + images.length - 1) % images.length); setZoom(1); }} aria-label="Previous">‹</button>
      )}
      {hasNext && (
        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl z-10 hover:scale-125 transition-transform" onClick={() => { setIndex((index + 1) % images.length); setZoom(1); }} aria-label="Next">›</button>
      )}
      <div className="flex flex-col items-center">
        <div className="flex gap-4 mb-4">
          <button className="bg-white/10 text-white px-4 py-2 rounded hover:bg-white/20" onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} aria-label="Zoom Out">-</button>
          <button className="bg-white/10 text-white px-4 py-2 rounded hover:bg-white/20" onClick={() => setZoom(z => Math.min(3, z + 0.2))} aria-label="Zoom In">+</button>
          <span className="text-white">{Math.round(zoom * 100)}%</span>
        </div>
        <img
          src={img.src}
          alt={img.alt || ''}
          style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s', maxHeight: '80vh', maxWidth: '90vw', borderRadius: '1.5rem', boxShadow: '0 0 80px #9d4ffe99' }}
          className="bg-black"
          draggable={false}
        />
        <div className="text-white mt-4 text-center text-lg font-medium">{img.alt}</div>
      </div>
    </div>
  );
};

export default KeyFeaturesLightbox; 