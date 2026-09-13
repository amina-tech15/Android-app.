import { useState, useRef, useEffect } from 'react';
import { ScanLine, Loader2, AlertTriangle, ShieldX } from 'lucide-react';
import type { SensitiveMatch } from '@/types';
import { scanText, getRiskLevel, getTypeLabel } from '@/utils/scanner';
import { riskColors, typeColors } from '@/utils/colors';

interface PromptInputProps {
  onScan: (text: string, matches: SensitiveMatch[]) => void;
  isScanning: boolean;
  hasResults: boolean;
  matchCount: number;
  onClear: () => void;
  prefill?: string | null;
  onPrefillConsumed?: () => void;
}

export function PromptInput({
  onScan,
  isScanning,
  hasResults,
  onClear,
  prefill,
  onPrefillConsumed,
}: PromptInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (prefill) {
      setText(prefill);
      onPrefillConsumed?.();
      // Auto-scan after prefill
      const matches = scanText(prefill);
      onScan(prefill, matches);
    }
  }, [prefill, onPrefillConsumed, onScan]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 300) + 'px';
    }
  }, [text]);

  const handleScan = () => {
    if (!text.trim()) return;
    const matches = scanText(text);
    onScan(text, matches);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleScan();
    }
  };

  const liveMatches = text.trim() ? scanText(text) : [];
  const liveRisk = getRiskLevel(liveMatches);
  const rc = riskColors[liveRisk.color];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-2">
          <ScanLine className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-slate-200">
            Prompt Input
          </span>
        </div>
        {liveMatches.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs">
            <AlertTriangle className={`w-3.5 h-3.5 ${rc.text}`} />
            <span className={`${rc.text} font-medium`}>
              {liveMatches.length} sensitive item
              {liveMatches.length !== 1 ? 's' : ''} detected
            </span>
          </div>
        )}
      </div>

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Paste or type your prompt here... e.g., 'My name is Mr. Ahmed Khan, my phone is 0300-1234567, email ahmed@example.com, CNIC 35201-1234567-1, living at 123 Main Street Lahore.'"
        className="w-full px-5 py-4 bg-transparent text-slate-100 placeholder:text-slate-600 text-sm leading-relaxed resize-none focus:outline-none min-h-[120px]"
        spellCheck={false}
      />

      <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>{text.length} chars</span>
          <span className="text-slate-700">·</span>
          <span className="hidden sm:inline">
            Press{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-mono">
              ⌘/Ctrl + Enter
            </kbd>{' '}
            to scan
          </span>
        </div>

        <div className="flex items-center gap-2">
          {hasResults && (
            <button
              onClick={() => {
                setText('');
                onClear();
              }}
              className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={handleScan}
            disabled={!text.trim() || isScanning}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed rounded-lg transition-all shadow-lg shadow-emerald-500/20 disabled:shadow-none"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <ShieldX className="w-4 h-4" />
                Check Privacy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live detection preview pills */}
      {liveMatches.length > 0 && (
        <div className="px-5 py-2.5 border-t border-slate-800 bg-slate-950/40 flex flex-wrap gap-1.5">
          {liveMatches.slice(0, 8).map((m) => {
            const tc = typeColors[m.type];
            return (
              <span
                key={m.id}
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${tc.bg} ${tc.border} ${tc.text}`}
              >
                {getTypeLabel(m.type)}
              </span>
            );
          })}
          {liveMatches.length > 8 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium text-slate-500">
              +{liveMatches.length - 8} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}
