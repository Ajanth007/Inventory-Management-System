/* import { LOCALE } from '../config';
export const formatDate = (d) =>
  new Intl.DateTimeFormat(LOCALE, { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d));
export const formatRelative = (d) => {
  const mins = Math.round((Date.now() - new Date(d).getTime()) / 60000);
  const rtf = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' });
  if (mins < 60) return rtf.format(-mins, 'minute');
  if (mins < 1440) return rtf.format(-Math.round(mins / 60), 'hour');
  return rtf.format(-Math.round(mins / 1440), 'day');
};
 */

import { LOCALE } from '../config';

export const formatDate = (d) => {
  if (!d) return 'N/A';

  const date = new Date(d);

  if (isNaN(date.getTime())) {
    console.error('Invalid date value:', d);
    return 'N/A';
  }

  return new Intl.DateTimeFormat(LOCALE, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

export const formatRelative = (d) => {
  if (!d) return 'N/A';

  const date = new Date(d);

  if (isNaN(date.getTime())) {
    console.error('Invalid relative date:', d);
    return 'N/A';
  }

  const mins = Math.round(
    (Date.now() - date.getTime()) / 60000
  );

  const rtf = new Intl.RelativeTimeFormat(LOCALE, {
    numeric: 'auto'
  });

  if (mins < 60) return rtf.format(-mins, 'minute');

  if (mins < 1440) {
    return rtf.format(-Math.round(mins / 60), 'hour');
  }

  return rtf.format(-Math.round(mins / 1440), 'day');
};
