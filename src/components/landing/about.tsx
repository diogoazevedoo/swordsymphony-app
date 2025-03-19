'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { AnimateOnScroll } from '@/components/landing/animate-on-scroll'

export function About() {
  const technologies = [
    'Advanced natural language processing for symptom analysis',
    'Multi-agent orchestration for comprehensive medical insights',
    'Real-time diagnostic capabilities with continuous learning',
    'Evidence-based treatment recommendations',
    'Secure, private handling of sensitive medical information',
  ]

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-0 bottom-0 -z-10 transform translate-x-1/3 translate-y-1/4">
          <div className="aspect-square h-[400px] rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 opacity-50 blur-3xl" />
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <AnimateOnScroll animation="slide-left">
            <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
              About Us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              About SwordSymphony
            </h2>
            <p className="text-foreground/70 mb-6">
              SwordSymphony represents the cutting edge of medical AI
              technology, designed to assist healthcare professionals in
              providing accurate diagnoses and personalized treatment plans.
            </p>
            <p className="text-foreground/70 mb-6">
              Our system orchestrates multiple specialized AI agents that work
              together, each focusing on different aspects of the diagnostic and
              treatment process. This multi-agent approach ensures comprehensive
              analysis and recommendations.
            </p>
            <p className="text-foreground/70 mb-8">
              Built with a focus on accuracy, efficiency, and patient care,
              SwordSymphony aims to augment medical professionals' capabilities
              and improve healthcare outcomes.
            </p>
            <Button size="lg" className="group" asChild>
              <Link href="/dashboard">
                Experience the platform
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </AnimateOnScroll>

          <AnimateOnScroll animation="slide-right" delay={200}>
            <div className="bg-gradient-to-br from-background to-muted/30 p-8 rounded-xl border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-primary/10 rounded-full p-1.5 mr-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"
                      fill="currentColor"
                      className="text-primary"
                    />
                  </svg>
                </span>
                Our Vision
              </h3>
              <p className="text-foreground/70 mb-6 pl-9">
                We envision a future where AI-assisted healthcare is accessible
                to everyone, providing expert-level medical analysis regardless
                of location or resources.
              </p>

              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-primary/10 rounded-full p-1.5 mr-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.5 12.5C17.5 13.33 16.83 14 16 14H4C3.17 14 2.5 13.33 2.5 12.5V4.5C2.5 3.67 3.17 3 4 3H16C16.83 3 17.5 3.67 17.5 4.5V12.5ZM16 1H4C2.07 1 0.5 2.57 0.5 4.5V12.5C0.5 14.43 2.07 16 4 16H16C17.93 16 19.5 14.43 19.5 12.5V4.5C19.5 2.57 17.93 1 16 1ZM10 14.5H4C2.07 14.5 0.5 16.07 0.5 18V19H19.5V18C19.5 16.07 17.93 14.5 16 14.5H10Z"
                      fill="currentColor"
                      className="text-primary"
                    />
                  </svg>
                </span>
                Technology
              </h3>
              <ul className="space-y-3 text-foreground/70 pl-9">
                {technologies.map((tech, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>{tech}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}
