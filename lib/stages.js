// A workout compiled to an ordered list of timed stages. Both basic (uniform)
// and advanced (per-rep) workouts run through this — the timer just walks it.

export const STAGE = {
  PREP: 'prep',
  HANG: 'hang',
  REP_REST: 'repRest',
  SET_REST: 'setRest',
};

// A basic workout -> the same { reps:[{hang,rest}], setRest }[] shape as advanced.
export const toAdvancedPlan = (w) =>
  Array.from({ length: Math.max(1, w.sets || 1) }, () => ({
    reps: Array.from({ length: Math.max(1, w.reps || 1) }, () => ({
      hang: w.hangTime ?? 10,
      rest: w.repRest ?? 0,
    })),
    setRest: w.setRest ?? 0,
  }));

// An advanced plan -> basic fields (lossy: takes rep #1 of set #1 and set #1's rest).
export const flattenToBasic = (plan) => {
  const first = plan?.[0];
  const firstRep = first?.reps?.[0] ?? {};
  return {
    sets: Math.max(1, plan?.length || 1),
    reps: Math.max(1, first?.reps?.length || 1),
    hangTime: firstRep.hang ?? 10,
    repRest: firstRep.rest ?? 0,
    setRest: first?.setRest ?? 0,
  };
};

// True when every rep across every set shares the same hang + rest and every
// set shares the same setRest — i.e. flattening to basic loses nothing.
export const planIsUniform = (plan) => {
  if (!plan?.length) return true;
  const { reps } = plan[0];
  const h = reps?.[0]?.hang;
  const r = reps?.[0]?.rest;
  const sr = plan[0].setRest;
  return plan.every(
    (s) =>
      s.reps.length === reps.length &&
      s.setRest === sr &&
      s.reps.every((rep) => rep.hang === h && rep.rest === r),
  );
};

const resolvePlan = (workout) =>
  workout.mode === 'advanced' && Array.isArray(workout.plan)
    ? workout.plan
    : toAdvancedPlan(workout);

/**
 * Compile a workout into stages. Prep is prepended once (only if `prep > 0`) —
 * never repeated between sets.
 *
 * stage = { kind, duration, set, rep }  (set/rep 1-based; 0 where n/a)
 */
export const buildStages = (workout, prep = 0) => {
  const stages = [];
  if (prep > 0) stages.push({ kind: STAGE.PREP, duration: prep, set: 0, rep: 0 });

  const plan = resolvePlan(workout);

  plan.forEach((set, si) => {
    const reps = Array.isArray(set.reps) && set.reps.length ? set.reps : [{ hang: 10, rest: 0 }];
    reps.forEach((rep, ri) => {
      stages.push({
        kind: STAGE.HANG,
        duration: Math.max(1, rep.hang || 1),
        set: si + 1,
        rep: ri + 1,
      });
      if (ri < reps.length - 1 && rep.rest > 0) {
        stages.push({ kind: STAGE.REP_REST, duration: rep.rest, set: si + 1, rep: ri + 1 });
      }
    });
    if (si < plan.length - 1 && set.setRest > 0) {
      stages.push({ kind: STAGE.SET_REST, duration: set.setRest, set: si + 1, rep: 0 });
    }
  });

  const totalSec = stages.reduce((n, s) => n + s.duration, 0);
  const workSec = stages
    .filter((s) => s.kind !== STAGE.PREP)
    .reduce((n, s) => n + s.duration, 0);

  return { stages, totalSec, workSec };
};

export const hangIndices = (stages) =>
  stages.reduce((acc, s, i) => (s.kind === STAGE.HANG ? (acc.push(i), acc) : acc), []);

export const totalHangs = (stages) => hangIndices(stages).length;

export const hangsBefore = (stages, index) =>
  stages.slice(0, Math.max(0, index)).filter((s) => s.kind === STAGE.HANG).length;

export const elapsedSec = (stages, index) =>
  stages.slice(0, Math.max(0, index)).reduce((n, s) => n + s.duration, 0);

export const setCount = (stages) =>
  stages.reduce((max, s) => Math.max(max, s.set), 0);
