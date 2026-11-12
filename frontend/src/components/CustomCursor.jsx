import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [enabled, setEnabled] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    // Only enable for non-touch fine pointer devices
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer || prefersReducedMotion) return

    setEnabled(true)

    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let animId

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      }
    }

    const onPointerOver = (e) => {
      const target = e.target
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('textarea') ||
        target.closest('[data-cursor="pointer"]')
      ) {
        setHovered(true)
      } else {
        setHovered(false)
      }
    }

    const render = () => {
      // Smooth lerp for outer ring
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      }
      animId = requestAnimationFrame(render)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseover', onPointerOver, { passive: true })
    animId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onPointerOver)
      cancelAnimationFrame(animId)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 bg-cyan-400 rounded-full pointer-events-none z-[9999] transition-transform duration-75 shadow-[0_0_8px_#00f0ff]"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 -ml-4 -mt-4 rounded-full pointer-events-none z-[9998] transition-all duration-200 border ${
          hovered
            ? 'w-12 h-12 -ml-6 -mt-6 border-cyan-400/80 bg-cyan-400/10 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-110'
            : 'w-8 h-8 border-cyan-500/40 bg-transparent'
        }`}
      />
    </>
  )
}
