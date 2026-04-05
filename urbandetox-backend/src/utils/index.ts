import { randomUUID } from 'node:crypto';

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Date(date).toLocaleDateString('en-IN', options ?? defaultOptions);
}

export function formatDateRange(startDate: string | Date, endDate: string | Date): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startMonth = start.toLocaleDateString('en-IN', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-IN', { month: 'short' });

  if (startMonth === endMonth && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} - ${end.getDate()} ${startMonth} ${end.getFullYear()}`;
  }

  return `${start.getDate()} ${startMonth} - ${end.getDate()} ${endMonth} ${end.getFullYear()}`;
}

export function calculateAge(dob: string | Date): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trim()}...`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function createId(prefix: string): string {
  return `${prefix}_${randomUUID().replace(/-/g, '').slice(0, 16)}`;
}

export function createToken(length = 32): string {
  const raw = randomUUID().replace(/-/g, '') + randomUUID().replace(/-/g, '');
  return raw.slice(0, length);
}

export function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function toJson(value: unknown): string {
  return JSON.stringify(value ?? null);
}

export function computeFillRate(confirmed: number, max: number): number {
  if (max <= 0) {
    return 0;
  }

  return Math.round((confirmed / max) * 100);
}

export function ensureNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function normalizeBoolean(value: FormDataEntryValue | string | null | undefined): boolean {
  if (typeof value !== 'string') {
    return Boolean(value);
  }

  return ['true', '1', 'on', 'yes'].includes(value.toLowerCase());
}

export function sanitizeFilename(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  const name = lastDot === -1 ? filename : filename.slice(0, lastDot);
  const ext = lastDot === -1 ? '' : filename.slice(lastDot).toLowerCase();
  const safeBase = slugify(name) || 'upload';
  return `${safeBase}${ext}`;
}
