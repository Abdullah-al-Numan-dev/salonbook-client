import { SALON_TIMEZONE } from "./constants";

export function salonToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: SALON_TIMEZONE }).format(new Date());
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// 0 = Sunday ... 5 = Friday
export function dayOfWeek(dateStr: string): number {
  return new Date(`${dateStr}T00:00:00Z`).getUTCDay();
}