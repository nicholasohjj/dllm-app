import { useState, useEffect, useCallback } from "react";
import { Bell, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

import { LaundryFloorplan } from "./LaundryFloorplan";
import { useMachineSetup } from "./MachineSetup";
import { MachineCard } from "./MachineCard"; // Import the new MachineCard component
import { Machine } from "./types";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function LaundryMonitorComponent() {
  const [machines, setMachines] = useState<Machine[]>(useMachineSetup());
  const [isFloorplanOpen, setIsFloorplanOpen] = useState(false);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(
    null
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize the socket connection inside useEffect
    socket = io('https://mint-mountain-accordion.glitch.me/', {
      withCredentials: true, // Allow credentials for CORS
      transports: ['websocket', 'polling'] // Use both WebSocket and polling
    });

    // Listen for real-time updates from the server
    socket.on('machineData', (updatedMachines: Machine[]) => {
      console.log('Received updated machine data:', updatedMachines); // Log the updates

      // Update the machines state with new data from the server
      setMachines(updatedMachines);
    });

    // Cleanup the socket connection when the component unmounts
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []); // Run only once on component mount

  useEffect(() => {
    // Log whenever the machines state changes to verify updates
    console.log('Machines updated:', machines);
  }, [machines]);

  useEffect(() => {
    // Register the service worker for push notifications
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(function (registration) {
          console.log("Service Worker registered", registration);
        })
        .catch(function (error) {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  const getStatusColor = useCallback((status: Machine["status"]) => {
    const statusColors = {
      available: "bg-green-500",
      "in-use": "bg-yellow-500",
      "finishing-soon": "bg-orange-500",
      complete: "bg-blue-500",
      disabled: "bg-gray-500",
    };
    return statusColors[status] || "bg-gray-500";
  }, []);

  const handleNotificationToggle = useCallback(() => {
    if (notificationsEnabled) {
      unsubscribeFromPushNotifications();
    } else {
      requestNotificationPermission();
    }
  }, [notificationsEnabled]);

  const requestNotificationPermission = useCallback(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        toast({
          title: "Notifications Enabled",
          description: "You'll be notified when your laundry is done.",
        });
        subscribeUserToPush();
      } else {
        toast({
          title: "Notifications Disabled",
          description: "You denied the notification permission.",
        });
      }
    });
  }, [toast]);

  const subscribeUserToPush = useCallback(() => {
    navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey:
            "BM6VW3YncLm4CzZ1zt3OT_PXH87VSN7q6WT8-eiBzHiuxMwY5F3HLJvjvBQMf_cVPdnZ7axmuE8Nd4VCl3wCj-M",
        })
        .then((subscription) => {
          fetch(`${API_BASE_URL}/subscribe-machine`, {
            method: "POST",
            body: JSON.stringify({
              machineId: selectedMachineId,
              subscription,
            }),
            headers: { "Content-Type": "application/json" },
          }).then(() => {
            console.log("Push subscription sent to server");
            setNotificationsEnabled(true);
          });
        })
        .catch((error) =>
          console.error("Failed to subscribe the user:", error)
        );
    });
  }, [selectedMachineId]);

  const unsubscribeFromPushNotifications = useCallback(() => {
    navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager.getSubscription().then((subscription) => {
        if (subscription) {
          subscription.unsubscribe().then(() => {
            fetch(`${API_BASE_URL}/unsubscribe-machine`, {
              method: "POST",
              body: JSON.stringify({
                machineId: selectedMachineId,
                subscription,
              }),
              headers: { "Content-Type": "application/json" },
            }).then(() => {
              console.log("Push subscription removed from server");
              setNotificationsEnabled(false);
              toast({
                title: "Notifications Disabled",
                description: "You will no longer receive notifications.",
              });
            });
          });
        }
      });
    });
  }, [selectedMachineId, toast]);

  const handleSelectMachine = (machineId: string) => {
    setSelectedMachineId(machineId);
  };

  const closeMachineDialog = () => {
    setSelectedMachineId(null);
  };

  const sortMachines = useCallback(
    (machines: Machine[], type: "washer" | "dryer") => {
      return machines
        .filter(
          (machine) => machine.type === type && machine.status !== "disabled"
        )
        .sort((a, b) => {
          const idA = parseInt(a.id.replace(/\D/g, ""), 10);
          const idB = parseInt(b.id.replace(/\D/g, ""), 10);
          return idA - idB;
        });
    },
    []
  );

  const washers = sortMachines(machines, "washer");
  const dryers = sortMachines(machines, "dryer");

  return (
<div className="min-h-screen flex flex-col bg-gray-100">
<div className="container mx-auto px-4 py-8 flex-grow">
        <header className="flex justify-between items-center mb-8 ">
          <h1 className="text-3xl font-bold">DLLM Laundry Monitor</h1>
          <div className="flex gap-2">
            <Button onClick={() => setIsFloorplanOpen(true)}>
              <MapPin className="mr-2 h-4 w-4" /> Floorplan
            </Button>
            {/* 
<Button variant="outline" size="icon" onClick={handleNotificationToggle}>
  <Bell className="h-4 w-4" />
</Button>
*/}
          </div>
        </header>

        <div className="space-y-8">
          {["Washers", "Dryers"].map((type) => (
            <section key={type}>
              <h2 className="text-2xl font-semibold mb-4">{type}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(type === "Washers" ? washers : dryers).map((machine) => (
                  <MachineCard
                    key={machine.id}
                    machine={machine}
                    getStatusColor={getStatusColor}
                    handleNotification={handleNotificationToggle}
                    machines={machines}
                    isOpen={selectedMachineId === machine.id}
                    onClose={() => setSelectedMachineId(null)}
                    onClick={() => setSelectedMachineId(machine.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        <Dialog open={isFloorplanOpen} onOpenChange={setIsFloorplanOpen}>
          <DialogContent className="max-w-full sm:max-w-3xl sm:h-auto h-full">
            <DialogHeader>
              <DialogTitle>RVREB Laundry Room Floorplan</DialogTitle>
              <DialogDescription>
                Click on a machine to view its details
              </DialogDescription>
            </DialogHeader>
            <LaundryFloorplan
              machines={machines}
              onSelectMachine={handleSelectMachine}
            />
          </DialogContent>
        </Dialog>
      </div>
      <footer className="p-4 bg-white shadow-sm mt-auto">
        <p className="text-center text-sm text-muted-foreground">
          DLLM Laundry - Smart IoT-based Laundry Management
        </p>
      </footer>
    </div>
  );
}
