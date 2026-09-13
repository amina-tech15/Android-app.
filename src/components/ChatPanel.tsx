import { useEffect, useRef } from 'react';
import { Bot, User, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import type { ChatMessage } from '@/types';

interface ChatPanelProps {
  messages: ChatMessage[];
  isResponding: boolean;
}

export function ChatPanel({ messages, isResponding }: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isResponding]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden flex flex-col h-[500px]">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800 bg-slate-900/60 flex-shrink-0">
        <div className="relative">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
        </div>
        <div>
          <span className="text-sm font-medium text-slate-200">
            AI Assistant
          </span>
          <p className="text-[10px] text-slate-500 leading-tight">
            Responding to protected prompts
          </p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scroll px-5 py-4 space-y-4"
      >
        {messages.length === 0 && !isResponding && (
          <div className="h-full flex flex-col items-center justify-center text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/60 flex items-center justify-center mb-3">
              <Bot className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-sm text-slate-500 font-medium">
              No messages yet
            </p>
            <p className="text-xs text-slate-600 mt-1 max-w-[240px]">
              Scan your prompt and send the protected version to start chatting
              with the AI.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'assistant' ? '' : 'flex-row-reverse'}`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                msg.role === 'assistant'
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                  : 'bg-slate-700'
              }`}
            >
              {msg.role === 'assistant' ? (
                <Bot className="w-4 h-4 text-white" />
              ) : (
                <User className="w-4 h-4 text-slate-300" />
              )}
            </div>
            <div
              className={`flex-1 max-w-[85%] ${
                msg.role === 'assistant' ? '' : 'flex flex-col items-end'
              }`}
            >
              <div
                className={`inline-block px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'assistant'
                    ? 'bg-slate-800/80 text-slate-200 rounded-tl-sm'
                    : 'bg-emerald-600/20 text-emerald-50 border border-emerald-700/30 rounded-tr-sm'
                }`}
              >
                {msg.content}
              </div>
              <div className="flex items-center gap-1.5 mt-1 px-1">
                {msg.protected ? (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                    <ShieldCheck className="w-3 h-3" />
                    Protected
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] text-rose-400">
                    <ShieldAlert className="w-3 h-3" />
                    Unprotected
                  </span>
                )}
                <span className="text-[10px] text-slate-600">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}

        {isResponding && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="px-4 py-3 rounded-xl bg-slate-800/80 rounded-tl-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
