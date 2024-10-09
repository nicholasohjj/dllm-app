import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Wifi, Battery, BarChart, Bell, Clock, Users } from "lucide-react"
import { Link } from "react-router-dom"

export default function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Laundry Monitor
        </Button>
      </Link>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">About DLLM Laundry Monitor</CardTitle>
          <CardDescription>Smart IoT-based Laundry Management System for RVRC</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            DLLM (Don't Leave Laundry Messy) Laundry Monitor is an innovative solution designed to streamline the laundry experience at Ridge View Residential College (RVRC). Our system provides real-time updates on machine availability, estimated wait times, and personalized features to make your laundry routine more efficient and less time-consuming.
          </p>
          <h2 className="text-2xl font-semibold mb-2">Key Features</h2>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Real-time machine status updates and estimated wait times
            </li>
            <li className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Crowd level monitoring in the laundry room
            </li>
            <li className="flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              Notifications when your laundry is complete
            </li>
            <li className="flex items-center">
              <BarChart className="mr-2 h-4 w-4" />
              Predictive analytics for optimal laundry times
            </li>
          </ul>
          <h2 className="text-2xl font-semibold mb-2">How It Works</h2>
          <ol className="list-decimal list-inside mb-4 space-y-2">
            <li>IoT devices with vibration sensors detect machine usage</li>
            <li>ESP32-S3-EYE cameras monitor crowd levels</li>
            <li>Data is sent to the cloud for real-time processing</li>
            <li>Machine learning models predict availability and busy times</li>
            <li>Users receive updates and notifications via the mobile app</li>
          </ol>
          <h2 className="text-2xl font-semibold mb-2">Technology Stack</h2>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li className="flex items-center">
              <Wifi className="mr-2 h-4 w-4" />
              ESP32 microcontrollers for wireless data transmission
            </li>
            <li className="flex items-center">
              <Battery className="mr-2 h-4 w-4" />
              Power banks for stable power supply
            </li>
            <li className="flex items-center">
              <BarChart className="mr-2 h-4 w-4" />
              Cloud-based machine learning for predictive analytics
            </li>
          </ul>
          <p className="mb-4">
            Our team is committed to optimizing laundry room usage and saving students' time. We're constantly working on improving our system and adding new features to enhance your laundry experience.
          </p>
          <p>
            For any issues, feedback, or suggestions, please contact our support team at dllmnus@googlegroups.com
          </p>
        </CardContent>
      </Card>
    </div>
  )
}