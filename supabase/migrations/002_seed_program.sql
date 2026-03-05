-- ═══════════════════════════════════════════════════════════════
-- PROTOCOL BRAXTON VI — Program Seed
-- This creates the system template program with all exercises
-- ═══════════════════════════════════════════════════════════════

do $$
declare
  v_program_id uuid;
  v_day_id uuid;
begin

-- ─── CREATE PROGRAM ─────────────────────────────────────────
insert into public.programs (id, user_id, name, description, is_template, meta)
values (
  gen_random_uuid(),
  null,
  'Protocol Braxton — VI',
  'PPL×2 // Championship Standard. 6-day Push/Pull/Legs split with combat conditioning.',
  true,
  '{"split":"PPL×2","target_weight":180,"start_weight":141.8,"body_fat":7.1,"daily_calories":3200,"intensity":"2 RIR","freq_per_muscle":"2x/wk"}'::jsonb
) returning id into v_program_id;

-- ═══════════════════════════════════════════════════════════════
-- DAY 1 — MONDAY — PUSH A: CHEST DOMINANT
-- ═══════════════════════════════════════════════════════════════
insert into public.program_days (id, program_id, day_number, name, subtitle, day_type, tags, duration_minutes, science_notes, sort_order)
values (
  gen_random_uuid(), v_program_id, 1, 'PUSH A',
  'Chest Dominant — Triceps Secondary — Anterior Deltoid',
  'push',
  array['PUSH A','MONDAY','CHEST DOMINANT','~65–80 MIN','POLIQUIN · ISRAETEL · MEADOWS'],
  75,
  '[{"label":"Frequency Source","text":"Schoenfeld 2016 Meta-Analysis — 2× weekly per muscle = superior hypertrophy"},{"label":"Volume Framework","text":"Dr. Mike Israetel — MEV/MAV landmarks for chest (10–22 sets/week)"},{"label":"Technique","text":"John Meadows Mountain Dog — stretch-focused loading for upper chest"}]'::jsonb,
  1
) returning id into v_day_id;

-- Push A exercises
insert into public.program_exercises (day_id, section_name, section_range, name, targets, sets_prescribed, reps_prescribed, rest_seconds, tempo, rir, coach_notes, coach_source, technique_badge, youtube_query, is_primary, sort_order) values
(v_day_id, 'Upper Chest — Primary', '01–02', 'Incline Dumbbell Press', 'Clavicular Head · Anterior Delt · Triceps Long Head', '4', '6–8', 105, '3-1-1-0', 2, 'Set bench 30–45°. Deep stretch at the bottom — elbows travel slightly behind the chest plane to fully recruit the clavicular head. Hold 1 second at stretch, explode up. When you hit 8 reps on all sets with 2 RIR — add 5 lbs next session.', 'Charles Poliquin — "The incline DB is the superior mass builder for the upper chest because it allows shoulder flexion to occur naturally."', 'MEADOWS PROTOCOL', 'incline+dumbbell+press+hypertrophy+form', true, 1),

(v_day_id, 'Upper Chest — Primary', '01–02', 'Hammer Strength Incline Press', 'Upper / Mid Chest · Triceps · Stabiliser Bypass', '3', '10–12', 75, null, 2, 'Hammer Strength bypasses stabiliser fatigue, allowing the chest to be pushed past the point free weights would allow. Slight arch, chest tall. Drive through the pads — squeeze chest toward the midline. Full stretch = full range = full hypertrophy stimulus.', 'Dr. Mike Israetel — Machines at end of compound work allow higher quality sets because stabiliser fatigue does not terminate the set early.', null, 'hammer+strength+incline+chest+press+machine+form', true, 2),

(v_day_id, 'Mid Chest — Isolation', '03–04', 'Cable Fly — Low to High', 'Clavicular Head · Sternal Fibers · Constant Tension', '3', '12–15', 60, null, 2, 'Cables at lowest peg. Arc up toward chin. Cables maintain tension at every degree of the arc — mechanically superior for isolation. Slight forward lean. Fixed elbow bend throughout — not a pressing movement. 2s squeeze at top.', null, null, 'cable+fly+low+to+high+upper+chest+hypertrophy', false, 3),

