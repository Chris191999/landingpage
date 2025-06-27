
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageViewerModalProps {
  imageUrls: string[];
  startIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const ImageViewerModal = ({ imageUrls, startIndex, isOpen, onClose }: ImageViewerModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const startPanPointRef = useRef({ x: 0, y: 0 });
  const startClientPointRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(startIndex);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [isOpen, startIndex]);

  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1 || e.button !== 0) return;
    e.preventDefault();
    setIsPanning(true);
    startClientPointRef.current = { x: e.clientX, y: e.clientY };
    startPanPointRef.current = pan;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    e.preventDefault();
    const dx = e.clientX - startClientPointRef.current.x;
    const dy = e.clientY - startClientPointRef.current.y;
    setPan({
      x: startPanPointRef.current.x + dx,
      y: startPanPointRef.current.y + dy,
    });
  };

  const handleMouseUpOrLeave = (e: React.MouseEvent) => {
    if (isPanning && e.button === 0) {
      setIsPanning(false);
    }
  };
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="bg-black/90 border-0 w-screen h-screen max-w-none max-h-none rounded-none p-0 flex flex-col focus:outline-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onWheel={handleWheel}
      >
        <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent text-white">
          <h3 className="text-lg font-semibold">
            Image {currentIndex + 1} of {imageUrls.length}
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoom <= 0.5} className="text-white hover:bg-white/20"><ZoomOut /></Button>
            <span className="w-12 text-center text-sm">{Math.round(zoom * 100)}%</span>
            <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoom >= 5} className="text-white hover:bg-white/20"><ZoomIn /></Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20"><X /></Button>
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center overflow-hidden" onMouseDown={handleMouseDown}>
          <img
            src={imageUrls[currentIndex]}
            alt={`Trade content ${currentIndex + 1}`}
            className="max-w-full max-h-full transition-transform duration-100 ease-out"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              cursor: isPanning ? 'grabbing' : zoom > 1 ? 'grab' : 'default',
              willChange: 'transform',
            }}
          />
        </div>

        {imageUrls.length > 1 && (
          <>
            <Button onClick={handlePrev} variant="ghost" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/60 rounded-full h-12 w-12"><ChevronLeft size={32} /></Button>
            <Button onClick={handleNext} variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/60 rounded-full h-12 w-12"><ChevronRight size={32} /></Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewerModal;

