import { createServerSupabase } from '@/lib/supabase-server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'Claude API key not configured. Add ANTHROPIC_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    const supabase = createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages } = await request.json();

    // ─── BUILD CONTEXT ───────────────────────────────────────
    // 1. Fetch program definition
    const { data: programs } = await supabase
      .from('programs')
      .select('*, program_days(*, program_exercises(*))')
      .or(`is_template.eq.true,user_id.eq.${user.id}`)
      .limit(1);

    const program = programs?.[0];

    // 2. Fetch all workout sessions with logs
    const { data: sessions } = await supabase
      .from('workout_sessions')
      .select(`
        *,
        program_day:program_days(name, day_type),
        set_logs(*),
        exercise_notes(*)
      `)
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(90); // Last ~3 months

    // 3. Build program context string
    let programContext = '';
    if (program) {
      programContext = `## Current Program: ${program.name}\n`;
      programContext += `${program.description}\n`;
      const meta = program.meta || {};
      programContext += `Start Weight: ${meta.start_weight}lbs | Target: ${meta.target_weight}lbs | Body Fat: ${meta.body_fat}% | Calories: ${meta.daily_calories}/day | Split: ${meta.split}\n\n`;

      for (const day of (program.program_days || []).sort((a, b) => a.sort_order - b.sort_order)) {
        programContext += `### ${day.name} (${day.subtitle})\n`;
        for (const ex of (day.program_exercises || []).sort((a, b) => a.sort_order - b.sort_order)) {
          programContext += `- ${ex.name}: ${ex.sets_prescribed}×${ex.reps_prescribed} | ${ex.targets}`;
          if (ex.rir != null) programContext += ` | ${ex.rir} RIR`;
          if (ex.rest_seconds) programContext += ` | ${ex.rest_seconds}s rest`;
          programContext += '\n';
        }
        programContext += '\n';
      }
    }

    // 4. Build training log context
    let logContext = '';
    if (sessions?.length > 0) {
      logContext = '## Training History (most recent first)\n\n';
      for (const s of sessions) {
        logContext += `### ${s.date} — ${s.program_day?.name || 'Unknown'} ${s.completed ? '(Completed)' : '(Incomplete)'}\n`;
        if (s.notes) logContext += `Session notes: ${s.notes}\n`;

        const logsByExercise = {};
        for (const log of (s.set_logs || [])) {
          if (!logsByExercise[log.exercise_id]) logsByExercise[log.exercise_id] = [];
          logsByExercise[log.exercise_id].push(log);
        }

        for (const [exId, logs] of Object.entries(logsByExercise)) {
          const sorted = logs.sort((a, b) => a.set_number - b.set_number);
          const exNote = s.exercise_notes?.find((n) => n.exercise_id === exId);
          // We don't have the exercise name in set_logs, so show what we can
          logContext += `Exercise (${sorted.length} sets): `;
          logContext += sorted.map((l) =>
            `${l.weight_lbs ?? '?'}lbs×${l.reps ?? '?'}${l.rir != null ? `@${l.rir}RIR` : ''}`
          ).join(' | ');
          if (exNote?.notes) logContext += ` — Notes: ${exNote.notes}`;
          logContext += '\n';
        }
        logContext += '\n';
      }
    }

    // 5. System prompt
    const systemPrompt = `You are the Protocol Braxton training assistant — an expert strength coach, exercise scientist, and combat conditioning advisor. You have deep knowledge of hypertrophy training (Israetel, Poliquin, Meadows, Schoenfeld), Muay Thai preparation, and nutrition for lean muscle gain.

The user you're advising is Braxton. Here is his full program and training data:

${programContext}

${logContext}

## Your Role:
- Analyze training data for progressive overload trends
- Identify stalling lifts and suggest adjustments
- Recommend form corrections based on exercise notes
- Evaluate volume and recovery balance
- Suggest deload timing when needed
- Connect strength training to Muay Thai/BJJ preparation goals
- Be direct, precise, and actionable. No fluff. Championship standard.

Always reference specific data from the logs when making recommendations. If data is insufficient, say so clearly.`;

    // 6. Call Claude API
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages,
    });

    const content = response.content
      .map((block) => (block.type === 'text' ? block.text : ''))
      .filter(Boolean)
      .join('\n');

    return Response.json({ content });
  } catch (err) {
    console.error('Chat API error:', err);
    return Response.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
