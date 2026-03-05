/**
 * Generates a formatted text export of a workout session
 * designed for pasting into Claude chat for analysis.
 */
export function exportSessionAsText(dayData, session, setLogs, exerciseNotes) {
  const date = new Date(session.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let output = `# PROTOCOL BRAXTON — ${dayData.name}\n`;
  output += `## ${date}\n`;
  output += `### ${dayData.subtitle}\n\n`;

  if (session.notes) {
    output += `**Session Notes:** ${session.notes}\n\n`;
  }

  if (session.duration_minutes) {
    output += `**Duration:** ${session.duration_minutes} min\n\n`;
  }

  // Group exercises by section
  const exercises = dayData.program_exercises || [];
  let currentSection = '';

  for (const exercise of exercises) {
    if (exercise.section_name !== currentSection) {
      currentSection = exercise.section_name;
      output += `---\n### ${currentSection}\n\n`;
    }

    const exLogs = setLogs.filter((s) => s.exercise_id === exercise.id);
    const exNote = exerciseNotes.find((n) => n.exercise_id === exercise.id);

    output += `**${exercise.name}** (Prescribed: ${exercise.sets_prescribed} × ${exercise.reps_prescribed})\n`;
    output += `Target: ${exercise.targets}\n`;

    if (exLogs.length > 0) {
      output += `| Set | Weight (lbs) | Reps | RIR | RPE | Notes |\n`;
      output += `|-----|-------------|------|-----|-----|-------|\n`;
      for (const set of exLogs.sort((a, b) => a.set_number - b.set_number)) {
        output += `| ${set.set_number} | ${set.weight_lbs ?? '—'} | ${set.reps ?? '—'} | ${set.rir ?? '—'} | ${set.rpe ?? '—'} | ${set.notes || '—'} |\n`;
      }
    } else {
      output += `*No sets logged*\n`;
    }

    if (exNote?.notes) {
      output += `\n**Exercise Notes:** ${exNote.notes}\n`;
    }

    output += `\n`;
  }

  output += `---\n*Exported from Protocol Braxton*\n`;

  return output;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  }
}
