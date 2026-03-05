# Protocol Braxton — VI

PPL×2 Championship Standard Training Protocol — PWA

## Stack

- **Next.js 14** (App Router) → Vercel deployment
- **Supabase** (Auth + Postgres + RLS) → Free tier
- **Tailwind CSS** → Dark theme, high-contrast
- **Claude API** → In-app training assistant
- **PWA** → Installable, offline-capable

## Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd protocol-braxton
npm install
```

### 2. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run these files in order:
   - `supabase/migrations/001_initial_schema.sql` — tables, indexes, RLS policies
   - `supabase/migrations/002_seed_program.sql` — Protocol Braxton VI program data
3. Copy your project URL and anon key from **Settings → API**

### 3. Environment

```bash
cp .env.example .env.local
```

Fill in:
- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — your anon/public key
- `ANTHROPIC_API_KEY` — your Claude API key (optional, for chat feature)

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

```bash
npx vercel
```

Add the same env vars in Vercel project settings.

## Features

- **7-day program view** with full exercise details, coach notes, technique badges
- **Inline set logging** — weight, reps, RIR, notes per set
- **Session management** — start, log, complete workouts
- **Export** — one-click formatted text copy for pasting into Claude chat
- **Training history** — browse all past sessions with full detail
- **Claude chat** — in-app assistant with full program + training history context
- **PWA** — installable on phone, works offline

## Project Structure

```
src/
├── app/
│   ├── api/chat/route.js     # Claude API with context injection
│   ├── chat/page.js          # Chat interface
│   ├── dashboard/page.js     # Main program view + logging
│   ├── history/page.js       # Past sessions browser
│   ├── login/page.js         # Auth
│   └── layout.js             # Root layout, fonts, PWA
├── components/
│   ├── ChatInterface.js      # Chat UI
│   ├── DayNav.js             # Day selector
│   ├── ExerciseCard.js       # Exercise display + set logging
│   ├── ExportButton.js       # Copy to clipboard
│   ├── Nav.js                # Top navigation
│   └── StatsBar.js           # Program metrics
├── lib/
│   ├── export.js             # Formatted text export
│   ├── supabase.js           # Browser client
│   └── supabase-server.js    # Server client
└── middleware.js              # Auth protection
supabase/
└── migrations/
    ├── 001_initial_schema.sql
    └── 002_seed_program.sql
```

## PWA Icons

Replace `public/icon-192.png` and `public/icon-512.png` with your app icons before deploying.
