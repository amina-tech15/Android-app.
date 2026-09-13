import type { SensitiveMatch, SensitiveType } from '@/types';

// CNIC format: 12345-1234567-1
const CNIC_PATTERN = /\b\d{5}-\d{7}-\d\b/g;
// Phone: +92 followed by 10 digits, or 03 followed by 10 digits, or 11 digits starting with 03
const PHONE_PATTERN = /(?:\+92\s?3\d{2}[\s-]?\d{7})|(?:\b03\d{2}[\s-]?\d{7})\b/g;
// Email
const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
// Address heuristic: number + street/road/avenue/etc
const ADDRESS_PATTERN = /\b\d{1,5}\s+[A-Z][a-zA-Z]+\s+(?:Street|St|Road|Rd|Avenue|Ave|Boulevard|Blvd|Lane|Ln|Drive|Dr|Plaza|Block|Sector|House)\b(?:[^.!?\n]{0,60})?/g;
// Name heuristic: Title + capitalized word(s)
const NAME_PATTERN = /\b(?:Mr|Mrs|Ms|Dr|Prof)\.\s+[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?\b/g;

const PLACEHOLDERS: Record<SensitiveType, string> = {
  name: '[NAME]',
  phone: '[PHONE]',
  email: '[EMAIL]',
  address: '[ADDRESS]',
  cnic: '[CNIC]',
};

const TYPE_LABELS: Record<SensitiveType, string> = {
  name: 'Name',
  phone: 'Phone Number',
  email: 'Email Address',
  address: 'Address',
  cnic: 'CNIC Number',
};

const TYPE_DESCRIPTIONS: Record<SensitiveType, string> = {
  name: 'A personal name was detected — this can reveal the identity of a real person.',
  phone: 'A phone number was detected — this can be used for harassment or SIM-based attacks.',
  email: 'An email address was detected — this can lead to spam or account compromise.',
  address: 'A physical address was detected — this is sensitive location data.',
  cnic: 'A national ID (CNIC) number was detected — this is highly sensitive government-issued identification.',
};

interface PatternSpec {
  type: SensitiveType;
  pattern: RegExp;
}

const PATTERNS: PatternSpec[] = [
  { type: 'cnic', pattern: CNIC_PATTERN },
  { type: 'email', pattern: EMAIL_PATTERN },
  { type: 'phone', pattern: PHONE_PATTERN },
  { type: 'address', pattern: ADDRESS_PATTERN },
  { type: 'name', pattern: NAME_PATTERN },
];

export function scanText(text: string): SensitiveMatch[] {
  const matches: SensitiveMatch[] = [];
  let id = 0;

  for (const { type, pattern } of PATTERNS) {
    const re = new RegExp(pattern.source, pattern.flags);
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      // Skip overlaps with already-found matches
      const start = m.index;
      const end = start + m[0].length;
      const overlaps = matches.some(
        (ex) => start < ex.end && end > ex.start
      );
      if (!overlaps) {
        matches.push({
          id: id++,
          type,
          value: m[0],
          start,
          end,
        });
      }
      if (m.index === re.lastIndex) re.lastIndex++;
    }
  }

  matches.sort((a, b) => a.start - b.start);
  return matches;
}

export function applyPlaceholders(
  text: string,
  matches: SensitiveMatch[]
): string {
  let result = '';
  let lastEnd = 0;
  for (const m of matches) {
    result += text.slice(lastEnd, m.start);
    result += PLACEHOLDERS[m.type];
    lastEnd = m.end;
  }
  result += text.slice(lastEnd);
  return result;
}

export function getPlaceholder(type: SensitiveType): string {
  return PLACEHOLDERS[type];
}

export function getTypeLabel(type: SensitiveType): string {
  return TYPE_LABELS[type];
}

export function getTypeDescription(type: SensitiveType): string {
  return TYPE_DESCRIPTIONS[type];
}

export function getRiskLevel(matches: SensitiveMatch[]): {
  level: 'safe' | 'low' | 'moderate' | 'high' | 'critical';
  label: string;
  color: string;
} {
  const count = matches.length;
  const hasCnic = matches.some((m) => m.type === 'cnic');
  const hasAddress = matches.some((m) => m.type === 'address');

  if (count === 0)
    return { level: 'safe', label: 'Safe', color: 'emerald' };
  if (hasCnic || count >= 5)
    return { level: 'critical', label: 'Critical', color: 'rose' };
  if (count >= 3 || hasAddress)
    return { level: 'high', label: 'High Risk', color: 'orange' };
  if (count >= 2)
    return { level: 'moderate', label: 'Moderate', color: 'amber' };
  return { level: 'low', label: 'Low Risk', color: 'yellow' };
}
