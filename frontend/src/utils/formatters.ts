import { format, formatDistanceToNow, isToday, parseISO } from 'date-fns';
import { hi } from 'date-fns/locale';
import type { Language } from '@/i18n/types';

const locales: Partial<Record<Language, typeof hi>> = {
  hi,
};

export function formatCurrency(amount?: number, notAvailable = '—'): string {
  if (amount == null) return notAvailable;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr?: string, notAvailable = '—', language: Language = 'en'): string {
  if (!dateStr) return notAvailable;
  try {
    const locale = locales[language];
    return format(parseISO(dateStr), 'dd MMM yyyy', locale ? { locale } : undefined);
  } catch {
    return dateStr;
  }
}

export function formatUpdatedTime(
  dateStr?: string,
  notAvailable = '—',
  todayLabel = 'Today',
  language: Language = 'en',
): string {
  if (!dateStr) return notAvailable;
  try {
    const date = parseISO(dateStr);
    const locale = locales[language];
    if (isToday(date)) {
      return `${todayLabel} ${format(date, 'h:mm a', locale ? { locale } : undefined)}`;
    }
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: locale ?? undefined,
    });
  } catch {
    return dateStr;
  }
}

export function getTodayFormatted(language: Language = 'en'): string {
  const locale = locales[language];
  return format(new Date(), 'EEEE, dd MMMM yyyy', locale ? { locale } : undefined);
}
