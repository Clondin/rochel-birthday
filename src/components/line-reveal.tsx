/* Headings stay visible even when the user jumps, drags the scrollbar,
   follows an anchor, or restores a deep scroll position. */
export function LineReveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <span className="block pb-[0.14em]" style={{ transitionDelay: `${delay}s` }}>
        {children}
      </span>
    </span>
  )
}
