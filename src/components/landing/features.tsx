"use client";

import {
  Brain,
  FileText,
  Shield,
  Workflow,
  SlidersHorizontal,
  Network,
  History,
  Bot,
  BarChart,
  Stethoscope,
  HeartPulse,
  RefreshCw,
} from "lucide-react";
import { AnimateOnScroll } from "@/components/landing/animate-on-scroll";

const features = [
  {
    icon: <Brain className="h-10 w-10 text-primary" />,
    title: "Multi-Agent Intelligence",
    description:
      "Intake, diagnostic, and treatment agents collaborate on comprehensive medical analysis and personalized plans",
  },
  {
    icon: <Workflow className="h-10 w-10 text-primary" />,
    title: "Workflow Orchestrator",
    description:
      "Design and deploy specialized medical workflows for cardiology, neurology, pediatrics, and emergency medicine",
  },
  {
    icon: <SlidersHorizontal className="h-10 w-10 text-primary" />,
    title: "Agent Configuration",
    description:
      "YAML-based agent configuration allows for rapid deployment of specialized medical experts",
  },
  {
    icon: <Network className="h-10 w-10 text-primary" />,
    title: "Message Routing",
    description:
      "Actor-based communication system ensures efficient information flow between specialized medical agents",
  },
  {
    icon: <FileText className="h-10 w-10 text-primary" />,
    title: "Medical Knowledge Base",
    description:
      "Integrated database of conditions, symptoms, medications, and interactions to enhance diagnostic accuracy",
  },
  {
    icon: <History className="h-10 w-10 text-primary" />,
    title: "Case Management",
    description:
      "Comprehensive patient case tracking with complete diagnostic journey and treatment recommendations",
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: "Medication Safety",
    description:
      "Automatic detection of potential medication interactions, allergies, and contraindications",
  },
  {
    icon: <Bot className="h-10 w-10 text-primary" />,
    title: "Real-time Monitoring",
    description:
      "Live visualization of agent communication, workflow progress, and system status updates",
  },
];

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
            Advanced Medical AI Orchestration
          </h2>
          <p className="text-xl text-foreground/70">
            SwordSymphony conducts specialized medical AI agents through
            sophisticated workflows, coordinating their expertise to deliver
            precise analysis and personalized care recommendations.
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
  );
}
