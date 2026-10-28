import { CURRENCY, LOCALE } from '../config';
export const formatCurrency = (v, { compact = false } = {}) =>
  new Intl.NumberFormat(LOCALE, {
    style: 'currency', currency: CURRENCY,
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 2,
  }).format(Number(v) || 0);
export const formatNumber = (v) => new Intl.NumberFormat(LOCALE).format(Number(v) || 0);
