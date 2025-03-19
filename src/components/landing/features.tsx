'use client'

import {
  Brain,
  FileText,
  Shield,
  Workflow,
  SlidersHorizontal,
  Network,
  History,
  Bot,
} from 'lucide-react'
import { AnimateOnScroll } from '@/components/landing/animate-on-scroll'

const features = [
  {
    icon: <Brain className="h-10 w-10 text-primary" />,
    title: 'Multi-Agent Intelligence',
    description:
      'Specialized AI agents work together - intake, diagnostic, and treatment - each performing distinct medical tasks',
  },
  {
    icon: <Workflow className="h-10 w-10 text-primary" />,
    title: 'Custom Workflows',
    description:
      'Create, visualize and deploy custom medical workflows with drag-and-drop simplicity',
  },
  {
    icon: <SlidersHorizontal className="h-10 w-10 text-primary" />,
    title: 'Agent Configuration',
    description:
      'Design specialized agents for specific medical domains or diagnosis types',
  },
  {
    icon: <Network className="h-10 w-10 text-primary" />,
    title: 'Orchestration Engine',
    description:
      'Sophisticated message routing between agents with real-time coordination and monitoring',
  },
  {
    icon: <FileText className="h-10 w-10 text-primary" />,
    title: 'Medical Knowledge Base',
    description:
      'Built-in database of conditions, symptoms, medications, and interactions to inform diagnoses',
  },
  {
    icon: <History className="h-10 w-10 text-primary" />,
    title: 'Case Management',
    description:
      'Upload and process patient data with comprehensive tracking and results storage',
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: 'Interaction Detection',
    description:
      'Automatic identification of potential medication interactions and contraindications',
  },
  {
    icon: <Bot className="h-10 w-10 text-primary" />,
    title: 'Real-time Status Updates',
    description:
      'WebSocket integration provides live system status and message flow visualization',
  },
]

export function Features() {
  return (
    <section
      id="features"
      className="py-24 bg-muted/30 relative overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 opacity-50">
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-background shadow-xl shadow-primary/10 ring-1 ring-primary/5 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
      </div>

      <div className="container mx-auto px-4 relative">
        <AnimateOnScroll
          animation="slide-up"
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
            Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Advanced AI Orchestration
          </h2>
          <p className="text-xl text-foreground/70">
            SwordSymphony's multi-agent system coordinates specialized medical
            AI with sophisticated workflows and real-time orchestration.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <AnimateOnScroll
              key={index}
              animation="slide-up"
              delay={(index % 4) * 100}
              threshold={0.1}
            >
              <div className="group bg-background p-6 rounded-xl shadow-sm border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300 relative overflow-hidden h-full">
                <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="mb-4 relative">
                  <div className="absolute -inset-1 rounded-lg bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur" />
                  <div className="relative">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-medium mb-2 relative">
                  {feature.title}
                </h3>
                <p className="text-foreground/70 relative">
                  {feature.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
