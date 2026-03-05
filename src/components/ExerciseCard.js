'use client';

import { useState } from 'react';

export default function ExerciseCard({ exercise, index, setLogs = [], exerciseNote, onLogSet, onSaveNote, isLogging }) {
  const [expanded, setExpanded] = useState(false);
  const [noteText, setNoteText] = useState(exerciseNote?.notes || '');
  const [noteChanged, setNoteChanged] = useState(false);

  const prescribedSets = parseInt(exercise.sets_prescribed) || 3;
  const setsLogged = setLogs.length;

  return (
    <div className={`
      border border-border bg-stone-850 transition-all group
      ${exercise.is_primary ? 'border-l-2 border-l-gold' : 'border-l-2 border-l-border'}
    `}>
      {/* Main row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-start gap-3"
      >
        {/* Index */}
        <span className="font-mono text-[10px] text-iron mt-0.5 shrink-0 w-6">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Title + targets */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-[13px] font-semibold tracking-[1.5px] text-cream uppercase leading-tight">
            {exercise.name}
          </h3>
          <p className="font-mono text-[8px] tracking-[1px] text-iron mt-1 uppercase">
            {exercise.targets}
          </p>
        </div>

        {/* Prescription */}
        <div className="text-right shrink-0">
          <div className="font-display text-lg text-gold leading-none tracking-wide">
            {exercise.sets_prescribed} × {exercise.reps_prescribed}
          </div>
          <div className="font-mono text-[7px] text-iron tracking-[1px] mt-1 leading-relaxed">
            {exercise.rir != null && `${exercise.rir} RIR · `}
            {exercise.rest_seconds && `${exercise.rest_seconds}s REST`}
            {exercise.tempo && <><br />{`TEMPO ${exercise.tempo}`}</>}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="shrink-0 flex flex-col items-center gap-0.5 ml-1">
          {Array.from({ length: prescribedSets }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${i < setsLogged ? 'bg-gold' : 'bg-border'}`}
            />
          ))}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-border animate-fade-in">
          {/* Technique badge */}
          {exercise.technique_badge && (
            <div className="px-4 pt-3">
              <span className="inline-block font-mono text-[7px] tracking-[2px] text-gold border border-gold-dim/50 px-2 py-0.5 bg-gold-faint uppercase">
                {exercise.technique_badge}
              </span>
            </div>
          )}

          {/* Coach notes */}
          {exercise.coach_notes && (
            <div className="px-4 pt-3 pb-2">
              <p className="text-sm text-cream-dim leading-relaxed font-light">
                {exercise.coach_notes}
              </p>
              {exercise.coach_source && (
                <p className="font-mono text-[7px] tracking-[2px] text-gold-dim uppercase mt-2">
                  {exercise.coach_source}
                </p>
              )}
            </div>
          )}

          {/* YouTube link */}
          {exercise.youtube_query && (
            <div className="px-4 pb-3">
              <a
                href={`https://www.youtube.com/results?search_query=${exercise.youtube_query}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-[8px] tracking-[2px] text-iron hover:text-cream border border-border px-2.5 py-1.5 transition-colors uppercase"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#e62b2b">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
                Watch Form
              </a>
            </div>
          )}

          {/* Set logging area */}
          {isLogging && (
            <div className="border-t border-border px-4 py-3">
              <div className="font-mono text-[8px] tracking-[2px] text-iron uppercase mb-2">
                Log Sets
              </div>

              {/* Existing logged sets */}
              {setLogs.length > 0 && (
                <div className="mb-2 space-y-1">
                  {setLogs
                    .sort((a, b) => a.set_number - b.set_number)
                    .map((set) => (
                      <div key={set.id} className="flex items-center gap-2 font-mono text-xs text-cream-dim">
                        <span className="text-iron w-8">S{set.set_number}</span>
                        <span>{set.weight_lbs ?? '—'}lbs</span>
                        <span className="text-iron">×</span>
                        <span>{set.reps ?? '—'}</span>
                        {set.rir != null && <span className="text-gold-dim">@{set.rir}RIR</span>}
                        {set.notes && <span className="text-iron truncate">— {set.notes}</span>}
                      </div>
                    ))}
                </div>
              )}

              {/* New set form */}
              {setsLogged < prescribedSets && (
                <SetForm
                  setNumber={setsLogged + 1}
                  exercise={exercise}
                  onSubmit={onLogSet}
                />
              )}

              {setsLogged >= prescribedSets && (
                <div className="font-mono text-[9px] text-legs tracking-[1px] uppercase">
                  ✓ All sets complete
                </div>
              )}

              {/* Exercise notes */}
              <div className="mt-3 pt-3 border-t border-border/50">
                <textarea
                  placeholder="Exercise notes (form cues, pain, adjustments...)"
                  value={noteText}
                  onChange={(e) => { setNoteText(e.target.value); setNoteChanged(true); }}
                  rows={2}
                  className="w-full text-xs"
                />
                {noteChanged && (
                  <button
                    onClick={() => { onSaveNote(exercise.id, noteText); setNoteChanged(false); }}
                    className="mt-1 font-mono text-[8px] tracking-[2px] text-gold border border-gold-dim/50 px-2 py-1 hover:bg-gold-faint transition-colors uppercase"
                  >
                    Save Note
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SetForm({ setNumber, exercise, onSubmit }) {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rir, setRir] = useState('');
  const [notes, setNotes] = useState('');

  function handleSubmit() {
    if (!weight && !reps) return;
    onSubmit(exercise.id, {
      set_number: setNumber,
      weight_lbs: weight ? parseFloat(weight) : null,
      reps: reps ? parseInt(reps) : null,
      rir: rir !== '' ? parseInt(rir) : null,
      rpe: null,
      notes: notes || null,
    });
    setWeight('');
    setReps('');
    setRir('');
    setNotes('');
  }

  return (
    <div className="flex items-end gap-2 flex-wrap">
      <span className="font-mono text-[10px] text-iron mb-2 w-8">S{setNumber}</span>
      <div>
        <label className="block font-mono text-[7px] text-iron tracking-[1px] mb-0.5">LBS</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-16 text-xs py-1 px-2"
          placeholder="0"
        />
      </div>
      <div>
        <label className="block font-mono text-[7px] text-iron tracking-[1px] mb-0.5">REPS</label>
        <input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="w-14 text-xs py-1 px-2"
          placeholder="0"
        />
      </div>
      <div>
        <label className="block font-mono text-[7px] text-iron tracking-[1px] mb-0.5">RIR</label>
        <input
          type="number"
          value={rir}
          onChange={(e) => setRir(e.target.value)}
          className="w-12 text-xs py-1 px-2"
          placeholder="2"
          min="0"
          max="5"
        />
      </div>
      <div className="flex-1 min-w-[80px]">
        <label className="block font-mono text-[7px] text-iron tracking-[1px] mb-0.5">NOTE</label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full text-xs py-1 px-2"
          placeholder="optional"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="font-mono text-[9px] tracking-[2px] text-obsidian bg-gold hover:bg-gold-bright px-3 py-1.5 transition-colors uppercase font-medium mb-0.5"
      >
        LOG
      </button>
    </div>
  );
}
