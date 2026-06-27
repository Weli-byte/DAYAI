import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merges Tailwind class names, resolving conflicts correctly.
// Usage: cn('px-4 py-2', isActive && 'bg-primary', className)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Truncates an Ethereum address: 0x1234...abcd
export function truncateAddress(address: string, chars = 4): string {
  if (!address || address.length < chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// Formats a number with compact notation: 1200 → "1.2K"
export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

// Formats MON token amounts
export function formatMon(value: bigint | number, decimals = 18): string {
  const num = typeof value === 'bigint' ? Number(value) / 10 ** decimals : value;
  return `${num.toFixed(4)} MON`;
}

// Returns a relative time string: "2 hours ago"
export function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];
  for (const { label, seconds: s } of intervals) {
    const count = Math.floor(seconds / s);
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}
