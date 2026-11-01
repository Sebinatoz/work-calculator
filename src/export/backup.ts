import { AppSettings, MonthSheet } from '../types';
import { DEFAULT_SETTINGS, loadSettings, saveMonthSheet, saveSettings } from '../storage/db';

export interface BackupData {
  version: number;
  exportedAt: string;
  settings: AppSettings;
  sheets: MonthSheet[];
}

/**
 * Exports all data (settings + all sheets) to a single JSON string
 */
export function exportAllData(): string {
  const settings = loadSettings();
  const sheets: MonthSheet[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('work_calc_sheet_')) {
      try {
        const item = JSON.parse(localStorage.getItem(key) || '{}');
        if (item.id && Array.isArray(item.days)) {
          sheets.push(item);
        }
      } catch (e) {
        console.error('Error reading key for backup', key, e);
      }
    }
  }

  const backup: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    settings,
    sheets,
  };

  return JSON.stringify(backup, null, 2);
}

/**
 * Downloads a complete JSON backup
 */
export function downloadBackup(): void {
  const json = exportAllData();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `WorkCalculator_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Restores data from a backup JSON string
 */
export function importBackupData(jsonString: string): { success: boolean; count: number; error?: string } {
  try {
    const data: BackupData = JSON.parse(jsonString);
    if (!data.version || !data.sheets) {
      return { success: false, count: 0, error: 'Format de fichier de sauvegarde invalide.' };
    }

    if (data.settings) {
      saveSettings({ ...DEFAULT_SETTINGS, ...data.settings });
    }

    let count = 0;
    for (const sheet of data.sheets) {
      saveMonthSheet(sheet);
      count++;
    }

    return { success: true, count };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, count: 0, error: msg };
  }
}
