import { forwardRef } from 'react';

/**
 * Shared Button primitive.
 *
 * Goal: stop each screen (Sidebar, Navbar, modals, assessor forms) from
 * hand-rolling its own inline-styled <button>. Every visual variant a
 * button needs should be expressible via `variant` + `size` below —
 * if it isn't, extend this component rather than reaching for
 * style={{...}} at the call site.
 *
 * variant: 'primary' | 'secondary' | 'ghost' | 'danger'
 * size:    'sm' | 'md' | 'lg'
 */
const Button = forwardRef(function Button(
  {
    variant = 'secondary',
    size = 'md',
    iconOnly = false,
    active = false,
    className = '',
    children,
    ...rest
  },
  ref
) {
  const classes = [
    'ui-btn',
    `ui-btn--${variant}`,
    `ui-btn--${size}`,
    iconOnly ? 'ui-btn--icon-only' : '',
    active ? 'is-active' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button ref={ref} className={classes} {...rest}>
      {children}
    </button>
  );
});

export default Button;
