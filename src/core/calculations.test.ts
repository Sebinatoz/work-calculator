import { describe, expect, it } from 'vitest';
import { calculateDay, calculateMonthSummary, generateMonthSheet } from './calculations';
import { DEFAULT_SETTINGS } from '../storage/db';
import { formatDailyHours, minutesToTimeString, normalizeTimeInput, parseDailyHours, parseTimeToMinutes } from './time';
import { getBelgianHolidays, getEasterSunday } from './holidays';

describe('Time utilities', () => {
  it('parses formatted time into signed minutes', () => {
    expect(parseTimeToMinutes('08:00')).toBe(480);
    expect(parseTimeToMinutes('00:30')).toBe(30);
    expect(parseTimeToMinutes('-01:15:00')).toBe(-75);
    expect(parseTimeToMinutes('+02:00:00')).toBe(120);
    expect(parseTimeToMinutes('')).toBe(0);
  });

  it('converts minutes to HH:MM:SS with correct sign', () => {
    expect(minutesToTimeString(480)).toBe('08:00:00');
    expect(minutesToTimeString(-90, true, true)).toBe('-01:30:00');
    expect(minutesToTimeString(60, true, true)).toBe('+01:00:00');
  });

  it('normalizes fast user typing into standard HH:MM', () => {
    expect(normalizeTimeInput('8')).toBe('08:00');
    expect(normalizeTimeInput('830')).toBe('08:30');
    expect(normalizeTimeInput('1645')).toBe('16:45');
    expect(normalizeTimeInput('7:15')).toBe('07:15');
  });

  it('parses daily hours in all human formats (7h30, 7:30, 7,5, 7.5, 7h48)', () => {
    expect(parseDailyHours('7h30')).toBe(7.5);
    expect(parseDailyHours('7h')).toBe(7.0);
    expect(parseDailyHours('7h15')).toBe(7.25);
    expect(parseDailyHours('7h45')).toBe(7.75);
    expect(parseDailyHours('7h48')).toBe(7.8);
    expect(parseDailyHours('7:30')).toBe(7.5);
    expect(parseDailyHours('07:30')).toBe(7.5);
    expect(parseDailyHours('7,5')).toBe(7.5);
    expect(parseDailyHours('7.5')).toBe(7.5);
    expect(parseDailyHours('7,25')).toBe(7.25);
    expect(parseDailyHours('7,5h')).toBe(7.5);
    expect(parseDailyHours('8')).toBe(8.0);
    expect(parseDailyHours('')).toBe(8.0);
    expect(parseDailyHours(null)).toBe(8.0);
    expect(parseDailyHours(7.5)).toBe(7.5);
  });

  it('formats decimal hours into standard French notation (e.g. 7h30, 8h00)', () => {
    expect(formatDailyHours(8)).toBe('8h00');
    expect(formatDailyHours(7.5)).toBe('7h30');
    expect(formatDailyHours(7.25)).toBe('7h15');
    expect(formatDailyHours(7.75)).toBe('7h45');
    expect(formatDailyHours(7.8)).toBe('7h48');
    expect(formatDailyHours(null)).toBe('8h00');
  });
});

describe('Holidays calculations', () => {
  it('calculates Easter Sunday correctly', () => {
    // 2026 Easter Sunday is April 5, 2026
    const easter2026 = getEasterSunday(2026);
    expect(easter2026.getUTCMonth()).toBe(3); // 3 = April (0-indexed)
    expect(easter2026.getUTCDate()).toBe(5);
  });

  it('includes Belgian national holidays', () => {
    const holidays = getBelgianHolidays(2026);
    const dates = holidays.map(h => h.date);
    expect(dates).toContain('2026-01-01'); // Nouvel An
    expect(dates).toContain('2026-05-01'); // Fête du travail
    expect(dates).toContain('2026-07-21'); // Fête nationale
    expect(dates).toContain('2026-11-01'); // Toussaint
    expect(dates).toContain('2026-11-11'); // Armistice
    expect(dates).toContain('2026-12-25'); // Noël
  });
});

