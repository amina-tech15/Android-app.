import { useMemo } from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Eye,
  Replace,
  Send,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
} from 'lucide-react';
import type { SensitiveMatch, SensitiveType } from '@/types';
import {
  getRiskLevel,
  getTypeLabel,
  getTypeDescription,
  applyPlaceholders,
} from '@/utils/scanner';
import { riskColors, typeColors } from '@/utils/colors';

interface ScanResultsProps {
  text: string;
  matches: SensitiveMatch[];
  onSendProtected: (protectedText: string) => void;
  onSendOriginal: () => void;
  isSending: boolean;
}

const TYPE_ICONS: Record<SensitiveType, typeof User> = {
  name: User,
  phone: Phone,
  email: Mail,
  address: MapPin,
  cnic: CreditCard,
};

function HighlightedText({
  text,
  matches,
}: {
  text: string;
  matches: SensitiveMatch[];
}) {
  const segments = useMemo(() => {
    const parts: { content: string; match?: SensitiveMatch }[] = [];
    let lastEnd = 0;
    for (const m of matches) {
      if (m.start > lastEnd) {
        parts.push({ content: text.slice(lastEnd, m.start) });
      }
      parts.push({ content: text.slice(m.start, m.end), match: m });
      lastEnd = m.end;
    }
    if (lastEnd < text.length) {
      parts.push({ content: text.slice(lastEnd) });
    }
    return parts;
  }, [text, matches]);

  return (
    <p className="text-sm leading-relaxed text-slate-300 break-words">
      {segments.map((seg, i) => {
        if (seg.match) {
          const tc = typeColors[seg.match.type];
          return (
            <mark
              key={i}
              className={`rounded px-1 py-0.5 font-medium border ${tc.bg} ${tc.border} ${tc.text}`}
            >
              {seg.content}
            </mark>
          );
        }
        return <span key={i}>{seg.content}</span>;
      })}
    </p>
  );
}

export function ScanResults({
  text,
  matches,
  onSendProtected,
  onSendOriginal,
  isSending,
}: ScanResultsProps) {
  const risk = getRiskLevel(matches);
  const rc = riskColors[risk.color];
  const protectedText = applyPlaceholders(text, matches);

  // Group matches by type
  const grouped = useMemo(() => {
    const groups: Record<SensitiveType, SensitiveMatch[]> = {
      name: [],
      phone: [],
      email: [],
      address: [],
      cnic: [],
    };
    for (const m of matches) {
      groups[m.type].push(m);
    }
    return groups;
  }, [matches]);

  const typeOrder: SensitiveType[] = ['cnic', 'address', 'phone', 'email', 'name'];

  return (
    <div className="space-y-4">
      {/* Risk Banner */}
      <div
        className={`rounded-2xl border ${rc.borderLight} ${rc.bgLight} p-4 flex items-start gap-3`}
      >
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-xl ${rc.bgLight} ${rc.border} border flex items-center justify-center`}
        >
          {risk.level === 'safe' ? (
            <ShieldCheck className={`w-5 h-5 ${rc.text}`} />
          ) : (
            <ShieldAlert className={`w-5 h-5 ${rc.text}`} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-bold text-sm ${rc.text}`}>
              {risk.level === 'safe'
                ? 'No Threats Detected'
                : 'Privacy Warning'}
            </h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rc.bgLight} ${rc.border} border ${rc.text}`}
            >
              {risk.label.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {risk.level === 'safe'
              ? 'Your prompt appears to be free of sensitive personal information. You can safely send it to the AI.'
              : `${matches.length} sensitive item${matches.length !== 1 ? 's' : ''} detected in your prompt. We strongly recommend replacing them with placeholders before sending to protect your privacy.`}
          </p>
        </div>
      </div>

      {/* Highlighted text preview */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800 bg-slate-900/60">
          <Eye className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-200">
            Highlighted Preview
          </span>
        </div>
        <div className="px-5 py-4 max-h-[200px] overflow-y-auto custom-scroll">
          <HighlightedText text={text} matches={matches} />
        </div>
      </div>

      {/* Detected items list */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800 bg-slate-900/60">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium text-slate-200">
            Detected Sensitive Information
          </span>
          <span className="ml-auto text-xs text-slate-500">
            {matches.length} item{matches.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="divide-y divide-slate-800/60">
          {typeOrder
            .filter((t) => grouped[t].length > 0)
            .map((type) => {
              const Icon = TYPE_ICONS[type];
              const tc = typeColors[type];
              return (
                <div key={type} className="px-5 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${tc.text}`} />
                    <span className={`text-xs font-semibold ${tc.text}`}>
                      {getTypeLabel(type)}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      ({grouped[type].length})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                    {getTypeDescription(type)}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {grouped[type].map((m) => (
                      <span
                        key={m.id}
                        className={`text-xs px-2.5 py-1 rounded-lg font-mono ${tc.bg} ${tc.border} border ${tc.text}`}
                      >
                        {m.value}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Protected preview + actions */}
      {matches.length > 0 && (
        <div className="rounded-2xl border border-emerald-800/40 bg-emerald-950/20 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-emerald-800/30 bg-emerald-950/30">
            <Replace className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-200">
              Protected Version (with placeholders)
            </span>
          </div>
          <div className="px-5 py-4 max-h-[150px] overflow-y-auto custom-scroll">
            <p className="text-sm leading-relaxed text-slate-300 break-words">
              {protectedText}
            </p>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => onSendProtected(protectedText)}
          disabled={isSending}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          Send Protected Prompt to AI
        </button>
        {matches.length > 0 && (
          <button
            onClick={onSendOriginal}
            disabled={isSending}
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 rounded-xl transition-colors disabled:opacity-50"
          >
            <AlertTriangle className="w-4 h-4" />
            Send Anyway (risky)
          </button>
        )}
      </div>
    </div>
  );
}
