'use client'

import { DashboardHeader } from '@/components/app/dashboard/header'
import { DashboardShell } from '@/components/app/dashboard/shell'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function NewCasePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    symptoms: '',
    conditions: '',
    medications: '',
    allergies: '',
    blood_pressure: '',
    heart_rate: '',
    temperature: '',
    oxygen_saturation: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const patientData = {
        name: formData.name,
        age: parseInt(formData.age) || 0,
        gender: formData.gender,
        symptoms: formData.symptoms
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        conditions: formData.conditions
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        medications: formData.medications
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        allergies: formData.allergies
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        vitals: {
          blood_pressure: formData.blood_pressure,
          heart_rate: parseInt(formData.heart_rate) || 0,
          temperature: parseFloat(formData.temperature) || 0,
          oxygen_saturation: parseInt(formData.oxygen_saturation) || 0,
        },
      }

      const formDataObj = new FormData()
      const jsonBlob = new Blob([JSON.stringify(patientData)], {
        type: 'application/json',
      })
      formDataObj.append('file', jsonBlob, 'patient_data.json')

      const response = await api.post('/upload', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data && response.data.case_id) {
        router.push(`/cases/${response.data.case_id}`)
      } else {
        router.push('/cases')
      }
    } catch (error) {
      console.error('Error creating case:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Create New Case"
        subheading="Enter patient information to create a new case"
      />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>
              Enter the patient's basic information and medical details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Patient Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="Years"
                    min="0"
                    max="120"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    name="gender"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={formData.gender}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={handleChange as any}
                    required
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="symptoms">
                Symptoms
                <span className="ml-1 text-xs text-muted-foreground">
                  (comma separated)
                </span>
              </Label>
              <Textarea
                id="symptoms"
                name="symptoms"
                placeholder="Fever, cough, fatigue..."
                value={formData.symptoms}
                onChange={handleChange}
                required
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="conditions">
                  Existing Conditions
                  <span className="ml-1 text-xs text-muted-foreground">
                    (comma separated)
                  </span>
                </Label>
                <Textarea
                  id="conditions"
                  name="conditions"
                  placeholder="Diabetes, hypertension..."
                  value={formData.conditions}
                  onChange={handleChange}
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medications">
                  Current Medications
                  <span className="ml-1 text-xs text-muted-foreground">
                    (comma separated)
                  </span>
                </Label>
                <Textarea
                  id="medications"
                  name="medications"
                  placeholder="Metformin, Lisinopril..."
                  value={formData.medications}
                  onChange={handleChange}
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">
                Allergies
                <span className="ml-1 text-xs text-muted-foreground">
                  (comma separated)
                </span>
              </Label>
              <Textarea
                id="allergies"
                name="allergies"
                placeholder="Penicillin, peanuts..."
                value={formData.allergies}
                onChange={handleChange}
                className="min-h-[80px]"
              />
            </div>

            <div>
              <h3 className="text-md font-medium mb-3">Vital Signs</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="blood_pressure">Blood Pressure</Label>
                  <Input
                    id="blood_pressure"
                    name="blood_pressure"
                    placeholder="120/80"
                    value={formData.blood_pressure}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heart_rate">Heart Rate</Label>
                  <Input
                    id="heart_rate"
                    name="heart_rate"
                    type="number"
                    placeholder="BPM"
                    value={formData.heart_rate}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    name="temperature"
                    type="number"
                    step="0.1"
                    placeholder="°F"
                    value={formData.temperature}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="oxygen_saturation">O₂ Saturation</Label>
                  <Input
                    id="oxygen_saturation"
                    name="oxygen_saturation"
                    type="number"
                    placeholder="%"
                    min="0"
                    max="100"
                    value={formData.oxygen_saturation}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Case'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </DashboardShell>
  )
}
