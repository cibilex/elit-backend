import { formatDateToRes } from './date.utils';

it('should return empty string when date is undefined', () => {
  expect(formatDateToRes(undefined)).toBe('');
});
