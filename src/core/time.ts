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
