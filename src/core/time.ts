/**
 * Time utility functions for Work Calculator
 * Pure functions, zero external dependencies.
 */

/**
 * Parses time string (e.g. "08:15", "08:15:00", "-01:30:00") to signed minutes.
 */
export function parseTimeToMinutes(timeStr?: string | null): number {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  
  const trimmed = timeStr.trim();
  if (!trimmed) return 0;

  const isNegative = trimmed.startsWith('-');
  const cleaned = trimmed.replace(/^[+-]/, '');

  const parts = cleaned.split(':');
  if (parts.length === 0) return 0;

  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parts.length > 1 ? parseInt(parts[1], 10) || 0 : 0;
  const seconds = parts.length > 2 ? parseInt(parts[2], 10) || 0 : 0;

  // Round seconds to nearest minute if needed
  const totalMinutes = hours * 60 + minutes + Math.round(seconds / 60);
  return isNegative ? -totalMinutes : totalMinutes;
}

/**
 * Converts minutes (positive or negative) to "HH:MM:SS" or "HH:MM".
 * @param minutes Signed total minutes
 * @param withSeconds Default true (to match Didier's original Excel "00:00:00")
 * @param withSign If true, includes explicit "+" or "-"
 */
export function minutesToTimeString(
  minutes: number,
  withSeconds = true,
  withSign = false
): string {
  if (isNaN(minutes)) return withSeconds ? '00:00:00' : '00:00';

  const isNegative = minutes < 0;
  const absMinutes = Math.abs(Math.round(minutes));
  
  const h = Math.floor(absMinutes / 60);
  const m = absMinutes % 60;
  const s = 0;

  const pad = (n: number) => n.toString().padStart(2, '0');
  const base = withSeconds 
    ? `${pad(h)}:${pad(m)}:${pad(s)}`
    : `${pad(h)}:${pad(m)}`;

  if (withSign) {
    if (minutes === 0) return base;
    return (isNegative ? '-' : '+') + base;
  }

  return isNegative ? `-${base}` : base;
}

/**
 * Auto-corrects and formats human input into standard "HH:MM"
 * Examples:
 *  "8"    -> "08:00"
 *  "815"  -> "08:15"
 *  "8:3"  -> "08:30"
 *  "1630" -> "16:30"
 */
export function normalizeTimeInput(input: string): string {
  if (!input) return '';
  const clean = input.trim().replace(/[^\d:]/g, '');
  if (!clean) return '';

  if (clean.includes(':')) {
    const [hStr, mStr] = clean.split(':');
    const h = Math.min(23, Math.max(0, parseInt(hStr, 10) || 0));
    let m = parseInt(mStr || '0', 10) || 0;
    if (mStr && mStr.length === 1) {
      m = m * 10; // "8:3" -> "08:30"
    }
    m = Math.min(59, Math.max(0, m));
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  // Pure digits: 1, 2, 3 or 4 digits
  if (clean.length === 1 || clean.length === 2) {
    const h = Math.min(23, Math.max(0, parseInt(clean, 10)));
    return `${h.toString().padStart(2, '0')}:00`;
  }

  if (clean.length === 3) {
    const h = parseInt(clean.slice(0, 1), 10);
    const m = Math.min(59, parseInt(clean.slice(1), 10));
    return `0${h}:${m.toString().padStart(2, '0')}`;
  }

  if (clean.length >= 4) {
    const h = Math.min(23, parseInt(clean.slice(0, 2), 10));
    const m = Math.min(59, parseInt(clean.slice(2, 4), 10));
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  return clean;
}

/**
 * Generates dropdown preset options for quick selection
 */
export function generateTimeSlots(
  startHour = 6,
  endHour = 20,
  stepMinutes = 15
): string[] {
  const slots: string[] = [];
  const startMin = startHour * 60;
  const endMin = endHour * 60;

  for (let min = startMin; min <= endMin; min += stepMinutes) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`);
  }
  return slots;
}

/**
 * Parses user input for daily work base into decimal hours.
 * Accepts multiple human formats:
 * - "7h30", "7h", "7h15", "7h45", "7h48"
 * - "7:30", "07:30"
 * - "7,5", "7,25", "7,75", "7,8" (French decimal comma)
 * - "7.5", "7.25", "7.75", "7.8" (Standard decimal dot)
 * - "7,5h", "7.5h"
 * - numbers: 7.5 -> 7.5
 */
export function parseDailyHours(input: string | number | null | undefined): number {
  if (input === null || input === undefined) return 8.0;
  if (typeof input === 'number') {
    return isNaN(input) || input <= 0 ? 8.0 : Math.round(input * 1000) / 1000;
  }

  let str = String(input).trim().toLowerCase();
  if (!str) return 8.0;

  // Clean trailing duration units like "min", "m"
  str = str.replace(/min|m/gi, '').trim();

  // If format contains 'h' (e.g. "7h30", "7h", "7,5h", "7.5h")
  if (str.includes('h')) {
    const parts = str.split('h');
    const hPart = parts[0].trim().replace(',', '.');
    const h = parseFloat(hPart) || 0;
    const mPart = parts[1] ? parts[1].trim() : '';

    let m = 0;
    if (mPart) {
      if (mPart.length === 1) {
        // "7h3" -> 30 min
        m = (parseInt(mPart, 10) || 0) * 10;
      } else {
        m = parseFloat(mPart.replace(',', '.')) || 0;
      }
    }

    const total = h + m / 60;
    return total > 0 ? Math.round(total * 1000) / 1000 : 8.0;
  }

  // If format contains ':' (e.g. "07:30", "7:30")
  if (str.includes(':')) {
    const parts = str.split(':');
    const h = parseInt(parts[0], 10) || 0;
    const mStr = parts[1] ? parts[1].trim() : '';
    let m = 0;
    if (mStr.length === 1) {
      m = (parseInt(mStr, 10) || 0) * 10;
    } else {
      m = parseInt(mStr, 10) || 0;
    }
    const total = h + m / 60;
    return total > 0 ? Math.round(total * 1000) / 1000 : 8.0;
  }

  // Decimal with comma or dot (e.g. "7,5", "7.5", "7,75", "8")
  str = str.replace(',', '.');
  const num = parseFloat(str);
  if (!isNaN(num) && num > 0) {
    return Math.round(num * 1000) / 1000;
  }

  return 8.0;
}

/**
 * Formats decimal hours into standard readable French notation (e.g. 7.5 -> "7h30", 8 -> "8h00").
 */
export function formatDailyHours(hours: number | null | undefined): string {
  if (hours === null || hours === undefined || isNaN(hours) || hours <= 0) {
    return '8h00';
  }
  const totalMin = Math.round(hours * 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h${m.toString().padStart(2, '0')}`;
}

