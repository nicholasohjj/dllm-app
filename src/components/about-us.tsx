import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"; // Import Link from React Router

export default function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" >
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Laundry Monitor
        </Button>
      </Link>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">About DLLM Laundry Monitor</CardTitle>
          <CardDescription>Smart IoT-based Laundry Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            DLLM Laundry Monitor is an innovative solution designed to streamline your laundry experience. Our system provides real-time updates on machine availability, estimated wait times, and personalized features to make your laundry routine more efficient.
          </p>
          <h2 className="text-2xl font-semibold mb-2">Key Features</h2>
          <ul className="list-disc list-inside mb-4">
            <li>Real-time machine status updates</li>
            <li>Estimated wait times for washers and dryers</li>
            <li>Personalized machine preferences</li>
            <li>Interactive laundry room floorplan</li>
            <li>Dark mode support</li>
            <li>Mobile-friendly design</li>
          </ul>
          <h2 className="text-2xl font-semibold mb-2">How to Use</h2>
          <ol className="list-decimal list-inside mb-4">
            <li>Check the dashboard for available machines and wait times</li>
            <li>Use the search and filter options to find specific machines</li>
            <li>Click on a machine card to view detailed information</li>
            <li>Star your favorite machines for quick access</li>
            <li>Use the floorplan to locate machines in the laundry room</li>
            <li>Toggle dark mode for comfortable viewing at night</li>
          </ol>
          <p>
            For any issues or feedback, please contact our support team at dllmnus@googlegroups.com
          </p>
        </CardContent>
      </Card>
    </div>
  )
}