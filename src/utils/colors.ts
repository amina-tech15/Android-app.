import type { SensitiveType } from '@/types';

// Full class strings so Tailwind's JIT can detect them at build time
export const riskColors: Record<
  string,
  { text: string; bg: string; border: string; bgLight: string; borderLight: string }
> = {
  emerald: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500',
    border: 'border-emerald-500',
    bgLight: 'bg-emerald-500/10',
    borderLight: 'border-emerald-500/30',
  },
  yellow: {
    text: 'text-yellow-400',
    bg: 'bg-yellow-500',
    border: 'border-yellow-500',
    bgLight: 'bg-yellow-500/10',
    borderLight: 'border-yellow-500/30',
  },
  amber: {
    text: 'text-amber-400',
    bg: 'bg-amber-500',
    border: 'border-amber-500',
    bgLight: 'bg-amber-500/10',
    borderLight: 'border-amber-500/30',
  },
  orange: {
    text: 'text-orange-400',
    bg: 'bg-orange-500',
    border: 'border-orange-500',
    bgLight: 'bg-orange-500/10',
    borderLight: 'border-orange-500/30',
  },
  rose: {
    text: 'text-rose-400',
    bg: 'bg-rose-500',
    border: 'border-rose-500',
    bgLight: 'bg-rose-500/10',
    borderLight: 'border-rose-500/30',
  },
};

export const typeColors: Record<
  SensitiveType,
  { text: string; bg: string; border: string; dot: string }
> = {
  name: {
    text: 'text-sky-300',
    bg: 'bg-sky-500/15',
    border: 'border-sky-500/40',
    dot: 'bg-sky-400',
  },
  phone: {
    text: 'text-teal-300',
    bg: 'bg-teal-500/15',
    border: 'border-teal-500/40',
    dot: 'bg-teal-400',
  },
  email: {
    text: 'text-violet-300',
    bg: 'bg-violet-500/15',
    border: 'border-violet-500/40',
    dot: 'bg-violet-400',
  },
  address: {
    text: 'text-amber-300',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/40',
    dot: 'bg-amber-400',
  },
  cnic: {
    text: 'text-rose-300',
    bg: 'bg-rose-500/15',
    border: 'border-rose-500/40',
    dot: 'bg-rose-400',
  },
};
