import React, { useState, useRef, MouseEvent, TouchEvent } from 'react';
import Spinner from './Spinner';

type Point = { x: number; y: number; label: number };

interface MaskRefinerProps {
  image: string;
  mask: string | null;
  onRefine: (points: Point[]) => void;
  isProcessing: boolean;
  processingText: string;
}

const MaskRefiner: React.FC<MaskRefinerProps> = ({ image, mask, onRefine, isProcessing, processingText }) => {
  const [points, setPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getCoords = (e: MouseEvent | TouchEvent): { x: number; y: number } | null => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    };
  };

  const handleStartDrawing = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    setPoints([]); // Reset points on new drawing
    setIsDrawing(true);
    const coords = getCoords(e as MouseEvent & TouchEvent);
    if (coords) {
      setPoints([{ ...coords, label: 1 }]);
    }
  };

  const handleDraw = (e: MouseEvent | TouchEvent) => {
    if (!isDrawing || isProcessing) return;
    e.preventDefault();
    const coords = getCoords(e as MouseEvent & TouchEvent);
    if (coords) {
      setPoints(prev => [...prev, { ...coords, label: 1 }]);
    }
  };

  const handleEndDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (points.length > 0) {
      onRefine(points);
    }
  };
  
  const renderOverlay = () => {
    if (isProcessing) {
      return (
        <div className="absolute inset-0 bg-stone-900/80 flex flex-col justify-center items-center z-20">
          <Spinner />
          <p className="mt-4 text-stone-200">{processingText}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      ref={containerRef}
      className="relative aspect-w-3 aspect-h-4 w-full max-w-lg mx-auto bg-stone-800 rounded-2xl overflow-hidden shadow-lg shadow-stone-950/50 touch-none cursor-crosshair"
      onMouseDown={handleStartDrawing}
      onMouseMove={handleDraw}
      onMouseUp={handleEndDrawing}
      onMouseLeave={handleEndDrawing} // End drawing if mouse leaves the area
      onTouchStart={handleStartDrawing}
      onTouchMove={handleDraw}
      onTouchEnd={handleEndDrawing}
    >
      {renderOverlay()}
      <img src={image} alt="Refine selection" className="w-full h-full object-cover" draggable="false" />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1 1" preserveAspectRatio="none">
        {/* Display the returned mask from the API */}
        {mask && <image href={mask} x="0" y="0" width="1" height="1" opacity="0.8" />}
        
        {/* Display the user's drawing path */}
        {isDrawing && points.length > 1 && (
            <polyline 
                points={points.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="rgba(251, 191, 36, 0.7)" // amber-400
                strokeWidth="0.01" // responsive stroke width
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        )}
      </svg>
    </div>
  );
};

export default MaskRefiner;
