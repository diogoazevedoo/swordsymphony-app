interface DashboardHeaderProps {
  heading: string
  subheading?: string
}

export function DashboardHeader({ heading, subheading }: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
      {subheading && <p className="text-muted-foreground mt-1">{subheading}</p>}
    </div>
  )
}
