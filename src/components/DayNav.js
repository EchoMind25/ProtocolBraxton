'use client';

const DAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const TYPE_COLORS = {
  push: 'text-push',
  pull: 'text-pull',
  legs: 'text-legs',
  rest: 'text-iron',
  combat: 'text-legs',
};

export default function DayNav({ days, activeDay, onDayChange }) {
  return (
    <div className="grid grid-cols-7 border-b border-border bg-stone-900">
      {days.map((day) => {
        const active = activeDay === day.id;
        const colorClass = TYPE_COLORS[day.day_type] || 'text-iron';
        return (
          <button
            key={day.id}
            onClick={() => onDayChange(day.id)}
            className={`
              relative py-2.5 px-1 text-center transition-colors border-r border-border last:border-r-0
              ${active ? 'bg-gold-faint' : 'hover:bg-stone-850'}
            `}
          >
            <span className="block font-mono text-[8px] tracking-[2px] text-iron">
              {DAY_LABELS[day.day_number - 1]}
            </span>
            <span className={`block font-display text-[10px] tracking-[1px] leading-tight mt-0.5 ${colorClass}`}>
              {day.name}
            </span>
            {active && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />
            )}
          </button>
        );
      })}
    </div>
  );
}
