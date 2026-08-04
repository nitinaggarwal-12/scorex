/**
 * Shared ScoreBadge — consistent score-to-color mapping so a "72/100"
 * doesn't render green in one assessor and amber in another for the
 * same value. Every screen that shows a numeric readiness/maturity
 * score should route through this instead of redefining its own
 * getScoreColor() helper.
 *
 * Thresholds are intentionally centralized here — change once, every
 * screen updates together.
 */
function scoreTone(value, max = 100) {
  const pct = max ? (value / max) * 100 : value;
  if (pct >= 75) return 'good';
  if (pct >= 50) return 'moderate';
  return 'risk';
}

export default function ScoreBadge({ value, max = 100, label, size = 'md', className = '' }) {
  const tone = scoreTone(value, max);
  return (
    <div
      className={`ui-score-badge ui-score-badge--${tone} ui-score-badge--${size} ${className}`.trim()}
      role="img"
      aria-label={`${label ? label + ': ' : ''}${value} out of ${max}`}
    >
      <span className="ui-score-badge__value">{value}</span>
      {label ? <span className="ui-score-badge__label">{label}</span> : null}
    </div>
  );
}
