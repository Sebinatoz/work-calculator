import { AppSettings, MonthSheet } from '../types';
import { calculateDay, calculateMonthSummary, generateMonthSheet } from '../core/calculations';

const SETTINGS_KEY = 'work_calc_settings_v1';
const SHEETS_PREFIX = 'work_calc_sheet_';

export const DEFAULT_SETTINGS: AppSettings = {
  userName: 'Didier',
  standardDailyHours: 8.0,
  country: 'BE',
  customHolidays: [],
  chantierList: [
    'Chantier Principal',
    'Chantier Secondaire',
    'Atelier / Dépôt',
    'Entretien / Maintenance',
  ],
  absenceTypes: [
    'Congé',
    'Congé payé',
    'Récupération',
    'Férié',
    'Maladie',
    'Formation',
  ],
  theme: 'dark',
  timeStepMinutes: 15,
  autoFillLunchBreak: false,
  defaultLunchBreak: '00:30',
};

/**
 * Loads application settings
 */
export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load settings, using defaults', e);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Saves application settings
 */
export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

/**
 * Helper to get the previous month ID (e.g. for "2026-03" -> "2026-02", for "2026-01" -> "2025-12")
 */
export function getPreviousMonthId(year: number, month: number): string {
  let prevYear = year;
  let prevMonth = month - 1;
  if (prevMonth < 1) {
    prevMonth = 12;
    prevYear = year - 1;
  }
  return `${prevYear}-${prevMonth.toString().padStart(2, '0')}`;
}

/**
 * Loads or initializes a month sheet
 */
export function loadMonthSheet(year: number, month: number, settings: AppSettings): MonthSheet {
  const id = `${year}-${month.toString().padStart(2, '0')}`;
  const key = `${SHEETS_PREFIX}${id}`;
  
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed: MonthSheet = JSON.parse(raw);
      
      // Re-evaluate days with current settings to ensure formulas match standard hours
      parsed.days = parsed.days.map((d) => calculateDay(d, settings));
      parsed.summary = calculateMonthSummary(parsed);
      return parsed;
    }
  } catch (e) {
    console.error(`Error loading sheet ${id}`, e);
  }

  // Not found in storage -> Check if previous month has a cumulative balance
  let soldePrecedent = '00:00:00';
  const prevId = getPreviousMonthId(year, month);
  const prevRaw = localStorage.getItem(`${SHEETS_PREFIX}${prevId}`);
  if (prevRaw) {
    try {
      const prevSheet: MonthSheet = JSON.parse(prevRaw);
      if (prevSheet.summary && prevSheet.summary.soldeCumuleFormatted) {
        soldePrecedent = prevSheet.summary.soldeCumuleFormatted;
      }
    } catch {
      // ignore
    }
  }

  const newSheet = generateMonthSheet(year, month, settings, soldePrecedent);
  saveMonthSheet(newSheet);
  return newSheet;
}

/**
 * Saves a month sheet
 */
export function saveMonthSheet(sheet: MonthSheet): void {
  const key = `${SHEETS_PREFIX}${sheet.id}`;
  sheet.updatedAt = new Date().toISOString();
  sheet.summary = calculateMonthSummary(sheet);
  
  try {
    localStorage.setItem(key, JSON.stringify(sheet));
  } catch (e) {
    console.error(`Failed to save sheet ${sheet.id}`, e);
  }
}

/**
 * Lists all saved months
 */
export function listSavedMonths(): string[] {
  const ids: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(SHEETS_PREFIX)) {
        ids.push(key.replace(SHEETS_PREFIX, ''));
      }
    }
  } catch (e) {
    console.error('Failed to list saved months', e);
  }
  return ids.sort();
}
