import { utcToZonedTime } from 'date-fns-tz';

export default function parseDateTimeZone(date: string | Date): Date {
  return utcToZonedTime(date, 'America/Sao_Paulo');
}