(v_day_id, 'Mid Chest — Isolation', '03–04', 'Pec Deck Machine Fly', 'Mid Chest · Inner Chest · Peak Contraction', '3', '12–15', 60, null, 1, 'Forearms vertical on pads, elbows never behind shoulder plane. Last set: Myo-Rep method — 12 reps to near-failure, rest 5 deep breaths, 4–5 more reps, repeat 3 times. Squeeze hard at midline — pause 1 second.', null, 'MYO-REPS PROTOCOL (BORGE FAGERLI)', 'pec+deck+fly+machine+proper+form+chest', false, 4),

(v_day_id, 'Shoulders + Triceps — Finishers', '05–07', 'Cable Lateral Raise', 'Medial Deltoid · Shoulder Width · Frame Armor', '4', '15–20', 45, null, 2, 'Cable provides constant tension through entire arc. Slight forward lean. Fixed elbow bend. Raise to shoulder height only — going above reduces deltoid tension. Bilateral or unilateral.', null, null, 'cable+lateral+raise+medial+deltoid+form', false, 5),

(v_day_id, 'Shoulders + Triceps — Finishers', '05–07', 'Tricep Rope Pushdown', 'Lateral Head · Medial Head · Tricep Separation', '3', '12–15', 60, null, 2, 'Elbows pinned to sides — they do not move. Spread the rope outward at the bottom of every rep to maximally contract the lateral head. No body swing. Keep weight honest and execute with precision.', null, null, 'tricep+rope+pushdown+lateral+head+form', false, 6),

(v_day_id, 'Shoulders + Triceps — Finishers', '05–07', 'Overhead Cable Tricep Extension', 'Long Head · Tricep Mass (60% of arm) · Full Stretch', '3', '10–12', 60, null, 2, 'Face away from cable, rope behind neck. Long head can only be fully stretched when arm is overhead. Elbows stay tight to head. Full stretch at the bottom — this is the money position.', 'Maeo et al. 2021 — Lengthened position training produces superior hypertrophy vs shortened position.', null, 'overhead+cable+tricep+extension+long+head', false, 7);


-- ═══════════════════════════════════════════════════════════════
-- DAY 2 — TUESDAY — PULL A: BACK WIDTH
-- ═══════════════════════════════════════════════════════════════
insert into public.program_days (id, program_id, day_number, name, subtitle, day_type, tags, duration_minutes, science_notes, sort_order)
values (
  gen_random_uuid(), v_program_id, 2, 'PULL A',
  'Back Width Dominant — Lat Mass — Biceps Peak',
  'pull',
  array['PULL A','TUESDAY','VERTICAL PULL FOCUS','~65–75 MIN','ISRAETEL · GLASS · POLIQUIN'],
  70,
  '[{"label":"V-Taper Science","text":"Lat width + taper = the defining silhouette — prioritized over all other back work"},{"label":"Arm Peak","text":"Incline curl at full stretch maximally recruits bicep long head (Marcolin 2018)"},{"label":"Grip Transfer","text":"Brachialis/hammer curl = grip strength, arm thickness, clinch power"}]'::jsonb,
  2
) returning id into v_day_id;

insert into public.program_exercises (day_id, section_name, section_range, name, targets, sets_prescribed, reps_prescribed, rest_seconds, tempo, rir, coach_notes, coach_source, technique_badge, youtube_query, is_primary, sort_order) values
(v_day_id, 'Lat Width — Vertical Pull', '01–02', 'Wide Grip Lat Pulldown', 'Latissimus Dorsi · Teres Major · Rear Delt · Biceps', '4', '8–10', 90, null, 2, 'Slight lean back ~15°. Arms fully extended at top — dead-hang stretch. Pull bar to upper chest, leading with elbows downward. Full arm extension at top is non-negotiable for maximum lat length development.', 'Charles Glass — 40+ years coaching IFBB pros. Prioritizes full ROM over load.', 'ELBOWS TO BACK POCKETS', 'lat+pulldown+wide+grip+full+stretch+hypertrophy', true, 1),

