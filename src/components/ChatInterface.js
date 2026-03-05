'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Chat request failed');
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.content },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-48px)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-20">
            <div className="font-display text-2xl text-stone-850 tracking-[8px] mb-4">◉</div>
            <h2 className="font-display text-sm tracking-[4px] text-cream-dim uppercase mb-2">
              Protocol Assistant
            </h2>
            <p className="text-sm text-iron max-w-md mx-auto">
              Ask about your program, get form advice, discuss programming changes, or analyze your training data.
              Claude has access to your full training history and program definition.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {[
                'How should I progress my incline press?',
                'Analyze my leg day volume',
                'Am I recovering enough between sessions?',
                'Suggest a deload protocol',
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="font-mono text-[9px] tracking-[1px] text-iron border border-border px-3 py-1.5 hover:text-cream-dim hover:border-border-light transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[85%] px-4 py-3 text-sm leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-gold/10 border border-gold-dim/30 text-cream'
                  : 'bg-stone-850 border border-border text-cream-dim'
                }
              `}
            >
              <pre className="whitespace-pre-wrap font-body">{msg.content}</pre>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-stone-850 border border-border px-4 py-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="border-t border-border p-4 bg-obsidian">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your training..."
            className="flex-1 text-sm"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="font-mono text-[9px] tracking-[2px] uppercase px-4 py-2 bg-gold/10 border border-gold-dim text-gold hover:bg-gold/20 transition-colors disabled:opacity-30"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
