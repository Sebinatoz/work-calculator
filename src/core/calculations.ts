import { AppSettings, MonthSheet, MonthSummary, WorkDay } from '../types';
import { getHolidaysForYear } from './holidays';
import { minutesToTimeString, parseTimeToMinutes } from './time';

/**
 * Calculates a single work day based on inputs and standard daily hours
 */
export function calculateDay(
  day: Partial<WorkDay> & { date: string },
  settings: AppSettings
): WorkDay {
  const baseMinutes = Math.round(settings.standardDailyHours * 60);

  const departMin = parseTimeToMinutes(day.depart);
  const rentreeMin = parseTimeToMinutes(day.rentree);
  const pauseMin = parseTimeToMinutes(day.pause);
  const hRecupMin = Math.max(0, parseTimeToMinutes(day.hRecup));

  let totalMinutes = 0;
  if (rentreeMin > departMin) {
    totalMinutes = Math.max(0, (rentreeMin - departMin) - pauseMin);
  }

  let hSupMinutes = 0;
  let hNegatifMinutes = 0;

  // Rule 2: "moins que la base" -> Overtime when > base, negative hours when < base on worked days
  if (totalMinutes > 0) {
    if (totalMinutes > baseMinutes) {
      hSupMinutes = totalMinutes - baseMinutes;
      hNegatifMinutes = 0;
    } else if (totalMinutes < baseMinutes) {
      hSupMinutes = 0;
      hNegatifMinutes = baseMinutes - totalMinutes;
    } else {
      hSupMinutes = 0;
      hNegatifMinutes = 0;
    }
  }

  const dateObj = new Date(day.date + 'T00:00:00');
  const dayOfWeek = dateObj.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0=Sun, 6=Sat

  return {
    date: day.date,
    dayOfWeek,
    isWeekend,
    isHoliday: !!day.isHoliday,
    holidayName: day.holidayName,
    depart: day.depart || '',
    rentree: day.rentree || '',
    pause: day.pause || '',
    hRecup: day.hRecup || '',
    chantier: day.chantier || '',
    notes: day.notes || '',

    totalMinutes,
    totalFormatted: minutesToTimeString(totalMinutes, true, false),

    hSupMinutes,
    hSupFormatted: minutesToTimeString(hSupMinutes, true, false),

    hNegatifMinutes,
    hNegatifFormatted: minutesToTimeString(hNegatifMinutes, true, false),

    hRecupMinutes: hRecupMin,
  };
}

/**
 * Generates an empty month sheet for a given year & month (1-12)
 */
export function generateMonthSheet(
  year: number,
  month: number,
  settings: AppSettings,
  soldeMoisPrecedent = '00:00:00'
): MonthSheet {
  const holidaysMap = getHolidaysForYear(year, settings.country, settings.customHolidays);
  const daysInMonth = new Date(year, month, 0).getDate();
  const days: WorkDay[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = d.toString().padStart(2, '0');
    const monthStr = month.toString().padStart(2, '0');
    const isoDate = `${year}-${monthStr}-${dayStr}`;

    const dateObj = new Date(year, month - 1, d);
    const dayOfWeek = dateObj.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const holiday = holidaysMap.get(isoDate);

    // Initial empty day
    days.push(
      calculateDay(
        {
          date: isoDate,
          dayOfWeek,
          isWeekend,
          isHoliday: !!holiday,
          holidayName: holiday?.name,
          depart: '',
          rentree: '',
          pause: settings.autoFillLunchBreak && !isWeekend ? settings.defaultLunchBreak : '',
          hRecup: '',
          chantier: holiday ? 'Férié' : '',
        },
        settings
      )
    );
  }

  const id = `${year}-${month.toString().padStart(2, '0')}`;
  const sheet: MonthSheet = {
    id,
    year,
    month,
    soldeMoisPrecedent,
    days,
    summary: {} as MonthSummary,
    updatedAt: new Date().toISOString(),
  };

  sheet.summary = calculateMonthSummary(sheet);
  return sheet;
}

/**
 * Recalculates the monthly summary (totals, overtime, deficit, net balance, cumulative balance)
 */
export function calculateMonthSummary(sheet: MonthSheet): MonthSummary {
  let totalWorkedMinutes = 0;
  let totalSupMinutes = 0;
  let totalNegatifMinutes = 0;
  let totalRecupMinutes = 0;
  let workedDaysCount = 0;

  for (const day of sheet.days) {
    totalWorkedMinutes += day.totalMinutes;
    totalSupMinutes += day.hSupMinutes;
    totalNegatifMinutes += day.hNegatifMinutes;
    totalRecupMinutes += day.hRecupMinutes;
    if (day.totalMinutes > 0) {
      workedDaysCount++;
    }
  }

  const soldeMoisPrecedentMinutes = parseTimeToMinutes(sheet.soldeMoisPrecedent);

  // Net balance of this month = Overtime - Deficit - Comp time taken
  const soldeNetMoisMinutes = totalSupMinutes - totalNegatifMinutes - totalRecupMinutes;

  // Cumulative balance to carry over
  const soldeCumuleMinutes = soldeMoisPrecedentMinutes + soldeNetMoisMinutes;

  return {
    month: sheet.month,
    year: sheet.year,
    totalWorkedMinutes,
    totalWorkedFormatted: minutesToTimeString(totalWorkedMinutes, true, false),

    totalSupMinutes,
    totalSupFormatted: minutesToTimeString(totalSupMinutes, true, false),

    totalNegatifMinutes,
    totalNegatifFormatted: minutesToTimeString(totalNegatifMinutes, true, false),

    totalRecupMinutes,
    totalRecupFormatted: minutesToTimeString(totalRecupMinutes, true, false),

    soldeMoisPrecedentMinutes,
    soldeMoisPrecedentFormatted: minutesToTimeString(soldeMoisPrecedentMinutes, true, true),

    soldeNetMoisMinutes,
    soldeNetMoisFormatted: minutesToTimeString(soldeNetMoisMinutes, true, true),

    soldeCumuleMinutes,
    soldeCumuleFormatted: minutesToTimeString(soldeCumuleMinutes, true, true),

    daysCount: sheet.days.length,
    workedDaysCount,
  };
}
