'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Sparkles,
  Activity,
  Workflow,
  Brain,
  Clock,
} from 'lucide-react'

export function Hero() {
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stats = statsRef.current?.querySelectorAll('.stat-item')
    stats?.forEach((stat, index) => {
      setTimeout(
        () => {
          stat.classList.add('animate-in')
        },
        1000 + index * 150,
      )
    })
  }, [])

  const stats = [
    {
      icon: <Brain className="h-8 w-8" />,
      label: 'AI Architecture',
    },
    {
      icon: <Workflow className="h-8 w-8" />,
      label: 'Visual Design',
    },
    {
      icon: <Activity className="h-8 w-8" />,
      label: 'Medical Knowledge',
    },
    {
      icon: <Clock className="h-8 w-8" />,
      label: 'Real-time Processing',
    },
  ]

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        <div
          className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6 animate-pulse"
          aria-hidden="true"
        >
          <div
            className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-primary/30 to-primary/10 opacity-30 dark:from-primary/20 dark:to-primary/5"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div
          className="absolute right-1/4 bottom-0 -z-10 blur-3xl"
          aria-hidden="true"
        >
          <div
            className="aspect-[1155/678] w-[50rem] bg-gradient-to-tr from-primary/20 to-secondary/10 opacity-20 dark:opacity-10 animate-pulse"
            style={{
              animationDelay: '1s',
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="animate-float absolute rounded-full bg-primary/5 dark:bg-primary/10 w-24 h-24 left-[10%] top-[20%] opacity-30" />
          <div className="animate-float-slow absolute rounded-full bg-primary/5 dark:bg-primary/10 w-32 h-32 left-[80%] top-[15%] opacity-20" />
          <div className="animate-float absolute rounded-full bg-primary/5 dark:bg-primary/10 w-40 h-40 left-[25%] top-[70%] opacity-25" />
          <div className="animate-float-slower absolute rounded-full bg-primary/5 dark:bg-primary/10 w-28 h-28 left-[65%] top-[60%] opacity-30" />
          <div className="animate-float-slow absolute rounded-full bg-primary/5 dark:bg-primary/10 w-36 h-36 left-[40%] top-[40%] opacity-15" />
          <div className="animate-float absolute rounded-full bg-primary/5 dark:bg-primary/10 w-20 h-20 left-[85%] top-[80%] opacity-25" />
          <div className="animate-float-slower absolute rounded-full bg-primary/5 dark:bg-primary/10 w-16 h-16 left-[15%] top-[50%] opacity-20" />
          <div className="animate-float absolute rounded-full bg-primary/5 dark:bg-primary/10 w-24 h-24 left-[50%] top-[85%] opacity-30" />
        </div>
      </div>

      <div className="container mx-auto px-4 pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-4xl text-center">
          <div
            className="mb-6 flex items-center justify-center opacity-0 animate-in-custom"
            style={{ animationDelay: '0.2s' }}
          >
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20 dark:bg-primary/5">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              Next-Gen Healthcare AI
            </span>
          </div>

          <h1
            className="font-bold text-4xl md:text-5xl lg:text-6xl mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 opacity-0 animate-in-custom"
            style={{ animationDelay: '0.4s' }}
          >
            AI-Orchestrated Medical Intelligence
          </h1>

          <p
            className="text-xl text-foreground/80 mb-8 md:text-2xl max-w-2xl mx-auto opacity-0 animate-in-custom"
            style={{ animationDelay: '0.6s' }}
          >
            SwordSymphony conducts a synchronized ensemble of specialized AI
            agents to deliver precise diagnoses and personalized treatment
            plans.
          </p>

          <div
            className="flex flex-col sm:flex-row justify-center gap-4 opacity-0 animate-in-custom"
            style={{ animationDelay: '0.8s' }}
          >
            <Button
              size="lg"
              className="group h-12 px-6 transition-all relative overflow-hidden"
              asChild
            >
              <Link href="/dashboard">
                <span className="relative z-10 flex items-center">
                  Experience the platform
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-6 transition-all hover:bg-primary/5 group"
              asChild
            >
              <Link href="#how-it-works">
                <span className="group-hover:text-primary transition-colors duration-300">
                  See how it works
                </span>
              </Link>
            </Button>
          </div>

          <div
            ref={statsRef}
            className="mt-20 grid grid-cols-1 sm:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="stat-item flex flex-col items-center opacity-0 transform translate-y-8 transition-all duration-700"
              >
                <div className="relative mb-3 p-3 bg-primary/10 rounded-full">
                  <div className="text-primary">{stat.icon}</div>
                </div>
                <p className="text-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        </div>
      </div>

      <style jsx>{`
        .animate-in-custom {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stat-item.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  )
}