(v_day_id, 'Lat Width — Vertical Pull', '01–02', 'Straight-Arm Cable Pulldown', 'Latissimus Dorsi · Serratus Anterior · Pure Lat Isolation', '3', '12–15', 60, null, 2, 'Cable set high, slight hip hinge. Arms straight with micro-bend in elbows. Zero bicep involvement — lat does 100% of work. Builds mind-muscle connection required for all other back work.', null, null, 'straight+arm+cable+pulldown+lat+isolation', false, 2),

(v_day_id, 'Mid Back — Horizontal Pull', '03–04', 'Single-Arm Dumbbell Row', 'Lower Lats · Rhomboids · Rear Delt · Full Range Load', '4', '10–12', 75, null, 2, 'Pull elbow toward hip — not toward ceiling. Elbow toward ceiling targets rear delt/traps; elbow toward hip targets lower lat. Full stretch at bottom, full contraction at top. Load heavier than you think.', 'Dorian Yates — "The lower lat sweep is what makes a back look like a cobra hood. Row to your hip, not your chest."', 'DORIAN YATES PROTOCOL', 'single+arm+dumbbell+row+lower+lat', true, 3),

(v_day_id, 'Mid Back — Horizontal Pull', '03–04', 'Seated Cable Row (V-Handle)', 'Rhomboids · Mid Traps · Lower Lats · Scapular Retraction', '3', '12', 75, null, 2, 'Chest proud, no spinal flexion on eccentric. Row handle to lower abs. Squeeze shoulder blades together at peak — hold 1 second. Controlled return until arms fully extended.', null, null, 'seated+cable+row+proper+form+back+thickness', false, 4),

(v_day_id, 'Biceps — Peak + Thickness', '05–07', 'EZ Bar Curl', 'Biceps Brachii · Brachialis · Primary Mass Builder', '4', '8–10', 90, '3-0-1-1', 2, 'Grip inner bends of EZ bar. Elbows stationary at sides. Curl fully to chin height. 3-second controlled negative — this is where 60% of growth stimulus occurs. Full extension at bottom.', 'Charles Poliquin — Prescribed 3–5 second negatives for biceps due to high Type IIb fiber concentration.', null, 'EZ+bar+curl+form+bicep+mass+builder', true, 5),

(v_day_id, 'Biceps — Peak + Thickness', '05–07', 'Incline Dumbbell Curl', 'Bicep Long Head · Peak Height · Full Stretch Position', '3', '10–12', 60, null, 2, 'Set bench 45–60°. Arms hang fully below torso — dead-hang every rep. Single best exercise for bicep long head (peak) development. Go lighter than you think — the stretch position is humbling.', 'Marcolin et al. (2018) — Incline curl produces significantly superior long head activation.', null, 'incline+dumbbell+curl+long+head+bicep+peak', false, 6),

(v_day_id, 'Biceps — Peak + Thickness', '05–07', 'Alternating Hammer Curl', 'Brachialis · Brachioradialis · Arm Thickness · Grip', '3', '12', 60, null, 2, 'Neutral grip (thumbs up), arms alternating. Brachialis sits beneath bicep and pushes it upward when developed. Builds grip strength for clinch work.', null, null, 'alternating+hammer+curl+brachialis+thickness', false, 7);


-- ═══════════════════════════════════════════════════════════════
-- DAY 3 — WEDNESDAY — LEGS A: QUAD DOMINANT
-- ═══════════════════════════════════════════════════════════════
insert into public.program_days (id, program_id, day_number, name, subtitle, day_type, tags, duration_minutes, science_notes, sort_order)
values (
  gen_random_uuid(), v_program_id, 3, 'LEGS A',
  'Quad Dominant — Knee Extension Focus — Calf Thickness',
  'legs',
  array['LEGS A','WEDNESDAY','QUAD DOMINANT','PT SOME WEDNESDAYS','~70 MIN'],
  70,
  '[{"label":"Greek Ideal","text":"Quad sweep + teardrop VMO + visible hamstring tie-in = the leg structure carved in marble"},{"label":"Combat Transfer","text":"Quad strength = kick power, stance stability, and takedown defense base"},{"label":"DOMS Management","text":"Wednesday legs = 48h recovery before Friday back day. Saturday hits hamstrings."}]'::jsonb,
  3
) returning id into v_day_id;

