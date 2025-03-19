'use client'

import { cn } from '@/lib/utils'
import { AnimateOnScroll } from '@/components/landing/animate-on-scroll'

export function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Patient Data Processing',
      description:
        'The Intake Agent normalizes and enhances raw patient data, extracting key information from symptoms, conditions, and medical history.',
      code: `{
  "id": "P12345",
  "name": "Robert Johnson",
  "age": 65,
  "symptoms": [
    "chest pain", 
    "shortness of breath"
  ],
  "risk_factors": ["age", "hypertension"]
}`,
      align: 'left',
    },
    {
      number: 2,
      title: 'AI-Powered Diagnosis',
      description:
        'The Diagnostic Agent analyzes data using advanced AI algorithms and medical knowledge to generate potential diagnoses with confidence levels.',
      code: `{
  "potential_diagnoses": [
    "Coronary Artery Disease",
    "Angina Pectoris"
  ],
  "confidence": 0.87,
  "reasoning": [
    "Chest pain with exertion",
    "History of hypertension",
    "Age-related risk factors"
  ]
}`,
      align: 'right',
    },
    {
      number: 3,
      title: 'Treatment Planning',
      description:
        'The Treatment Agent develops personalized treatment plans based on diagnoses, considering patient history, medication interactions, and best practices.',
      code: `{
  "recommendations": [
    "Cardiac evaluation with stress test",
    "Daily aspirin therapy (81mg)"
  ],
  "medications": [
    "Atorvastatin 20mg daily",
    "Metoprolol 25mg twice daily"
  ],
  "lifestyle_changes": [
    "Low sodium diet",
    "30 minutes of walking daily"
  ]
}`,
      align: 'left',
    },
    {
      number: 4,
      title: 'Orchestration & Visualization',
      description:
        'The Orchestrator manages the entire process, routing messages between agents, handling errors, and providing real-time status updates.',
      code: `{
  "task_id": "f8e7d6c5-b4a3-2c1d-0e9f-8a7b6c5d4e3f",
  "status": "completed",
  "sequence": [
    {"agent": "intake_agent", "status": "complete"},
    {"agent": "diagnostic_agent", "status": "complete"},
    {"agent": "treatment_agent", "status": "complete"}
  ]
}`,
      align: 'right',
    },
  ]

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/5 opacity-70 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4">
        <AnimateOnScroll
          animation="slide-up"
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
            Workflow
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Orchestrating Medical Intelligence
          </h2>
          <p className="text-xl text-foreground/70">
            SwordSymphony's sophisticated orchestration engine coordinates
            specialized AI agents through custom-defined workflows.
          </p>
        </AnimateOnScroll>

        <div className="relative max-w-5xl mx-auto">
          <div className="absolute left-1/2 h-full w-0.5 bg-gradient-to-b from-primary/30 via-primary/50 to-primary/30 transform -translate-x-1/2"></div>

          {steps.map((step, index) => (
            <AnimateOnScroll
              key={index}
              animation="slide-up"
              delay={index * 200}
              threshold={0.1}
              className="relative mb-16 last:mb-0"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="absolute z-10 w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 ring-4 ring-background">
                  {step.number}
                </div>
              </div>

              <div
                className={cn(
                  'p-6 bg-background rounded-xl shadow-sm border border-border hover:border-primary/20 hover:shadow-md transition-all duration-300',
                  step.align === 'left'
                    ? 'ml-0 md:ml-8'
                    : 'mr-0 md:mr-8 md:ml-auto',
                  step.align === 'right' && 'md:text-right',
                )}
              >
                <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                <p className="text-foreground/70 mb-4">{step.description}</p>

                <div
                  className={cn(
                    'group relative',
                    step.align === 'right' && 'md:ml-auto',
                  )}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/10 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                  <div className="bg-muted/50 p-3 rounded-lg text-sm relative">
                    <code>
                      <pre
                        className={cn(
                          'overflow-auto text-xs',
                          step.align === 'right' && 'md:text-left',
                        )}
                      >
                        {step.code}
                      </pre>
                    </code>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
