'use client'

import { cn } from '@/lib/utils'
import { AnimateOnScroll } from '@/components/landing/animate-on-scroll'
import { ArrowRight, UserRound, Stethoscope, Pill, BarChart4 } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Patient Data Intake',
      icon: <UserRound className="h-6 w-6 text-primary" />,
      description:
        'The Intake Agent processes and enhances raw patient data, extracting key information from symptoms, conditions, and medical history to create a comprehensive patient profile.',
      code: `{
  "patient_id": "P12345",
  "demographics": {
    "age": 65,
    "gender": "male",
    "weight": "78kg"
  },
  "chief_complaints": [
    "chest pain radiating to left arm",
    "shortness of breath on exertion"
  ],
  "risk_factors": [
    "hypertension", 
    "type 2 diabetes",
    "former smoker"
  ],
  "vital_signs": {
    "bp": "145/92",
    "heart_rate": 88,
    "oxygen": "96%"
  }
}`,
      align: 'left',
    },
    {
      number: 2,
      title: 'Specialized Diagnosis',
      icon: <Stethoscope className="h-6 w-6 text-primary" />,
      description:
        'Configurable diagnostic agents analyze patient data through the lens of their specialty. The system can deploy cardiologists, neurologists, pediatricians, or emergency specialists based on the case needs.',
      code: `{
  "agent": "cardiologist_diagnostic",
  "assessments": [
    {
      "condition": "Coronary Artery Disease",
      "confidence": 0.87,
      "evidence": [
        "Chest pain with radiation to left arm",
        "History of hypertension and diabetes",
        "Exertional symptoms"
      ],
      "differential_diagnoses": [
        "Angina Pectoris",
        "Aortic Stenosis"
      ]
    }
  ],
  "recommended_tests": [
    "12-lead ECG",
    "Cardiac enzymes",
    "Stress echocardiogram"
  ]
}`,
      align: 'right',
    },
    {
      number: 3,
      title: 'Treatment Planning',
      icon: <Pill className="h-6 w-6 text-primary" />,
      description:
        'The Treatment Agent develops personalized care plans considering diagnosis confidence, patient history, medication interactions, and evidence-based guidelines from medical literature.',
      code: `{
  "treatment_plan": {
    "immediate_actions": [
      "Low-dose aspirin (81mg daily)",
      "Sublingual nitroglycerin PRN for chest pain"
    ],
    "medications": [
      {
        "name": "Atorvastatin",
        "dosage": "20mg",
        "frequency": "daily",
        "purpose": "Cholesterol management" 
      },
      {
        "name": "Metoprolol",
        "dosage": "25mg",
        "frequency": "twice daily",
        "purpose": "Cardiac workload reduction"
      }
    ],
    "lifestyle_modifications": [
      "Low sodium diet (< 2000mg daily)",
      "Structured cardiac rehabilitation program",
      "Daily moderate exercise (30min walking)"
    ],
    "follow_up": "Cardiology consult within 1 week"
  },
  "interactions_checked": true,
  "contraindications_detected": false
}`,
      align: 'left',
    },
    {
      number: 4,
      title: 'Workflow Orchestration',
      icon: <BarChart4 className="h-6 w-6 text-primary" />,
      description:
        'The Orchestration Engine manages the entire diagnostic and treatment workflow, coordinating agent communication, handling data flow, and providing real-time visualization of the process.',
      code: `{
  "workflow": "cardiac_assessment",
  "case_id": "f8e7d6c5-b4a3-2c1d-0e9f-8a7b6c5d4e3f",
  "status": "completed",
  "duration_ms": 4285,
  "sequence": [
    {
      "agent": "intake_agent",
      "start_time": "2025-04-02T10:15:23Z",
      "end_time": "2025-04-02T10:15:24Z",
      "status": "complete"
    },
    {
      "agent": "cardiologist_diagnostic",
      "start_time": "2025-04-02T10:15:24Z",
      "end_time": "2025-04-02T10:15:26Z",
      "status": "complete"
    },
    {
      "agent": "treatment_agent",
      "start_time": "2025-04-02T10:15:26Z",
      "end_time": "2025-04-02T10:15:27Z",
      "status": "complete"
    }
  ],
  "message_count": 12,
  "confidence_overall": 0.85
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
            The Symphony
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            How SwordSymphony Orchestrates AI Agents
          </h2>
          <p className="text-xl text-foreground/70">
            Our advanced orchestration engine conducts specialized medical AI agents through 
            carefully designed workflows to deliver comprehensive healthcare insights.
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
                <div className="absolute z-10 w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20 ring-4 ring-background">
                  {step.icon}
                </div>
              </div>

              <div
                className={cn(
                  'p-6 bg-background rounded-xl shadow-sm border border-border hover:border-primary/20 hover:shadow-md transition-all duration-300 relative overflow-hidden',
                  step.align === 'left'
                    ? 'ml-0 md:ml-10'
                    : 'mr-0 md:mr-10 md:ml-auto',
                  step.align === 'right' && 'md:text-right',
                )}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10"></div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-medium">{step.title}</h3>
                </div>
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
                
                {index < steps.length - 1 && (
                  <div className={cn(
                    "absolute bottom-6",
                    step.align === 'left' ? "right-6" : "left-6"
                  )}>
                    <ArrowRight className={cn(
                      "h-6 w-6 text-primary/40",
                      step.align === 'left' ? "rotate-90" : "-rotate-90"
                    )} />
                  </div>
                )}
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