insert into public.program_exercises (day_id, section_name, section_range, name, targets, sets_prescribed, reps_prescribed, rest_seconds, tempo, rir, coach_notes, coach_source, technique_badge, youtube_query, is_primary, sort_order) values
(v_day_id, 'Quad — Compound', '01–03', 'Leg Press — Shoulder Width', 'Quadriceps · Glutes · Vastus Lateralis · Mass Builder', '4', '10–12', 120, null, 2, 'Feet shoulder-width, mid-plate height. Lower until knees near chest — maximum range. Do not lock knees at top. Do not let lower back peel off pad at bottom. Load heavy — primary quad mass builder.', null, null, 'leg+press+proper+form+full+range+quad+hypertrophy', true, 1),

(v_day_id, 'Quad — Compound', '01–03', 'Leg Extension', 'Rectus Femoris · VMO · Quad Isolation · Teardrop', '4', '15', 60, null, 1, 'Point toes slightly outward (10–15°) to bias VMO — the teardrop muscle above the knee. Hold 2 seconds at full extension for isometric peak contraction. Slow controlled negative.', null, 'VMO ACTIVATION — TOES OUT', 'leg+extension+proper+form+VMO+teardrop', false, 2),

(v_day_id, 'Quad — Compound', '01–03', 'Bulgarian Split Squat (DB)', 'Quad Sweep · Glute Max · Single-Leg Stability · Balance', '3', '10/leg', 90, null, 2, 'Rear foot elevated on bench. Torso upright for quad focus. Lower until front thigh parallel or below. Start lighter than expected — harder than it looks.', null, null, 'Bulgarian+split+squat+dumbbell+form+quad', false, 3),

(v_day_id, 'Hamstring / Posterior Supplemental', '04', 'Seated Leg Curl', 'Biceps Femoris · Semimembranosus · Hamstring Tie-In', '3', '12–15', 75, null, 2, 'Seated curl places hamstring under greater stretch than lying version. Slow negative — 3 seconds down. This is your DOMS-producer on Wednesday.', 'Maeo et al. (2021) — Seated leg curl produces 15–20% greater hamstring hypertrophy vs lying curl.', null, 'seated+leg+curl+machine+form+hamstring', false, 4),

(v_day_id, 'Calves — Thickness + Height', '05–06', 'Standing Calf Raise', 'Gastrocnemius · Calf Height · Explosive Ankle Power', '4', '15–20', 45, null, 1, 'Full stretch at bottom is mandatory. Rise to full peak contraction, hold 1 second. Gastrocnemius (knee extended) = calf height and definition.', null, null, 'standing+calf+raise+gastrocnemius+full+stretch', false, 5),

(v_day_id, 'Calves — Thickness + Height', '05–06', 'Seated Calf Raise', 'Soleus · Calf Thickness · Ankle Stability', '3', '20', 45, null, 1, 'Knee bent 90° isolates soleus — the deeper, thicker calf muscle. Full range — heel all the way down, peak contraction at top.', null, null, 'seated+calf+raise+soleus+form+hypertrophy', false, 6);


-- ═══════════════════════════════════════════════════════════════
-- DAY 4 — THURSDAY — PUSH B: SHOULDER DOMINANT
-- ═══════════════════════════════════════════════════════════════
insert into public.program_days (id, program_id, day_number, name, subtitle, day_type, tags, duration_minutes, science_notes, sort_order)
values (
  gen_random_uuid(), v_program_id, 4, 'PUSH B',
  'Shoulder Dominant — 3D Boulder Delts — Chest + Triceps Secondary',
  'push',
  array['PUSH B','THURSDAY','DELTOID PRIORITY','~65–75 MIN','CRESSEY · THIBAUDEAU · MEADOWS'],
  70,
  '[{"label":"3D Delt Science","text":"Anterior + Medial + Rear delt = full deltoid development. Most programs train 2 of 3."},{"label":"Shoulder Health","text":"Eric Cressey — External rotation (face pulls) is structural armor."},{"label":"Arnold Principle","text":"Arnold Press rotates through full shoulder arc — recruiting more fibers than fixed overhead press."}]'::jsonb,
  4
) returning id into v_day_id;

