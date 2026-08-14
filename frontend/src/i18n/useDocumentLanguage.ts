import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';

/** Sync document lang attribute when farmer switches language */
export function useDocumentLanguage() {
  const language = useAppStore((s) => s.language);

  useEffect(() => {
    document.documentElement.lang = language === 'en' ? 'en-IN' : language;
  }, [language]);
}
