import { PropsWithChildren, useEffect, useRef, useState } from 'react'

export default function Overspread({
  children,
  hidden
}: PropsWithChildren<{ hidden: boolean }>) {
  const [textHeight, setTextHeight] = useState(0)

  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return

    const dom = ref.current.children[0] as HTMLElement
    const resizeObserver = new ResizeObserver((entries) => {
      const height = entries[0].contentRect.height
      setTextHeight(height)
    })

    resizeObserver.observe(dom)

    return () => {
      resizeObserver.disconnect()
    }
  }, [ref.current])

  return (
    <div
      ref={ref}
      className='relative '
    >
      {hidden && (
        <div
          className='absolute top-0 left-0 w-full bg-neutral-400 rounded-sm'
          style={{
            height: textHeight
          }}
        />
      )}
      {children}
    </div>
  )
}
