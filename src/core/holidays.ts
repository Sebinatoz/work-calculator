import { CountryCode, PublicHoliday } from '../types';

/**
 * Calculates Easter Sunday for a Gregorian year using the anonymous Gregorian algorithm (Meeus/Jones/Butcher).
 */
export function getEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = March, 4 = April
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(Date.UTC(year, month - 1, day));
}

function formatDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const d = date.getUTCDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

/**
 * Returns public holidays for Belgium for a specific year
 */
export function getBelgianHolidays(year: number): PublicHoliday[] {
  const easter = getEasterSunday(year);
  const easterMonday = addDays(easter, 1);
  const ascension = addDays(easter, 39);
  const whitMonday = addDays(easter, 50);

  return [
    { date: `${year}-01-01`, name: 'Nouvel An', isNational: true },
    { date: formatDate(easterMonday), name: 'Lundi de Pâques', isNational: true },
    { date: `${year}-05-01`, name: 'Fête du Travail', isNational: true },
    { date: formatDate(ascension), name: 'Ascension', isNational: true },
    { date: formatDate(whitMonday), name: 'Lundi de Pentecôte', isNational: true },
    { date: `${year}-07-21`, name: 'Fête nationale belge', isNational: true },
    { date: `${year}-08-15`, name: 'Assomption', isNational: true },
    { date: `${year}-11-01`, name: 'Toussaint', isNational: true },
    { date: `${year}-11-11`, name: 'Armistice 1918', isNational: true },
    { date: `${year}-12-25`, name: 'Noël', isNational: true },
  ];
}

/**
 * Returns public holidays for France for a specific year
 */
export function getFrenchHolidays(year: number): PublicHoliday[] {
  const easter = getEasterSunday(year);
  const easterMonday = addDays(easter, 1);
  const ascension = addDays(easter, 39);
  const whitMonday = addDays(easter, 50);

  return [
    { date: `${year}-01-01`, name: 'Jour de l’An', isNational: true },
    { date: formatDate(easterMonday), name: 'Lundi de Pâques', isNational: true },
    { date: `${year}-05-01`, name: 'Fête du Travail', isNational: true },
    { date: `${year}-05-08`, name: 'Victoire 1945', isNational: true },
    { date: formatDate(ascension), name: 'Ascension', isNational: true },
    { date: formatDate(whitMonday), name: 'Lundi de Pentecôte', isNational: true },
    { date: `${year}-07-14`, name: 'Fête Nationale', isNational: true },
    { date: `${year}-08-15`, name: 'Assomption', isNational: true },
    { date: `${year}-11-01`, name: 'Toussaint', isNational: true },
    { date: `${year}-11-11`, name: 'Armistice 1918', isNational: true },
    { date: `${year}-12-25`, name: 'Noël', isNational: true },
  ];
}

/**
 * Returns public holidays for Luxembourg
 */
export function getLuxembourgHolidays(year: number): PublicHoliday[] {
  const easter = getEasterSunday(year);
  const easterMonday = addDays(easter, 1);
  const ascension = addDays(easter, 39);
  const whitMonday = addDays(easter, 50);

  return [
    { date: `${year}-01-01`, name: 'Nouvel An', isNational: true },
    { date: formatDate(easterMonday), name: 'Lundi de Pâques', isNational: true },
    { date: `${year}-05-01`, name: 'Fête du Travail', isNational: true },
    { date: `${year}-05-09`, name: 'Journée de l’Europe', isNational: true },
    { date: formatDate(ascension), name: 'Ascension', isNational: true },
    { date: formatDate(whitMonday), name: 'Lundi de Pentecôte', isNational: true },
    { date: `${year}-06-23`, name: 'Fête nationale', isNational: true },
    { date: `${year}-08-15`, name: 'Assomption', isNational: true },
    { date: `${year}-11-01`, name: 'Toussaint', isNational: true },
    { date: `${year}-12-25`, name: 'Noël', isNational: true },
    { date: `${year}-12-26`, name: 'Saint-Étienne', isNational: true },
  ];
}

/**
 * Retrieves holidays based on country selection
 */
export function getHolidaysForYear(
  year: number,
  country: CountryCode,
  customHolidays: string[] = []
): Map<string, PublicHoliday> {
  const map = new Map<string, PublicHoliday>();

  let list: PublicHoliday[] = [];
  if (country === 'BE') list = getBelgianHolidays(year);
  else if (country === 'FR') list = getFrenchHolidays(year);
  else if (country === 'LU') list = getLuxembourgHolidays(year);

  for (const h of list) {
    map.set(h.date, h);
  }

  // Add custom holidays
  for (const date of customHolidays) {
    if (date.startsWith(year.toString())) {
      map.set(date, { date, name: 'Férié personnalisé', isNational: false });
    }
  }

  return map;
}
