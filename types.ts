
export type Area = 'lips' | 'brows';

export type LanguageCode = 'pl' | 'ru' | 'ua';

export interface Translation {
  [key: string]: string | { [key: string]: string };
}

export interface I18nData {
  pl: Translation;
  ru: Translation;
  ua: Translation;
}
