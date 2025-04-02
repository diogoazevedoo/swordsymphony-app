'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Brain, Stethoscope, Workflow, Shield, HeartPulse } from 'lucide-react'
import { AnimateOnScroll } from '@/components/landing/animate-on-scroll'

export function About() {
  const technologies = [
    'Natural language processing for comprehensive symptom analysis',
    'Go-powered actor system for robust agent coordination',
    'YAML configuration for flexible workflow deployment',
    'Real-time WebSocket monitoring of diagnostic processes',
    'Medical knowledge base with conditions, symptoms, and medications',
    'Secure, private handling of sensitive medical information',
  ]

  const specializations = [
    { 
      name: 'Cardiac Assessment',
      icon: <HeartPulse className="h-5 w-5" />,
      description: 'Specialized agents for heart condition diagnosis and treatment'
    },
    { 
      name: 'Neurological Evaluation',
      icon: <Brain className="h-5 w-5" />,
      description: 'Brain and nervous system assessment workflows'
    },
    { 
      name: 'Emergency Triage',
      icon: <Shield className="h-5 w-5" />,
      description: 'Rapid evaluation for urgent medical conditions'
    },
    { 
      name: 'Pediatric Care',
      icon: <Stethoscope className="h-5 w-5" />,
      description: 'Child-specific diagnosis and treatment patterns'
    },
  ]

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="absolute right-0 bottom-0 -z-10 transform translate-x-1/3 translate-y-1/4">
          <div className="aspect-square h-[400px] rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 opacity-50 blur-3xl" />
        </div>
      </div>

      <div className="container mx-auto px-4">
        <AnimateOnScroll animation="slide-up" className="text-center mb-16 max-w-3xl mx-auto">
          <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
            Our Mission
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Orchestrating the Future of Healthcare
          </h2>
          <p className="text-xl text-foreground/70">
            SwordSymphony brings together specialized AI agents in harmony to deliver
            precise diagnoses and personalized treatment plans for better patient outcomes.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {specializations.map((spec, index) => (
            <AnimateOnScroll 
              key={index} 
              animation="slide-up" 
              delay={index * 150}
              className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-primary/20 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="mb-3 bg-primary/10 p-2 rounded-full w-12 h-12 flex items-center justify-center text-primary">
                {spec.icon}
              </div>
              <h3 className="font-medium text-lg mb-2">{spec.name}</h3>
              <p className="text-foreground/70 text-sm">{spec.description}</p>
            </AnimateOnScroll>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <AnimateOnScroll animation="slide-left">
            <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
              About SwordSymphony
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              AI Orchestra for Medical Excellence
            </h2>
            <p className="text-foreground/70 mb-6">
              SwordSymphony represents the next evolution in medical AI technology, 
              designed to assist healthcare professionals with advanced diagnostic 
              and treatment planning capabilities that mirror specialist expertise.
            </p>
            <p className="text-foreground/70 mb-6">
              Our platform orchestrates multiple specialized AI agents working in concert,
              each handling distinct aspects of the medical assessment process. This 
              multi-agent architecture enables comprehensive analysis and recommendations 
              that consider all aspects of a patient's condition.
            </p>
            <p className="text-foreground/70 mb-8">
              Built with a focus on accuracy, explainability, and evidence-based medicine, 
              SwordSymphony augments healthcare professionals' capabilities while maintaining
              the critical human element in medical decision-making.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group" asChild>
                <Link href="/dashboard">
                  Experience the platform
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="group" asChild>
                <Link href="/documentation">
                  View documentation
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="slide-right" delay={200}>
            <div className="bg-gradient-to-br from-background to-muted/30 p-8 rounded-xl border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <div className="bg-primary/10 rounded-full p-1.5 mr-2 text-primary">
                  <Workflow className="h-5 w-5" />
                </div>
                Our Vision
              </h3>
              <p className="text-foreground/70 mb-6 pl-9">
                We envision a future where AI-assisted healthcare is accessible
                to everyone, providing expert-level medical guidance regardless
                of location or resources, while supporting rather than replacing
                healthcare professionals.
              </p>

              <h3 className="text-xl font-bold mb-4 flex items-center">
                <div className="bg-primary/10 rounded-full p-1.5 mr-2 text-primary">
                  <Brain className="h-5 w-5" />
                </div>
                Technology Stack
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
        
        <AnimateOnScroll animation="slide-up" delay={300} className="mt-16 text-center">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
            Ready to see SwordSymphony in action? <Link href="/dashboard" className="ml-2 underline underline-offset-2 hover:text-primary/90">Go to Dashboard</Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
