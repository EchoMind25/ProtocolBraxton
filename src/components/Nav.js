'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'PROGRAM', icon: '◆' },
  { href: '/history', label: 'HISTORY', icon: '▤' },
  { href: '/chat', label: 'CLAUDE', icon: '◉' },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-40 bg-obsidian/95 backdrop-blur border-b border-border">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-12">
        {/* Wordmark */}
        <a href="/dashboard" className="font-display text-xs tracking-[5px] text-cream uppercase">
          P<span className="text-gold">B</span>
        </a>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                className={`
                  font-mono text-[9px] tracking-[2px] uppercase px-3 py-1.5 transition-colors
                  ${active
                    ? 'text-gold bg-gold-faint border border-gold-dim/40'
                    : 'text-iron hover:text-cream-dim'
                  }
                `}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
              </a>
            );
          })}
          <button
            onClick={handleSignOut}
            className="font-mono text-[9px] tracking-[2px] text-iron hover:text-red-400 px-2 py-1.5 ml-2 transition-colors uppercase"
          >
            EXIT
          </button>
        </div>
      </div>
    </nav>
  );
}
