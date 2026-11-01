import { AppSettings, MonthSheet } from '../types';

const MONTH_NAMES_FR = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
];

/**
 * Generates a CSV string formatted exactly like Didier's original Excel export
 */
export function generateCsv(sheet: MonthSheet, settings: AppSettings): string {
  const monthName = MONTH_NAMES_FR[sheet.month - 1] || '';
  const lines: string[] = [];

  // Header line 1
  lines.push(`Heure de Prestation de ${settings.userName},,,,,,,${monthName},,,${sheet.year},,`);
  // Header line 2
  lines.push('Dates,Depart H,,Rentrée H,,Pause Repas,,Total H,H Recupérer,H Sup,H negatif,Chantier,');

  // Days
  for (const day of sheet.days) {
    const row = [
      day.date,
      day.depart || '',
      '',
      day.rentree || '',
      '',
      day.pause || '',
      '',
      day.totalFormatted,
      day.hRecup || '',
      day.hSupFormatted,
      day.hNegatifFormatted,
      day.chantier || (day.isHoliday ? 'Férié' : ''),
      ''
    ];
    lines.push(row.join(','));
  }

  // Footer summary
  lines.push(`,,,,,,,,,Solde du mois précédent,,,${sheet.summary.soldeMoisPrecedentFormatted}`);
  lines.push(`,,,,,,,,,Total Heure Sup:,,${sheet.summary.soldeCumuleFormatted},`);

  return lines.join('\r\n');
}

/**
 * Triggers a browser download of the CSV file
 */
export function downloadCsv(sheet: MonthSheet, settings: AppSettings): void {
  const csvContent = '\uFEFF' + generateCsv(sheet, settings); // Add BOM for Excel UTF-8 support
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `Prestations_${settings.userName.replace(/\s+/g, '_')}_${sheet.year}_${sheet.month.toString().padStart(2, '0')}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
