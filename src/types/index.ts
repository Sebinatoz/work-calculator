/**
 * Core Types for Work Calculator (Calculateur d'heures de prestation)
 */

export type CountryCode = 'BE' | 'FR' | 'LU' | 'CUSTOM';

export interface AppSettings {
  userName: string;                     // e.g. "Didier"
  standardDailyHours: number;           // Standard hours per day (default: 8.0)
  country: CountryCode;                 // Country for public holidays (default: 'BE')
  customHolidays: string[];             // ISO Dates: YYYY-MM-DD
  chantierList: string[];               // Projects / sites list
  absenceTypes: string[];               // Absence types: Congé, Congé payé, Récupération, etc.
  theme: 'dark' | 'light' | 'system';   // UI Theme
  timeStepMinutes: number;              // Dropdown step (e.g. 15 mins)
  autoFillLunchBreak: boolean;          // Auto-fill default pause (e.g. 00:30)
  defaultLunchBreak: string;            // Default pause duration (e.g. "00:30")
}

export interface WorkDay {
  date: string;                         // ISO: YYYY-MM-DD
  dayOfWeek: number;                    // 0=Sunday, 1=Monday, ..., 6=Saturday
  isWeekend: boolean;
  isHoliday: boolean;
  holidayName?: string;
  
  // User Inputs (in "HH:MM" or "HH:MM:SS" format)
  depart: string;                       // Heure de départ
  rentree: string;                      // Heure de rentrée (fin de journée)
  pause: string;                        // Pause repas
  hRecup: string;                       // Heures récupérées (congé récup pris)
  chantier: string;                     // Chantier ou Type d'absence
  notes?: string;                       // Remarques éventuelles

  // Calculated values (in "HH:MM:SS" and minutes for fast math)
  totalMinutes: number;                 // Total presté en minutes
  totalFormatted: string;               // Total en format HH:MM:SS
  
  hSupMinutes: number;                  // Heures supplémentaires en minutes
  hSupFormatted: string;                // Format HH:MM:SS
  
  hNegatifMinutes: number;              // Heures négatives (déficit) en minutes
  hNegatifFormatted: string;            // Format HH:MM:SS

  hRecupMinutes: number;                // Heures récupérées en minutes
}

export interface MonthSummary {
  month: number;                        // 1-12
  year: number;
  totalWorkedMinutes: number;
  totalWorkedFormatted: string;
  
  totalSupMinutes: number;
  totalSupFormatted: string;
  
  totalNegatifMinutes: number;
  totalNegatifFormatted: string;
  
  totalRecupMinutes: number;
  totalRecupFormatted: string;
  
  soldeMoisPrecedentMinutes: number;    // Solde reporté du mois précédent
  soldeMoisPrecedentFormatted: string;

  soldeNetMoisMinutes: number;          // Somme(Sup) - Somme(Neg) - Somme(Recup)
  soldeNetMoisFormatted: string;

  soldeCumuleMinutes: number;           // Solde précédent + Solde net
  soldeCumuleFormatted: string;

  daysCount: number;
  workedDaysCount: number;
}

export interface MonthSheet {
  id: string;                           // Format "YYYY-MM"
  year: number;
  month: number;                        // 1 to 12
  soldeMoisPrecedent: string;           // e.g. "+04:30:00" or "-01:15:00"
  days: WorkDay[];
  summary: MonthSummary;
  updatedAt: string;
}

export interface PublicHoliday {
  date: string;                         // YYYY-MM-DD
  name: string;
  isNational: boolean;
}
