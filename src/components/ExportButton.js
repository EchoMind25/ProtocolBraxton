'use client';

import { useState } from 'react';
import { exportSessionAsText, copyToClipboard } from '@/lib/export';

export default function ExportButton({ dayData, session, setLogs, exerciseNotes }) {
  const [copied, setCopied] = useState(false);

  async function handleExport() {
    const text = exportSessionAsText(dayData, session, setLogs, exerciseNotes);
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (!session) return null;

  return (
    <button
      onClick={handleExport}
      className={`
        font-mono text-[8px] tracking-[2px] uppercase px-3 py-1.5 border transition-all
        ${copied
          ? 'border-legs text-legs bg-legs/10'
          : 'border-gold-dim/50 text-gold hover:bg-gold-faint'
        }
      `}
    >
      {copied ? '✓ COPIED TO CLIPBOARD' : '⎘ EXPORT FOR CLAUDE'}
    </button>
  );
}
