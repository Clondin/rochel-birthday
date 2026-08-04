import { useState } from 'react'

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  /* opacity class to land on once loaded (for dimmed backdrops) */
  loadedClass?: string
}

/* Images fade in when their bytes arrive instead of popping. */
export function FadeImg({ className = '', loadedClass = 'opacity-100', ...props }: Props) {
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      decoding="async"
      {...props}
      ref={(el) => {
        if (el && el.complete && el.naturalWidth > 0 && !loaded) setLoaded(true)
      }}
      onLoad={() => setLoaded(true)}
      className={`${className} transition-opacity duration-700 ease-out ${loaded ? loadedClass : 'opacity-0'}`}
    />
  )
}