describe('Daily Work Calculation (Rule: 8h standard, negative when worked < base)', () => {
  it('calculates exact 8h work day with 30m lunch break without overtime or deficit', () => {
    const day = calculateDay(
      {
        date: '2026-01-05',
        depart: '08:00',
        rentree: '16:30',
        pause: '00:30',
      },
      DEFAULT_SETTINGS // standardDailyHours = 8.0
    );

    expect(day.totalMinutes).toBe(480); // 8h
    expect(day.totalFormatted).toBe('08:00:00');
    expect(day.hSupMinutes).toBe(0);
    expect(day.hNegatifMinutes).toBe(0);
  });

  it('calculates overtime when worked > base', () => {
    const day = calculateDay(
      {
        date: '2026-01-06',
        depart: '07:30',
        rentree: '17:00',
        pause: '00:30',
      },
      DEFAULT_SETTINGS
    );

    // 17:00 - 07:30 = 9h30, minus 30m pause = 9h00 (540 mins)
    expect(day.totalMinutes).toBe(540);
    expect(day.hSupMinutes).toBe(60); // +1h00
    expect(day.hSupFormatted).toBe('01:00:00');
    expect(day.hNegatifMinutes).toBe(0);
  });

  it('calculates negative hours when worked < base', () => {
    const day = calculateDay(
      {
        date: '2026-01-07',
        depart: '08:00',
        rentree: '14:30',
        pause: '00:30',
      },
      DEFAULT_SETTINGS
    );

    // 14:30 - 08:00 = 6h30, minus 30m pause = 6h00 (360 mins)
    expect(day.totalMinutes).toBe(360);
    expect(day.hSupMinutes).toBe(0);
    expect(day.hNegatifMinutes).toBe(120); // 8h - 6h = 2h00 deficit
    expect(day.hNegatifFormatted).toBe('02:00:00');
  });

  it('handles empty / unworked days as 0 total and 0 deficit', () => {
    const day = calculateDay(
      {
        date: '2026-01-01',
        depart: '',
        rentree: '',
      },
      DEFAULT_SETTINGS
    );

    expect(day.totalMinutes).toBe(0);
    expect(day.hSupMinutes).toBe(0);
    expect(day.hNegatifMinutes).toBe(0);
  });

  it('correctly calculates overtime and deficit with 7h30 daily base (standardDailyHours: 7.5)', () => {
    const customSettings = { ...DEFAULT_SETTINGS, standardDailyHours: 7.5 };

    // Exactly 7h30 worked (08:00 to 16:00, 30m pause = 7h30)
    const exactDay = calculateDay(
      { date: '2026-01-05', depart: '08:00', rentree: '16:00', pause: '00:30' },
      customSettings
    );
    expect(exactDay.totalMinutes).toBe(450); // 7h30
    expect(exactDay.hSupMinutes).toBe(0);
    expect(exactDay.hNegatifMinutes).toBe(0);

    // 8h worked (30m overtime over 7h30 base)
    const overDay = calculateDay(
      { date: '2026-01-06', depart: '08:00', rentree: '16:30', pause: '00:30' },
      customSettings
    );
    expect(overDay.totalMinutes).toBe(480);
    expect(overDay.hSupMinutes).toBe(30); // +00:30:00
    expect(overDay.hSupFormatted).toBe('00:30:00');
    expect(overDay.hNegatifMinutes).toBe(0);

    // 7h worked (30m deficit under 7h30 base)
    const underDay = calculateDay(
      { date: '2026-01-07', depart: '08:00', rentree: '15:30', pause: '00:30' },
      customSettings
    );
    expect(underDay.totalMinutes).toBe(420);
    expect(underDay.hSupMinutes).toBe(0);
    expect(underDay.hNegatifMinutes).toBe(30); // -00:30:00
    expect(underDay.hNegatifFormatted).toBe('00:30:00');
  });
});

describe('Monthly Summary & Balance Rollover', () => {
  it('rolls over previous month balance correctly', () => {
    const sheet = generateMonthSheet(2026, 1, DEFAULT_SETTINGS, '+05:00:00');

    // Day 1: 9h worked (+1h overtime)
    sheet.days[4] = calculateDay(
      { date: '2026-01-05', depart: '08:00', rentree: '17:30', pause: '00:30' },
      DEFAULT_SETTINGS
    );

    // Day 2: 7h worked (-1h deficit)
    sheet.days[5] = calculateDay(
      { date: '2026-01-06', depart: '08:00', rentree: '15:30', pause: '00:30' },
      DEFAULT_SETTINGS
    );

    // Day 3: took 2h recovery time
    sheet.days[6] = calculateDay(
      { date: '2026-01-07', depart: '08:00', rentree: '16:30', pause: '00:30', hRecup: '02:00' },
      DEFAULT_SETTINGS
    );

    const summary = calculateMonthSummary(sheet);

    // Previous balance: +5h (300 mins)
    expect(summary.soldeMoisPrecedentMinutes).toBe(300);
    // Overtime: 60 mins
    expect(summary.totalSupMinutes).toBe(60);
    // Deficit: 60 mins
    expect(summary.totalNegatifMinutes).toBe(60);
    // Recovery taken: 120 mins
    expect(summary.totalRecupMinutes).toBe(120);

    // Net month balance = 60 - 60 - 120 = -120 mins (-02:00:00)
    expect(summary.soldeNetMoisMinutes).toBe(-120);
    expect(summary.soldeNetMoisFormatted).toBe('-02:00:00');

    // Cumulative balance = +300 - 120 = +180 mins (+03:00:00)
    expect(summary.soldeCumuleMinutes).toBe(180);
    expect(summary.soldeCumuleFormatted).toBe('+03:00:00');
  });
});
