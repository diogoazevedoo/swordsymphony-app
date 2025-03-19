'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'

type TimeFrame = 'weekly' | 'monthly'

type DataPoint = {
  label: string
  diagnostics: number
  treatments: number
}

function generateData(timeFrame: TimeFrame): DataPoint[] {
  if (timeFrame === 'weekly') {
    return [
      { label: 'Mon', diagnostics: 12, treatments: 10 },
      { label: 'Tue', diagnostics: 18, treatments: 15 },
      { label: 'Wed', diagnostics: 15, treatments: 13 },
      { label: 'Thu', diagnostics: 25, treatments: 20 },
      { label: 'Fri', diagnostics: 22, treatments: 18 },
      { label: 'Sat', diagnostics: 10, treatments: 8 },
      { label: 'Sun', diagnostics: 8, treatments: 6 },
    ]
  } else {
    return [
      { label: 'Jan', diagnostics: 120, treatments: 100 },
      { label: 'Feb', diagnostics: 150, treatments: 130 },
      { label: 'Mar', diagnostics: 180, treatments: 165 },
    ]
  }
}

export function DiagnosticMetricsCard() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('weekly')
  const [data, setData] = useState<DataPoint[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(generateData(timeFrame))
    }, 200)

    return () => clearTimeout(timer)
  }, [timeFrame])

  const handleTabChange = (value: string) => {
    setTimeFrame(value as TimeFrame)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Diagnostic Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                  }}
                />
                <Legend />
                <Bar
                  dataKey="diagnostics"
                  name="Diagnostics"
                  fill="var(--chart-1)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="treatments"
                  name="Treatments"
                  fill="var(--chart-2)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
