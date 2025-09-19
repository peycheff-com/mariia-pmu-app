import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from './common/Button';
import { useLanguage } from '../hooks/useLanguage';
import { createCheckoutSession, getMockupPublicUrl } from '../services/apiService';

const ResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const mockupId = searchParams.get('id');
  const imageUrl = mockupId ? getMockupPublicUrl(mockupId) : `https://picsum.photos/1024/1024`;


  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const { url } = await createCheckoutSession();
      window.location.href = url;
    } catch (error) {
        console.error("Failed to create checkout session:", error);
        alert("Could not connect to payment provider. Please try again later.");
        setIsCheckingOut(false);
    }
  };

  const handleBooksy = () => {
    const booksyUrl = `https://borysewic.booksy.com?utm_source=bm-preview&note=Mockup%20${mockupId}`;
    window.open(booksyUrl, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl text-center font-serif text-amber-200 mb-8">{t('yourMockup')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="aspect-w-1 aspect-h-1 bg-stone-800 rounded-2xl overflow-hidden shadow-lg">
          <img src={imageUrl} alt="Generated PMU Mockup" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col gap-6">
          <p className="text-stone-300">
            {t('mockupDescription')}
          </p>
          <div className="bg-stone-800/50 p-4 rounded-lg border border-stone-700">
            <h3 className="font-semibold text-amber-300">{t('verifiedPreview')}</h3>
            <p className="text-xs text-stone-400 mt-1">
              {t('c2paNotice')}
            </p>
          </div>
          <div className="flex flex-col gap-4 mt-4">
             <Button onClick={handleCheckout} size="lg" variant="primary" disabled={isCheckingOut}>
                {isCheckingOut ? t('processing') : t('book')}
            </Button>
             <Button onClick={handleBooksy} size="lg" variant="secondary">{t('booksy')}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;