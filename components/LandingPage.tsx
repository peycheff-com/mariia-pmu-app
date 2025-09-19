
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import Button from './common/Button';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="text-center py-16">
      <h1 className="text-5xl md:text-7xl font-bold font-serif text-amber-100 leading-tight">
        {t('heroTitle')}
      </h1>
      <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-stone-300">
        {t('heroSubtitle')}
      </p>
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button onClick={() => navigate('/try')} size="lg" className="w-full sm:w-auto">
          {t('ctaTryOn')}
        </Button>
      </div>
      <div className="mt-20 max-w-4xl mx-auto">
        <img src="https://picsum.photos/1200/600?random=1" alt="PMU examples" className="rounded-xl shadow-2xl shadow-stone-950/50" />
      </div>
    </div>
  );
};

export default LandingPage;
