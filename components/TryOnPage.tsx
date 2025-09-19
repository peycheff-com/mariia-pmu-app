import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Area } from '../types';
import { captureFrame } from '../utils/camera';
import { generateMockup, refineMask } from '../services/apiService';
import Spinner from './common/Spinner';
import ColorPalette from './common/ColorPalette';
import Button from './common/Button';
import { lipHex, browHex } from '../constants/presets';
import { useLanguage } from '../hooks/useLanguage';
import MaskRefiner from './common/MaskRefiner';

type Point = { x: number; y: number; label: number };

interface RefinementData {
    image: string;
    area: Area;
    color: string;
}

const TryOnPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoadingModel, setIsLoadingModel] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const [selectedLipColor, setSelectedLipColor] = useState<string>(lipHex.dusty_rose);
  const [selectedBrowColor, setSelectedBrowColor] = useState<string>(browHex.soft_brown);
  const [consents, setConsents] = useState({ preview: false, portfolio: false });

  const [refinementData, setRefinementData] = useState<RefinementData | null>(null);
  const [refinedMask, setRefinedMask] = useState<string | null>(null);
  const [processingText, setProcessingText] = useState('');

  const stopCameraStream = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const startCameraStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setError(null);
    } catch (err) {
      console.error("Camera access denied:", err);
      setError(t('cameraError') as string);
    }
  };

  useEffect(() => {
    if (!refinementData) { // Only run camera init if not in refinement mode
        const init = async () => {
          await startCameraStream();
          setTimeout(() => setIsLoadingModel(false), 2000);
        };
        init();
    }
    
    return () => {
      stopCameraStream();
    };
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refinementData]);

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setConsents(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setError(null);
        stopCameraStream();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleUseCamera = async () => {
      setUploadedImage(null);
      await startCameraStream();
  };

  const snapshot = async (area: Area) => {
    if (!consents.preview) {
        alert(t('consentPreviewError'));
        return;
    }
    
    const frame = uploadedImage ? uploadedImage : (videoRef.current?.srcObject ? captureFrame(videoRef.current) : null);

    if (!frame) {
        setError(t('noImageError') as string);
        return;
    }
    
    stopCameraStream();
    const color = area === 'lips' ? selectedLipColor : selectedBrowColor;
    setRefinementData({ image: frame, area, color });
  };

  const handleRefine = async (points: Point[]) => {
    if (!refinementData || points.length === 0) return;
    setProcessingText(t('refiningMask') as string);
    setIsProcessing(true);
    try {
      const { mask } = await refineMask(refinementData.image, points);
      setRefinedMask(mask);
    } catch (err) {
      console.error("Failed to refine mask:", err);
      setError(t('mockupError') as string); // Re-use error message
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmMockup = async () => {
    if (!refinementData || !refinedMask) return;
    setProcessingText(t('processing') as string);
    setIsProcessing(true);
    try {
      const { id } = await generateMockup(refinementData.image, refinedMask, refinementData.area, refinementData.color, consents);
      navigate(`/result?id=${id}`);
    } catch (err) {
      console.error("Failed to generate mockup:", err);
      setError(t('mockupError') as string);
      setIsProcessing(false);
    }
  };

  const handleCancelRefinement = () => {
    setRefinementData(null);
    setRefinedMask(null);
    setError(null);
    // The useEffect will restart the camera stream
  };

  if (refinementData) {
    return (
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-serif font-semibold text-amber-200 mb-2 text-center">{t('refineTitle')}</h2>
        <p className="text-stone-300 text-center mb-4">{t('refineInstruction')}</p>
        <MaskRefiner 
          image={refinementData.image}
          mask={refinedMask}
          onRefine={handleRefine}
          isProcessing={isProcessing}
          processingText={processingText}
        />
        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button onClick={handleConfirmMockup} disabled={!refinedMask || isProcessing} size="lg">
            {t('confirmMask')}
          </Button>
          <Button onClick={handleCancelRefinement} variant="secondary" disabled={isProcessing}>
            {t('cancel')}
          </Button>
        </div>
      </div>
    );
  }

  const renderOverlay = () => {
    if (isLoadingModel || isProcessing) {
      return (
        <div className="absolute inset-0 bg-stone-900/80 flex flex-col justify-center items-center z-20">
          <Spinner />
          <p className="mt-4 text-stone-200">{isLoadingModel ? t('loadingModel') : t('processing')}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 relative aspect-w-3 aspect-h-4 bg-stone-800 rounded-2xl overflow-hidden shadow-lg shadow-stone-950/50">
          {renderOverlay()}
          {uploadedImage ? (
            <img src={uploadedImage} alt="Uploaded preview" className="w-full h-full object-cover" />
          ) : (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scaleX-[-1]" />
          )}
          {error && !uploadedImage && <div className="absolute inset-0 bg-stone-900/90 flex justify-center items-center z-10 text-red-400 p-4 text-center">{error}</div>}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent flex justify-center gap-4">
              <Button onClick={handleUploadClick} variant="secondary" size="sm" disabled={isProcessing || isLoadingModel}>{t('uploadPhoto')}</Button>
              {uploadedImage && <Button onClick={handleUseCamera} variant="secondary" size="sm" disabled={isProcessing || isLoadingModel}>{t('useCamera')}</Button>}
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-serif font-semibold text-amber-200 mb-4">{t('selectColor')}</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-stone-300 mb-2">{t('lips')}</h3>
                <ColorPalette colors={lipHex} selectedColor={selectedLipColor} onSelect={setSelectedLipColor} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-stone-300 mb-2">{t('brows')}</h3>
                <ColorPalette colors={browHex} selectedColor={selectedBrowColor} onSelect={setSelectedBrowColor} />
              </div>
            </div>
          </div>
          <div className="mt-8 space-y-6">
            <div className="space-y-3 text-sm">
                <label className="flex items-start gap-3">
                    <input type="checkbox" name="preview" checked={consents.preview} onChange={handleConsentChange} className="mt-1 accent-amber-500 bg-stone-700 border-stone-600 rounded" />
                    <span>{t('consentPreview')}</span>
                </label>
                <label className="flex items-start gap-3">
                    <input type="checkbox" name="portfolio" checked={consents.portfolio} onChange={handleConsentChange} className="mt-1 accent-amber-500 bg-stone-700 border-stone-600 rounded" />
                    <span>{t('consentPortfolio')}</span>
                </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => snapshot('lips')} disabled={isProcessing || isLoadingModel || !consents.preview}>{t('ctaLips')}</Button>
              <Button onClick={() => snapshot('brows')} disabled={isProcessing || isLoadingModel || !consents.preview}>{t('ctaBrows')}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryOnPage;