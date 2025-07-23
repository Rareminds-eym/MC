// Utility to sort attempts by highest score, then lowest timer
export const getSortedAttempts = (score_history: number[] = [], timer_history: number[] = []) => {
  const attempts = score_history.map((score, i) => ({
    score,
    timer: timer_history[i] ?? 0,
    attempt: i + 1,
  }));
  // Sort: highest score first, then lowest timer
  const sorted = attempts.sort((a, b) => b.score - a.score || a.timer - b.timer);
  // Always show 3 attempts, fill with dashes if less
  while (sorted.length < 3) {
    sorted.push({ score: -1, timer: -1, attempt: sorted.length + 1 });
  }
  return sorted;
};
