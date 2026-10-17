const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const fullDate = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

const TIME_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 60 * 60],
  ["month", 30 * 24 * 60 * 60],
  ["week", 7 * 24 * 60 * 60],
  ["day", 24 * 60 * 60],
  ["hour", 60 * 60],
  ["minute", 60],
];

/** 21408 → "21.4K" */
export function formatCompactNumber(value: number): string {
  return compactNumber.format(value);
}

/** ISO date → "3 days ago" */
export function formatRelativeTime(
  iso: string,
  now: number = Date.now(),
): string {
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return "";
  const seconds = (time - now) / 1000;
  for (const [unit, unitSeconds] of TIME_UNITS) {
    if (Math.abs(seconds) >= unitSeconds)
      return relativeTime.format(Math.trunc(seconds / unitSeconds), unit);
  }
  return "just now";
}

const BYTE_UNITS = ["B", "KB", "MB", "GB", "TB"];

/** 63878241 → "60.92 MB" (1024-based, like Docker Hub) */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "—";
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    BYTE_UNITS.length - 1,
  );
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(exponent === 0 ? 0 : 2)} ${BYTE_UNITS[exponent]}`;
}

/** ISO date → "Oct 16, 2026, 8:48 AM" */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : fullDate.format(date);
}
