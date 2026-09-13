import {
  ShieldCheck,
  Eye,
  ScanSearch,
  Sparkles,
} from 'lucide-react';

interface EmptyStateProps {
  onTryExample: (text: string) => void;
}

const EXAMPLES = [
  {
    label: 'Personal Info',
    text: 'Hi, my name is Mr. Ahmed Khan. You can reach me at 0300-1234567 or ahmed.khan@example.com. My CNIC is 35201-1234567-1 and I live at 123 Garden Street Lahore.',
  },
  {
    label: 'Business Contact',
    text: 'Please contact Ms. Sarah Ali at 0321-9876543 or sarah.ali@company.org. Her office is at 45 Block C Avenue Karachi. CNIC: 42101-9876543-2.',
  },
  {
    label: 'Safe Prompt',
    text: 'What are the best practices for securing a web application against common vulnerabilities?',
  },
];

const FEATURES = [
  {
    icon: ScanSearch,
    title: 'Detect',
    description: 'Scans for names, phones, emails, addresses & CNIC numbers',
  },
  {
    icon: Eye,
    title: 'Highlight',
    description: 'Visually marks every sensitive item in your prompt',
  },
  {
    icon: ShieldCheck,
    title: 'Protect',
    description: 'Replaces personal data with safe placeholders',
  },
];

export function EmptyState({ onTryExample }: EmptyStateProps) {
  return (
    <div className="text-center py-8 sm:py-12">
      <div className="relative inline-block mb-6">
        <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
          <ShieldCheck className="w-10 h-10 text-white" strokeWidth={2} />
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
        Your Privacy, Protected.
      </h2>
      <p className="text-sm text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
        Scan your prompts for sensitive personal information before sending them
        to AI. Replace names, phone numbers, emails, addresses, and CNIC numbers
        with safe placeholders.
      </p>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-8">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
              <f.icon className="w-4.5 h-4.5 text-emerald-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-200 mb-1">
              {f.title}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {f.description}
            </p>
          </div>
        ))}
      </div>

      {/* Example prompts */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Try an example
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => onTryExample(ex.text)}
              className="px-4 py-2.5 text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 hover:border-emerald-500/40 rounded-xl transition-all text-left sm:text-center"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