insert into public.program_exercises (day_id, section_name, section_range, name, targets, sets_prescribed, reps_prescribed, rest_seconds, tempo, rir, coach_notes, coach_source, technique_badge, youtube_query, is_primary, sort_order) values
(v_day_id, 'Overhead Press — Compound', '01–02', 'Seated Dumbbell Overhead Press', 'Anterior Delt · Medial Delt · Upper Traps · Triceps', '4', '8–12', 90, null, 2, 'Back supported. Start at ear height. Press overhead with slight natural inward arc at top. Don''t lock elbows. Shoulder strength built here is direct transfer to punching power.', null, null, 'seated+dumbbell+overhead+press+shoulder+hypertrophy', true, 1),

(v_day_id, 'Overhead Press — Compound', '01–02', 'Arnold Press', 'Full Deltoid Arc · Anterior Emphasis · Rotational Fiber Recruitment', '3', '10–12', 75, null, 2, 'Start palms facing you, rotate as you press until palms face forward at top. Rotational path recruits deltoid fibers across a broader angle. Slightly lighter than standard press.', 'Arnold Schwarzenegger — "The rotation recruits every fiber in the shoulder across the full range."', 'ARNOLD SCHWARZENEGGER SIGNATURE', 'Arnold+press+dumbbell+proper+form+full+rotation', false, 2),

(v_day_id, 'Medial + Rear Delt — Width and Armor', '03–04', 'Cable Lateral Raise (Unilateral)', 'Medial Deltoid · Shoulder Width · Visual Frame Expansion', '4', '15–20', 45, null, 2, 'Pull cable from behind body (cross-body) — different tension angle and greater stretch at bottom of medial delt. Raise to shoulder height, slight forward lean, elbow fixed.', null, null, 'unilateral+cable+lateral+raise+behind+back+medial', true, 3),

(v_day_id, 'Medial + Rear Delt — Width and Armor', '03–04', 'Cable Face Pull', 'Rear Delt · External Rotators · Rotator Cuff · Posture', '3', '20', 45, null, 1, 'Rope at eye height. Pull to face with elbows flared high. Hold 1 second. Never skip this — protects shoulder joint from impingement. Every session.', 'Eric Cressey — "If I could only prescribe one exercise for shoulder health in combat athletes, it would be face pulls with external rotation."', null, 'cable+face+pull+rear+delt+external+rotation', false, 4),

(v_day_id, 'Chest Secondary + Triceps', '05–08', 'Incline DB Press (30°)', 'Upper-Mid Chest Crossover · Different Fiber Angle vs Day A', '3', '10–12', 75, null, 2, 'Monday was 45°; this is 30°. Different angle hits the upper-mid chest fiber crossover zone. Varied mechanical loading across the week recruits overlapping fiber populations.', null, null, 'low+incline+dumbbell+press+30+degree+chest', false, 5),

(v_day_id, 'Chest Secondary + Triceps', '05–08', 'Cable Fly — High to Low', 'Sternal Head · Mid-Lower Chest · Chest Separation', '3', '12–15', 60, null, 2, 'Cables at highest peg. Arc downward toward navel. Hits sternal head — lower/outer fibers creating chest separation line. Combined with Monday low-to-high: full 360° fiber coverage.', null, null, 'cable+fly+high+to+low+lower+chest+sternal', false, 6),

(v_day_id, 'Chest Secondary + Triceps', '05–08', 'Skull Crushers (EZ Bar)', 'Tricep Long Head · Medial Head · Elbow Mass', '4', '8–10', 90, null, 2, 'Lower bar to forehead or slightly behind crown. Elbows angled 10–15° behind vertical. Never ego load skull crushers. Slow and controlled. Primary tricep mass movement.', null, null, 'skull+crushers+EZ+bar+proper+form+long+head', false, 7),

(v_day_id, 'Chest Secondary + Triceps', '05–08', 'Tricep Dips (Bench / Parallel Bars)', 'All 3 Tricep Heads · Bodyweight Overload · Finisher', '3', '12–15', 60, null, 2, 'Torso upright — leaning forward shifts to chest. Elbows travel straight back, not flaring. Lower to 90° at elbow. Add weight once bodyweight is easy for 15 reps with solid form.', null, null, 'tricep+dips+proper+form+upright+torso', false, 8);


