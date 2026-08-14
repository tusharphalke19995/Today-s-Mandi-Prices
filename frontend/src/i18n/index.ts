import { useCallback } from 'react';
import { en, hi, mr } from './translations';
import type { Language, TranslationKey, Translations } from './types';
import { useAppStore } from '@/store/appStore';

const all: Record<Language, Translations> = { en, hi, mr };

export const LANGUAGE_OPTIONS: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
];

export function getTranslations(lang: Language): Translations {
  return all[lang] ?? en;
}

export function useTranslation() {
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const dict = getTranslations(language);

  const t = useCallback((key: TranslationKey) => dict[key], [dict]);

  return { t, language, setLanguage };
}
