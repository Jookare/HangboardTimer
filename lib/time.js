// Time helpers shared across the timer and the configure screens.

export const pad2 = (n) => `0${n}`.slice(-2);

// seconds -> "M:SS"
export const formatTime = (seconds) => {
  const s = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(s / 60);
  return `${minutes}:${pad2(s % 60)}`;
};

// seconds -> "H h MM m SS s" (or "> 1 day")
export const formatDuration = (seconds) => {
  let total = Math.max(0, Math.round(seconds));
  const hours = Math.floor(total / 3600);
  if (hours >= 24) return '> 1 day';
  total %= 3600;
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  return `${hours} h ${pad2(minutes)} m ${pad2(secs)} s`;
};

// Digit string from a numeric keypad -> seconds. Last two digits are seconds.
export const parseTimeInput = (text, minValue = 0) => {
  if (!text || text.length === 0) return minValue;
  if (text.length <= 2) return parseInt(text, 10) || minValue;
  const seconds = parseInt(text.slice(-2), 10) || 0;
  const minutes = parseInt(text.slice(0, -2), 10) || 0;
  return minutes * 60 + seconds;
};

// Timer readout: tenths of a second -> { mins, secs, tenths } (mins/secs padded).
export const getRemaining = (tenthsTotal) => {
  const t = Math.max(0, tenthsTotal);
  return {
    mins: pad2(Math.floor(t / 600)),
    secs: pad2(Math.floor((t % 600) / 10)),
    tenths: Math.floor(t % 10),
  };
};

// Planned total workout length in seconds.
export const plannedWorkoutSeconds = ({ sets, reps, hangTime, repRest, setRest }) => {
  const hang = sets * reps * hangTime;
  const betweenReps = sets * Math.max(0, reps - 1) * repRest;
  const betweenSets = Math.max(0, sets - 1) * setRest;
  return hang + betweenReps + betweenSets;
};
