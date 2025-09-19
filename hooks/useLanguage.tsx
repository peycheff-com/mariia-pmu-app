
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { i18nData } from '../constants/i18n';
import { LanguageCode, Translation } from '../types';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('pl');

  const t = (key: string): string => {
    const keys = key.split('.');
    let result: string | Translation | undefined = i18nData[language];
    for (const k of keys) {
        if(typeof result === 'object' && result !== null && k in result){
            result = (result as Translation)[k] as string | Translation;
        } else {
            return key;
        }
    }
    return typeof result === 'string' ? result : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
