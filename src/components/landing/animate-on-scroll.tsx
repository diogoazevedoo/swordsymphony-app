'use client'

import type React from 'react'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface AnimateOnScrollProps {
  children: React.ReactNode
  className?: string
  animation:
    | 'fade-in'
    | 'slide-up'
    | 'slide-down'
    | 'slide-left'
    | 'slide-right'
  delay?: number
  threshold?: number
  once?: boolean
}

export function AnimateOnScroll({
  children,
  className,
  animation,
  delay = 0,
  threshold = 0.1,
  once = true,
}: AnimateOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once && ref.current) {
            observer.unobserve(ref.current)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -100px 0px',
      },
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, once])

  const animationClasses = {
    'fade-in': 'opacity-0 transition-opacity duration-700',
    'slide-up': 'opacity-0 translate-y-8 transition-all duration-700',
    'slide-down': 'opacity-0 -translate-y-8 transition-all duration-700',
    'slide-left': 'opacity-0 translate-x-8 transition-all duration-700',
    'slide-right': 'opacity-0 -translate-x-8 transition-all duration-700',
  }

  const visibleClasses = 'opacity-100 translate-x-0 translate-y-0'

  return (
    <div
      ref={ref}
      className={cn(
        animationClasses[animation],
        isVisible && visibleClasses,
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