-- ═══════════════════════════════════════════════════════════════
-- DAY 5 — FRIDAY — PULL B: BACK THICKNESS
-- ═══════════════════════════════════════════════════════════════
insert into public.program_days (id, program_id, day_number, name, subtitle, day_type, tags, duration_minutes, science_notes, sort_order)
values (
  gen_random_uuid(), v_program_id, 5, 'PULL B',
  'Back Thickness Dominant — Horizontal Pull Priority — Rear Delts — Biceps Volume',
  'pull',
  array['PULL B','FRIDAY','BACK THICKNESS','~65–75 MIN','YATES · GLASS · RP STRENGTH'],
  70,
  '[{"label":"Thickness vs Width","text":"Pull A = lat width (vertical pulls). Pull B = back thickness (horizontal pulls + rhomboids + mid traps)."},{"label":"Rear Delt 3D Look","text":"Rear delt development creates boulder shoulder from the side. Neglected by 90% of lifters."},{"label":"Bicep Variation","text":"Concentration curl (Arnold peak builder) + cable curl for constant tension = complete bicep stimulus"}]'::jsonb,
  5
) returning id into v_day_id;

insert into public.program_exercises (day_id, section_name, section_range, name, targets, sets_prescribed, reps_prescribed, rest_seconds, tempo, rir, coach_notes, coach_source, technique_badge, youtube_query, is_primary, sort_order) values
(v_day_id, 'Back Thickness — Horizontal Pulls', '01–03', 'Hammer Strength Row', 'Lower Lats · Rhomboids · Rear Delt · Unilateral Strength', '4', '10–12', 75, null, 2, 'Chest on pad. Elbows at 30–45° from torso. Pull to hip level. Independent arm path allows each side to work through full range. Let plates travel far forward for full lat stretch.', null, null, 'hammer+strength+row+machine+proper+form+lower+lat', true, 1),

(v_day_id, 'Back Thickness — Horizontal Pulls', '01–03', 'Chest-Supported T-Bar Row', 'Mid Traps · Rhomboids · Lats · Heavy Load without Spinal Risk', '4', '8–10', 90, null, 2, 'Chest supported removes lower back entirely — back muscles work to true failure without spinal fatigue. Squeeze shoulder blades together at peak and hold 1 second.', 'Dorian Yates — "The chest-supported row was central to my training."', null, 'chest+supported+T+bar+row+form+back+thickness', true, 2),

(v_day_id, 'Back Thickness — Horizontal Pulls', '01–03', 'Underhand Grip Cable Row', 'Lower Lats · Biceps Involvement · Different Elbow Path', '3', '12', 60, null, 2, 'Supinated grip causes elbows to naturally track along sides of torso — different lat fiber recruitment pattern. Hits lower lat attachment more directly. Volume accumulation movement.', null, null, 'underhand+grip+cable+row+lower+lat+form', false, 3),

(v_day_id, 'Rear Deltoid + Upper Back', '04–05', 'Rear Delt Cable Fly / Pec Deck Reverse', 'Posterior Deltoid · Infraspinatus · 3D Shoulder Depth', '4', '15–20', 45, null, 1, 'Cables crossed at head height, pulling out and back — or reverse pec deck. Arms stay roughly parallel to floor. Rear delt determines whether shoulders look 3D from the side.', null, null, 'rear+delt+cable+fly+reverse+pec+deck+form', false, 4),

(v_day_id, 'Rear Deltoid + Upper Back', '04–05', 'Dumbbell Shrug', 'Upper Traps · Neck Base · Structural Intimidation', '3', '12–15', 45, null, 2, 'Straight up — no rolling shoulders forward or back. Shrug straight up and hold 2 seconds at peak. Thick upper traps protect the cervical spine during strikes.', null, null, 'dumbbell+shrug+upper+trap+form+hold+peak', false, 5),

