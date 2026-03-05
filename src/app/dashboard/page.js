'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import Nav from '@/components/Nav';
import StatsBar from '@/components/StatsBar';
import DayNav from '@/components/DayNav';
import ExerciseCard from '@/components/ExerciseCard';
import ExportButton from '@/components/ExportButton';

export default function DashboardPage() {
  const supabase = createClient();
  const [program, setProgram] = useState(null);
  const [days, setDays] = useState([]);
  const [activeDay, setActiveDay] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [session, setSession] = useState(null);
  const [setLogs, setSetLogs] = useState([]);
  const [exerciseNotes, setExerciseNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Load program and days
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Fetch template program
      const { data: programs } = await supabase
        .from('programs')
        .select('*')
        .eq('is_template', true)
        .limit(1);

      if (programs?.length > 0) {
        setProgram(programs[0]);

        const { data: dayData } = await supabase
          .from('program_days')
          .select('*')
          .eq('program_id', programs[0].id)
          .order('sort_order');

        setDays(dayData || []);

        // Auto-select today's day (Mon=1)
        const today = new Date().getDay(); // 0=Sun, 1=Mon...
        const dayNum = today === 0 ? 7 : today;
        const todayDay = dayData?.find((d) => d.day_number === dayNum);
        if (todayDay) setActiveDay(todayDay.id);
        else if (dayData?.length > 0) setActiveDay(dayData[0].id);
      }

      setLoading(false);
    }
    init();
  }, []);

  // Load exercises + session when day changes
  const loadDayData = useCallback(async () => {
    if (!activeDay || !user) return;

    // Load exercises for this day
    const { data: exData } = await supabase
      .from('program_exercises')
      .select('*')
      .eq('day_id', activeDay)
      .order('sort_order');

    setExercises(exData || []);

    // Load or create today's session
    const today = new Date().toISOString().split('T')[0];
    let { data: sessions } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('program_day_id', activeDay)
      .eq('user_id', user.id)
      .eq('date', today)
      .limit(1);

    let currentSession = sessions?.[0] || null;
    setSession(currentSession);

    // Load set logs if session exists
    if (currentSession) {
      const { data: logs } = await supabase
        .from('set_logs')
        .select('*')
        .eq('session_id', currentSession.id)
        .order('created_at');

      setSetLogs(logs || []);

      const { data: notes } = await supabase
        .from('exercise_notes')
        .select('*')
        .eq('session_id', currentSession.id);

      setExerciseNotes(notes || []);
    } else {
      setSetLogs([]);
      setExerciseNotes([]);
    }
  }, [activeDay, user]);

  useEffect(() => {
    loadDayData();
  }, [loadDayData]);

  // Start a workout session
  async function startSession() {
    if (!user || !activeDay) return;
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('workout_sessions')
      .insert({ user_id: user.id, program_day_id: activeDay, date: today })
      .select()
      .single();

    if (!error && data) {
      setSession(data);
    }
  }

  // Log a set
  async function handleLogSet(exerciseId, setData) {
    if (!session) return;

    const { data, error } = await supabase
      .from('set_logs')
      .insert({
        session_id: session.id,
        exercise_id: exerciseId,
        ...setData,
      })
      .select()
      .single();

    if (!error && data) {
      setSetLogs((prev) => [...prev, data]);
    }
  }

  // Save exercise note
  async function handleSaveNote(exerciseId, noteText) {
    if (!session) return;

    const existing = exerciseNotes.find((n) => n.exercise_id === exerciseId);

    if (existing) {
      const { data } = await supabase
        .from('exercise_notes')
        .update({ notes: noteText })
        .eq('id', existing.id)
        .select()
        .single();

      if (data) {
        setExerciseNotes((prev) => prev.map((n) => (n.id === data.id ? data : n)));
      }
    } else {
      const { data } = await supabase
        .from('exercise_notes')
        .insert({ session_id: session.id, exercise_id: exerciseId, notes: noteText })
        .select()
        .single();

      if (data) {
        setExerciseNotes((prev) => [...prev, data]);
      }
    }
  }

  // Complete session
  async function completeSession() {
    if (!session) return;
    await supabase
      .from('workout_sessions')
      .update({ completed: true })
      .eq('id', session.id);

    setSession((prev) => ({ ...prev, completed: true }));
  }

  const activeDayData = days.find((d) => d.id === activeDay);
  const isRestDay = activeDayData?.day_type === 'rest';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-display text-sm tracking-[6px] text-gold-dim animate-pulse uppercase">
          Loading Protocol...
        </div>
      </div>
    );
  }

  // Group exercises by section
  const sections = [];
  let currentSection = null;
  for (const ex of exercises) {
    if (ex.section_name !== currentSection) {
      currentSection = ex.section_name;
      sections.push({ name: currentSection, range: ex.section_range, exercises: [] });
    }
    sections[sections.length - 1].exercises.push(ex);
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <StatsBar program={program} />
      <DayNav days={days} activeDay={activeDay} onDayChange={setActiveDay} />

      <main className="max-w-3xl mx-auto px-4 py-6 animate-slide-up">
        {activeDayData && (
          <>
            {/* Day hero */}
            <div className="border-b border-border pb-5 mb-6">
              <div className="font-display text-6xl font-black text-stone-850 leading-none tracking-tight select-none">
                {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][activeDayData.day_number - 1]}
              </div>
              <h1 className="font-display text-2xl font-bold tracking-[5px] text-cream uppercase mt-1">
                {activeDayData.name.split(' ')[0]}{' '}
                <span className="text-gold">{activeDayData.name.split(' ').slice(1).join(' ')}</span>
              </h1>
              <p className="text-sm text-cream-dim font-light italic mt-1 tracking-wide">
                {activeDayData.subtitle}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {(activeDayData.tags || []).map((tag, i) => (
                  <span
                    key={i}
                    className={`
                      font-mono text-[7px] tracking-[2px] px-2 py-1 border uppercase
                      ${tag.includes('PUSH') ? 'tag-push'
                        : tag.includes('PULL') ? 'tag-pull'
                        : tag.includes('LEG') || tag.includes('COMBAT') ? 'tag-legs'
                        : tag.includes('REST') ? 'tag-rest'
                        : i === 2 ? 'tag-gold'
                        : 'border-border-light text-cream-dim bg-stone-900'
                      }
                    `}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Rest day */}
            {isRestDay ? (
              <div className="text-center py-16 border border-border bg-stone-850">
                <div className="font-display text-5xl text-stone-900 tracking-[10px] mb-4">VII</div>
                <h2 className="font-display text-lg tracking-[6px] text-cream-dim uppercase mb-3">
                  Day of Rest
                </h2>
                <p className="text-sm text-iron italic max-w-md mx-auto leading-relaxed">
                  Recovery is not the absence of training. It is the completion of it.
                  <br /><br />
                  Eat your protein, sleep 8 hours, let the marble set.
                </p>

                {/* Rest day protocols from science_notes */}
                {activeDayData.science_notes?.length > 0 && (
                  <div className="mt-8 max-w-lg mx-auto text-left border-t border-border pt-6 space-y-3">
                    {activeDayData.science_notes.map((note, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="font-mono text-[8px] text-gold-dim mt-0.5 shrink-0">
                          {['I', 'II', 'III', 'IV'][i]}
                        </span>
                        <div>
                          <span className="font-mono text-[8px] tracking-[2px] text-gold-dim uppercase">
                            {note.label}
                          </span>
                          <p className="text-xs text-cream-dim mt-0.5 leading-relaxed">{note.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Science bar */}
                {activeDayData.science_notes?.length > 0 && (
                  <div className="flex flex-col sm:flex-row border border-border border-l-2 border-l-gold-dim bg-stone-850 mb-6 divide-y sm:divide-y-0 sm:divide-x divide-border">
                    {activeDayData.science_notes.map((note, i) => (
                      <div key={i} className="flex-1 px-4 py-2.5">
                        <div className="font-mono text-[7px] tracking-[2px] text-gold-dim uppercase mb-0.5">
                          {note.label}
                        </div>
                        <div className="text-[11px] text-cream-dim font-light tracking-wide">
                          {note.text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Session controls */}
                <div className="flex items-center justify-between mb-4">
                  {!session ? (
                    <button
                      onClick={startSession}
                      className="font-display text-[11px] tracking-[4px] uppercase py-2.5 px-5 bg-gold/10 border border-gold-dim text-gold hover:bg-gold/20 transition-colors"
                    >
                      Start Workout
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-[9px] tracking-[2px] uppercase ${session.completed ? 'text-legs' : 'text-gold'}`}>
                        {session.completed ? '✓ Completed' : '● Active Session'}
                      </span>
                      {!session.completed && (
                        <button
                          onClick={completeSession}
                          className="font-mono text-[8px] tracking-[2px] text-legs border border-legs/40 px-2 py-1 hover:bg-legs/10 transition-colors uppercase"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  )}

                  {session && (
                    <ExportButton
                      dayData={{ ...activeDayData, program_exercises: exercises }}
                      session={session}
                      setLogs={setLogs}
                      exerciseNotes={exerciseNotes}
                    />
                  )}
                </div>

                {/* Exercise sections */}
                {sections.map((section, si) => (
                  <div key={si}>
                    <div className="flex items-center gap-3 mt-6 mb-3">
                      <span className="font-display text-[10px] tracking-[4px] text-gold uppercase whitespace-nowrap">
                        {section.name}
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-border-light to-transparent" />
                      {section.range && (
                        <span className="font-mono text-[9px] text-cream-dim">{section.range}</span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {section.exercises.map((ex, ei) => (
                        <ExerciseCard
                          key={ex.id}
                          exercise={ex}
                          index={exercises.indexOf(ex)}
                          setLogs={setLogs.filter((s) => s.exercise_id === ex.id)}
                          exerciseNote={exerciseNotes.find((n) => n.exercise_id === ex.id)}
                          onLogSet={handleLogSet}
                          onSaveNote={handleSaveNote}
                          isLogging={!!session && !session.completed}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
