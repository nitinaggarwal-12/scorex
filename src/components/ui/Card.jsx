/**
 * Shared Card primitive — the base surface used for every panel,
 * question group, and report section. Consolidates the ad-hoc
 * `style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', ... }}`
 * blocks that were being redeclared per-component.
 *
 * padding: 'none' | 'sm' | 'md' | 'lg'
 */
export default function Card({ padding = 'md', className = '', children, ...rest }) {
  const classes = ['ui-card', `ui-card--pad-${padding}`, className].filter(Boolean).join(' ');
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