(v_day_id, 'Biceps — Volume Accumulation', '06–07', 'Concentration Curl', 'Bicep Peak · Short Head + Long Head · Peak Builder', '3', '12–15', 60, null, 1, 'Elbow braced against inner knee, upper arm vertical. Curl fully and supinate (turn pinky up) at top — maximally activates short head. Eliminates all momentum.', 'Arnold Schwarzenegger — "Concentration curls gave me that mountain peak."', 'ARNOLD PEAK-BUILDER', 'concentration+curl+Arnold+form+bicep+peak', false, 6),

(v_day_id, 'Biceps — Volume Accumulation', '06–07', 'Cable Curl (Straight Bar)', 'Biceps · Constant Tension · Full ROM Volume', '3', '12–15', 45, null, 1, 'Cable maintains tension at bottom of curl — dumbbells have zero tension there. Last set use Myo-Reps: 15 reps to near-failure, 5 breaths, 5 reps, repeat ×3.', null, 'MYO-REPS FINAL SET', 'cable+curl+straight+bar+constant+tension+bicep', false, 7);


-- ═══════════════════════════════════════════════════════════════
-- DAY 6 — SATURDAY — LEGS B + COMBAT CONDITIONING
-- ═══════════════════════════════════════════════════════════════
insert into public.program_days (id, program_id, day_number, name, subtitle, day_type, tags, duration_minutes, science_notes, sort_order)
values (
  gen_random_uuid(), v_program_id, 6, 'LEGS B + COMBAT',
  'Hamstring Dominant — Posterior Chain — Core — Combat Conditioning',
  'legs',
  array['LEGS B','COMBAT PREP','SATURDAY','~90 MIN','POLIQUIN · MEADOWS · MUAY THAI SCIENCE'],
  90,
  '[{"label":"Hamstring Hypertrophy","text":"Hip-hinge dominant RDL at lengthened position = greatest hamstring stimulus (Maeo et al. 2021)"},{"label":"Core for Combat","text":"Anti-rotation + compression core = absorbs body shots, transfers rotational power to strikes"},{"label":"Phase 2 Foundation","text":"Jump rope + shadowboxing = footwork, rhythm, striking patterns built 4 months before combat class"}]'::jsonb,
  6
) returning id into v_day_id;

insert into public.program_exercises (day_id, section_name, section_range, name, targets, sets_prescribed, reps_prescribed, rest_seconds, tempo, rir, coach_notes, coach_source, technique_badge, youtube_query, is_primary, sort_order) values
(v_day_id, 'Posterior Chain — Hamstring Dominant', '01–04', 'Romanian Deadlift', 'Biceps Femoris · Glute Max · Erectors · Hamstring Tie-In', '4', '8–10', 120, null, 2, 'Hips push back — not down. Spine neutral throughout. Bar stays close to body. Lower until deep hamstring stretch (typically mid-shin). Drive hips forward to return. King of hamstring and glute development.', 'Charles Poliquin — "The RDL is superior to any machine for building the hamstring-to-glute tie-in."', 'PRIMARY POSTERIOR CHAIN BUILDER', 'Romanian+deadlift+proper+form+hamstring+hypertrophy', true, 1),

(v_day_id, 'Posterior Chain — Hamstring Dominant', '01–04', 'Seated Leg Curl', 'Biceps Femoris · Semimembranosus · Lengthened Stimulus', '4', '10–12', 75, null, 2, 'Seated leg curl is to hamstrings what incline DB curl is to biceps — hip-flexed position creates maximal stretch. 3-second controlled eccentric on every rep. Controlled negative is the stimulus.', 'Maeo et al. (2021) — Training in lengthened range significantly increased distal hamstring hypertrophy.', null, 'seated+leg+curl+lengthened+hamstring+stimulus', true, 2),

(v_day_id, 'Posterior Chain — Hamstring Dominant', '01–04', 'Leg Press — Feet High and Wide', 'Glutes · Hamstring Tie-In · Inner Quad · Hip Drive', '3', '12–15', 90, null, 2, 'Wednesday was shoulder-width mid-plate (quad focus). Today: feet high on platform and wider. Changes the lever arm — greater hip and glute recruitment. Same machine, different stimulus.', null, null, 'leg+press+feet+high+wide+glute+hamstring', false, 3),

