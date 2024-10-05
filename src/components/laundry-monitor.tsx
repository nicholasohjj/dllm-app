import { useState, useEffect } from "react"
import { Bell, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

import { LaundryFloorplan } from "./LaundryFloorplan"
import { useMachineSetup, Machine } from "./MachineSetup"
import { MachineCard } from "./MachineCard"  // Import the new MachineCard component

export function LaundryMonitorComponent() {

  const machines = useMachineSetup()
  const [isFloorplanOpen, setIsFloorplanOpen] = useState(false)
  const [selectedMachineId, setSelectedMachineId] = useState<number | null>(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Register the service worker for push notifications
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(function (registration) {
          console.log('Service Worker registered', registration);
        })
        .catch(function (error) {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  const getStatusColor = (status: Machine["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "in-use":
        return "bg-yellow-500"
      case "finishing-soon":
        return "bg-orange-500"
      case "complete":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleNotificationToggle = () => {
    if (notificationsEnabled) {
      unsubscribeFromPushNotifications();
    } else {
      requestNotificationPermission();
    }
  };

  const requestNotificationPermission = () => {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        toast({
          title: 'Notifications Enabled',
          description: "You'll be notified when your laundry is done.",
        });
        subscribeUserToPush();
      } else {
        toast({
          title: 'Notifications Disabled',
          description: 'You denied the notification permission.',
        });
      }
    });
  };

  const subscribeUserToPush = () => {
    navigator.serviceWorker.ready.then(function (registration) {
      registration.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'BM6VW3YncLm4CzZ1zt3OT_PXH87VSN7q6WT8-eiBzHiuxMwY5F3HLJvjvBQMf_cVPdnZ7axmuE8Nd4VCl3wCj-M', // Replace with your actual VAPID public key
        })
        .then(function (subscription) {
          // Send subscription to backend with machineId
          const machineId = selectedMachineId;
          fetch(`https://your-vercel-app.vercel.app/api/subscribe-machine`, {
            method: 'POST',
            body: JSON.stringify({ machineId, subscription }),
            headers: {
              'Content-Type': 'application/json',
            },
          }).then(() => {
            console.log('Push subscription sent to server');
            setNotificationsEnabled(true); // Set notifications enabled state
          });
        })
        .catch(function (error) {
          console.error('Failed to subscribe the user:', error);
        });
    });
  };

  const unsubscribeFromPushNotifications = () => {
    navigator.serviceWorker.ready.then(function (registration) {
      registration.pushManager.getSubscription().then(subscription => {
        if (subscription) {
          subscription.unsubscribe().then(() => {
            const machineId = selectedMachineId;
            fetch(`https://your-vercel-app.vercel.app/api/unsubscribe-machine`, {
              method: 'POST',
              body: JSON.stringify({ machineId, subscription }),
              headers: {
                'Content-Type': 'application/json',
              },
            }).then(() => {
              console.log('Push subscription removed from server');
              setNotificationsEnabled(false); // Set notifications disabled state
              toast({
                title: 'Notifications Disabled',
                description: 'You will no longer receive notifications.',
              });
            });
          });
        }
      });
    });
  };

  const handleSelectMachine = (machineId: number) => {
    setSelectedMachineId(machineId)
  }

  const closeMachineDialog = () => {
    setSelectedMachineId(null)
  }

  const washers = machines
  .filter(machine => machine.type === "washer" && machine.status !== "disabled")
  .sort((a, b) => a.id - b.id); // Sort washers by id in ascending order

const dryers = machines
  .filter(machine => machine.type === "dryer" && machine.status !== "disabled")
  .sort((a, b) => a.id - b.id); // Sort dryers by id in ascending order



  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Laundry Monitor</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setIsFloorplanOpen(true)}>
            <MapPin className="h-4 w-4" />
            <span className="sr-only">Open floorplan</span>
          </Button>
          <Button variant="outline" size="icon" onClick={handleNotificationToggle}>
            <Bell className="h-4 w-4" />

          </Button>
        </div>
      </header>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Washers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {washers.map((machine) => (
              <MachineCard
                key={machine.id}
                machine={machine}
                getStatusColor={getStatusColor}
                handleNotification={handleNotificationToggle}
                machines={machines}
                isOpen={selectedMachineId === machine.id}
                onClose={closeMachineDialog}
                onClick={() => setSelectedMachineId(machine.id)}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Dryers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dryers.map((machine) => (
              <MachineCard
                key={machine.id}
                machine={machine}
                getStatusColor={getStatusColor}
                handleNotification={handleNotificationToggle}
                machines={machines}
                isOpen={selectedMachineId === machine.id}
                onClose={closeMachineDialog}
                onClick={() => setSelectedMachineId(machine.id)}
              />
            ))}
          </div>
        </section>
      </div>


      <Dialog open={isFloorplanOpen} onOpenChange={setIsFloorplanOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Laundry Room Floorplan</DialogTitle>
            <DialogDescription>
              Click on a machine to view its details
            </DialogDescription>
          </DialogHeader>
          <LaundryFloorplan machines={machines} onSelectMachine={handleSelectMachine} />
        </DialogContent>
      </Dialog>
    </div>
  )
}