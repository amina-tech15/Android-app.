import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { PromptInput } from '@/components/PromptInput';
import { ScanResults } from '@/components/ScanResults';
import { ChatPanel } from '@/components/ChatPanel';
import { EmptyState } from '@/components/EmptyState';
import type { SensitiveMatch, ChatMessage } from '@/types';
import { generateMockResponse, simulateTypingDelay } from '@/utils/mockAI';

type ScanState = {
  text: string;
  matches: SensitiveMatch[];
} | null;

function App() {
  const [scanState, setScanState] = useState<ScanState>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isResponding, setIsResponding] = useState(false);
  const [totalScanned, setTotalScanned] = useState(0);
  const [protectedCount, setProtectedCount] = useState(0);
  const [prefill, setPrefill] = useState<string | null>(null);

  const handleScan = useCallback((text: string, matches: SensitiveMatch[]) => {
    setIsScanning(true);
    setTotalScanned((n) => n + 1);
    window.setTimeout(() => {
      setScanState({ text, matches });
      setIsScanning(false);
    }, 600);
  }, []);

  const handleClear = useCallback(() => {
    setScanState(null);
  }, []);

  const handleTryExample = useCallback((text: string) => {
    setPrefill(text);
  }, []);

  const handlePrefillConsumed = useCallback(() => {
    setPrefill(null);
  }, []);

  const handleSendProtected = useCallback(
    async (protectedText: string) => {
      const userMsg: ChatMessage = {
        id: Date.now(),
        role: 'user',
        content: protectedText,
        protected: true,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setProtectedCount((n) => n + 1);

      setIsResponding(true);
      await simulateTypingDelay();
      const response = generateMockResponse(protectedText);
      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
        protected: true,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsResponding(false);
    },
    []
  );

  const handleSendOriginal = useCallback(async () => {
    if (!scanState) return;
    const userMsg: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: scanState.text,
      protected: false,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);

    setIsResponding(true);
    await simulateTypingDelay();
    const response = generateMockResponse(scanState.text);
    const aiMsg: ChatMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: response,
      protected: false,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, aiMsg]);
    setIsResponding(false);
  }, [scanState]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-teal-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-slate-700/10 rounded-full blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative">
        <Header
          protectedCount={protectedCount}
          totalScanned={totalScanned}
        />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {!scanState && messages.length === 0 && (
            <div className="mb-8">
              <EmptyState onTryExample={handleTryExample} />
            </div>
          )}

          <div className="space-y-4">
            <PromptInput
              onScan={handleScan}
              isScanning={isScanning}
              hasResults={!!scanState}
              matchCount={scanState?.matches.length ?? 0}
              onClear={handleClear}
              prefill={prefill}
              onPrefillConsumed={handlePrefillConsumed}
            />

            {scanState && (
              <ScanResults
                text={scanState.text}
                matches={scanState.matches}
                onSendProtected={handleSendProtected}
                onSendOriginal={handleSendOriginal}
                isSending={isResponding}
              />
            )}
          </div>

          <div className="mt-6">
            <ChatPanel messages={messages} isResponding={isResponding} />
          </div>

          <footer className="mt-8 text-center pb-4">
            <p className="text-xs text-slate-600">
              AI Privacy Firewall — All scanning happens locally in your
              browser. No data is sent to external servers.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
