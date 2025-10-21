import { DateTime } from 'luxon';

export const formatDateToRes = (date?: Date): string => {
  if (!date) return '';
  const formattedDate = DateTime.fromJSDate(date);
  return (formattedDate.isValid && formattedDate.toISO()) || '';
};
