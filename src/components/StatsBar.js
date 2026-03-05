'use client';

export default function StatsBar({ program }) {
  const meta = program?.meta || {};

  const stats = [
    { key: 'START WEIGHT', value: meta.start_weight || '141.8', unit: 'lbs' },
    { key: 'TARGET', value: meta.target_weight || '180', unit: 'lbs', gold: true },
    { key: 'BODY FAT', value: meta.body_fat || '7.1', unit: '%' },
    { key: 'DAILY CALORIES', value: meta.daily_calories?.toLocaleString() || '3,200' },
    { key: 'SPLIT', value: meta.split || 'PPL × 2' },
    { key: 'INTENSITY', value: meta.intensity || '2 RIR' },
    { key: 'FREQ/MUSCLE', value: meta.freq_per_muscle || '2×/wk', gold: true },
  ];

  return (
    <div className="flex overflow-x-auto scrollbar-none border-b border-border bg-obsidian">
      {stats.map((stat, i) => (
        <div key={i} className="flex-shrink-0 px-4 py-2.5 border-r border-border last:border-r-0">
          <div className="font-mono text-[7px] tracking-[3px] text-iron uppercase">
            {stat.key}
          </div>
          <div className={`font-display text-[15px] tracking-wide whitespace-nowrap ${stat.gold ? 'text-gold' : 'text-cream'}`}>
            {stat.value}
            {stat.unit && <sup className="text-[9px] text-cream-dim ml-0.5">{stat.unit}</sup>}
          </div>
        </div>
      ))}
    </div>
  );
}
