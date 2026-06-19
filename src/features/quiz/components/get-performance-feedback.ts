export function getPerformanceFeedback(score: number, total: number): string {
  const percent = total === 0 ? 0 : (score / total) * 100;
  if (percent >= 80) return "Excellent! You're mastering AI development concepts!";
  if (percent >= 60) return "Good job! You're getting there!";
  return 'Keep practicing! Review the fundamentals.';
}