(v_day_id, 'Posterior Chain — Hamstring Dominant', '01–04', 'Walking Lunges (DB)', 'Glutes · Quads · Hip Flexor Mobility · Unilateral Balance', '3', '12/leg', 90, null, 2, 'Long stride — front shin vertical, deep enough that back knee nearly touches ground. Builds hip flexor mobility and single-leg balance for combat stance.', null, null, 'walking+lunges+dumbbell+proper+form+glute+quad', false, 4),

(v_day_id, 'Calves — Second Session', '05', 'Seated Calf Raise', 'Soleus · Calf Depth · Ankle Stability for Combat', '4', '20', 45, null, 1, 'Wednesday was standing (gastrocnemius). Saturday is seated (soleus). Both calf muscles trained twice per week with different exercises ensures complete development.', null, null, 'seated+calf+raise+soleus+form+full+range', false, 5),

(v_day_id, 'Core — Combat Architecture', '06–08', 'Ab Wheel Rollout', 'Rectus Abdominis · Obliques · Anti-Extension Core', '3', '8–12', 60, null, 2, 'Most demanding anti-extension core exercise. Roll out until arms nearly fully extended. Pull back with abs. Trains core in exact position it must resist during a Muay Thai punch.', null, null, 'ab+wheel+rollout+proper+form+core+anti+extension', false, 6),

(v_day_id, 'Core — Combat Architecture', '06–08', 'Hanging Leg Raise', 'Lower Abs · Hip Flexors · Core Compression · Grip', '3', '12–15', 60, null, 2, 'Use any overhead bar. No swinging. Initiate by tilting pelvis and curling lower abs first. Trained lower abdomen allows absorbing body shots.', null, null, 'hanging+leg+raise+lower+abs+proper+form', false, 7),

(v_day_id, 'Core — Combat Architecture', '06–08', 'Weighted Russian Twist', 'Obliques · Rotational Power · Punch + Kick Force Generation', '3', '20', 45, null, 1, 'Use 15–25 lb plate. Feet elevated, torso at 45°. Rotate fully side-to-side. Obliques are the rotational engine of every punch, kick, and throw.', null, null, 'weighted+russian+twist+obliques+rotational+power', false, 8),

(v_day_id, 'Combat Conditioning — Phase 2 Foundation', '09–10', 'Jump Rope', 'Footwork · Rhythm · Cardio Base · Calf Endurance · Coordination', '5', '2 min', 60, null, null, 'Start with basic two-foot bounce. Progress to boxer skip. Every Muay Thai gym starts with jump rope. If fluent when you arrive, you immediately absorb technique instead of learning the rope.', null, null, 'jump+rope+boxer+skip+Muay+Thai+footwork+beginner', false, 9),

(v_day_id, 'Combat Conditioning — Phase 2 Foundation', '09–10', 'Shadowboxing', 'Muay Thai Stance · Guard Position · Jab-Cross · Footwork', '3', '3 min', 60, null, null, 'Muay Thai stance: turned sideways, weight on balls of both feet, guard elbows protecting ribs, chin tucked. Practice jab-cross combinations with movement. Pattern, not power.', null, null, 'Muay+Thai+shadowboxing+beginner+stance+guard+jab+cross', false, 10);


-- ═══════════════════════════════════════════════════════════════
-- DAY 7 — SUNDAY — REST
-- ═══════════════════════════════════════════════════════════════
insert into public.program_days (program_id, day_number, name, subtitle, day_type, tags, duration_minutes, science_notes, sort_order)
values (
  v_program_id, 7, 'REST',
  'Recovery is not the absence of training. It is the completion of it.',
  'rest',
  array['REST','SUNDAY','RECOVERY','SLEEP 8–9H'],
  0,
  '[{"label":"Sleep","text":"GH secreted in pulses during deep sleep. Athletes sleeping under 7h gained 40% less muscle over 12 weeks."},{"label":"Nutrition","text":"Hit protein target (1g/lb) and calorie target (3,000–3,200 kcal) even on rest days."},{"label":"Supplements","text":"Continue Thorne creatine and Doctor Best magnesium glycinate. Creatine saturation requires daily loading."},{"label":"Mobility","text":"15 minutes of hip flexor and thoracic stretching improves Monday readiness."}]'::jsonb,
  7
);

end $$;
