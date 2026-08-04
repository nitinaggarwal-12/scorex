/**
 * Shared SectionHeader — the small uppercase eyebrow label used above
 * grouped nav items and report sections (e.g. "CORE WORKSPACE",
 * "ASSESSMENT MODULES"). Previously each occurrence redeclared its own
 * font-size/letter-spacing/color inline; centralizing it here means a
 * single change updates every screen consistently.
 */
export default function SectionHeader({ children, className = '', ...rest }) {
  return (
    <span className={`ui-section-header ${className}`.trim()} {...rest}>
      {children}
    </span>
  );
}
