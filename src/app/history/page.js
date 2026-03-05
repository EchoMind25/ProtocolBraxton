'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import Nav from '@/components/Nav';
import ExportButton from '@/components/ExportButton';

export default function HistoryPage() {
  const supabase = createClient();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSession, setExpandedSession] = useState(null);
  const [sessionDetails, setSessionDetails] = useState({});

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('workout_sessions')
        .select(`
          *,
          program_day:program_days(id, name, subtitle, day_type, program_exercises(*))
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(50);

      setSessions(data || []);
      setLoading(false);
    }
    load();
  }, []);

  async function toggleSession(sessionId) {
    if (expandedSession === sessionId) {
      setExpandedSession(null);
      return;
    }

    setExpandedSession(sessionId);

    if (!sessionDetails[sessionId]) {
      const { data: logs } = await supabase
        .from('set_logs')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at');

      const { data: notes } = await supabase
        .from('exercise_notes')
        .select('*')
        .eq('session_id', sessionId);

      setSessionDetails((prev) => ({
        ...prev,
        [sessionId]: { logs: logs || [], notes: notes || [] },
      }));
    }
  }

  const TYPE_COLORS = {
    push: 'border-l-push',
    pull: 'border-l-pull',
    legs: 'border-l-legs',
    rest: 'border-l-iron',
  };

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="font-display text-xl tracking-[5px] text-cream uppercase">
            Training <span className="text-gold">History</span>
          </h1>
          <p className="text-sm text-cream-dim mt-1">
            {sessions.length} sessions logged
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <span className="font-mono text-sm text-gold-dim animate-pulse">Loading...</span>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-16 border border-border bg-stone-850">
            <p className="text-sm text-cream-dim">No sessions logged yet. Start a workout from the dashboard.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((s) => {
              const isExpanded = expandedSession === s.id;
              const details = sessionDetails[s.id];
              const dayType = s.program_day?.day_type || 'rest';
              const borderColor = TYPE_COLORS[dayType] || 'border-l-border';

              return (
                <div key={s.id} className={`border border-border bg-stone-850 border-l-2 ${borderColor}`}>
                  <button
                    onClick={() => toggleSession(s.id)}
                    className="w-full text-left px-4 py-3 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm tracking-[2px] text-cream uppercase">
                          {s.program_day?.name || 'Unknown'}
                        </span>
                        {s.completed && (
                          <span className="font-mono text-[7px] tracking-[2px] text-legs border border-legs/30 px-1.5 py-0.5 uppercase">
                            ✓ Done
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[9px] text-cream-dim mt-0.5">
                        {new Date(s.date + 'T12:00:00').toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                    <span className="font-mono text-cream-dim text-xs">{isExpanded ? '−' : '+'}</span>
                  </button>

                  {isExpanded && details && (
                    <div className="border-t border-border px-4 py-3 animate-fade-in">
                      {s.notes && <p className="text-xs text-cream-dim mb-3">Session: {s.notes}</p>}

                      {/* Group logs by exercise */}
                      {(s.program_day?.program_exercises || [])
                        .sort((a, b) => a.sort_order - b.sort_order)
                        .map((ex) => {
                          const exLogs = details.logs.filter((l) => l.exercise_id === ex.id);
                          const exNote = details.notes.find((n) => n.exercise_id === ex.id);
                          if (exLogs.length === 0 && !exNote) return null;

                          return (
                            <div key={ex.id} className="mb-3">
                              <div className="font-mono text-[9px] tracking-[1px] text-cream-dim uppercase mb-1">
                                {ex.name}
                              </div>
                              {exLogs
                                .sort((a, b) => a.set_number - b.set_number)
                                .map((log) => (
                                  <div key={log.id} className="flex gap-2 font-mono text-[10px] text-cream-dim">
                                    <span className="w-6">S{log.set_number}</span>
                                    <span className="text-cream">{log.weight_lbs ?? '—'}lbs</span>
                                    <span>×</span>
                                    <span className="text-cream">{log.reps ?? '—'}</span>
                                    {log.rir != null && <span className="text-gold-dim">@{log.rir}RIR</span>}
                                    {log.notes && <span className="text-cream-dim">— {log.notes}</span>}
                                  </div>
                                ))}
                              {exNote?.notes && (
                                <p className="text-[10px] text-cream-dim/60 italic mt-1">{exNote.notes}</p>
                              )}
                            </div>
                          );
                        })}

                      <div className="mt-3 pt-3 border-t border-border/50">
                        <ExportButton
                          dayData={{
                            ...s.program_day,
                            program_exercises: s.program_day?.program_exercises || [],
                          }}
                          session={s}
                          setLogs={details.logs}
                          exerciseNotes={details.notes}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
