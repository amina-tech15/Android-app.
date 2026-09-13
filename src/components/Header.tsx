import { Shield, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  protectedCount: number;
  totalScanned: number;
}

export function Header({ protectedCount, totalScanned }: HeaderProps) {
  return (
    <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/30 blur-xl rounded-full" />
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-tight">
              AI Privacy Firewall
            </h1>
            <p className="text-xs text-slate-400 leading-tight">
              Scan · Protect · Send
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div className="text-xs">
              <span className="text-slate-400">Protected: </span>
              <span className="font-semibold text-emerald-400">
                {protectedCount}
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-xs">
              <span className="text-slate-400">Scanned: </span>
              <span className="font-semibold text-slate-200">
                {totalScanned}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-400 font-medium">Active</span>
          </div>
        </div>
      </div>
    </header>
  );
}
