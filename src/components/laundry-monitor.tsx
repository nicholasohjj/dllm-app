import { useState, useEffect, useCallback, useMemo } from "react";
import { MapPin, RefreshCw, Search, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { LaundryFloorplan } from "./LaundryFloorplan";
import { useMachineSetup } from "./MachineSetup";
import { MachineCard } from "./MachineCard"; // Import the new MachineCard component
import { Machine } from "./types";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function LaundryMonitorComponent() {
  const [machines, setMachines] = useState<Machine[]>(useMachineSetup());
  const [isFloorplanOpen, setIsFloorplanOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(
    null
  );
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("id");

  useEffect(() => {
    // Check system preference for dark mode
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    // Set the initial dark mode state based on system preference
    setIsDarkMode(darkModeMediaQuery.matches);

    // Listen for changes in the system preference and update accordingly
    const handleDarkModeChange = (event: MediaQueryListEvent) => {
      setIsDarkMode(event.matches);
    };

    darkModeMediaQuery.addEventListener("change", handleDarkModeChange);

    // Cleanup the event listener on component unmount
    return () => {
      darkModeMediaQuery.removeEventListener("change", handleDarkModeChange);
    };
  }, []);

  useEffect(() => {
    // Initialize the socket connection inside useEffect
    socket = io("https://mint-mountain-accordion.glitch.me/", {
      withCredentials: true, // Allow credentials for CORS
      transports: ["websocket", "polling"], // Use both WebSocket and polling
    });

    // Listen for real-time updates from the server
    socket.on("machineData", (updatedMachines: Machine[]) => {
      console.log("Received updated machine data:", updatedMachines); // Log the updates

      // Update the machines state with new data from the server]
      setLastUpdated(new Date());
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
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

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

  const getAvailableMachinesCount = useCallback((type: "washer" | "dryer") => {
    return machines.filter(
      (machine) => machine.type === type && machine.status === "available"
    ).length
  }, [machines])

  const getEstimatedWaitTime = useCallback((type: "washer" | "dryer") => {
    const inUseMachines = machines.filter(
      (machine) => machine.type === type && machine.status === "in-use"
    )
    if (inUseMachines.length === 0) return 0
    const avgTimeRemaining =
      inUseMachines.reduce(
        (sum, machine) => sum + (machine.timeRemaining || 0),
        0
      ) / inUseMachines.length
    return Math.ceil(avgTimeRemaining)
  }, [machines])

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

  const handleSelectMachine = (machineId: string) => {
    setSelectedMachineId(machineId);
  };

  const sortMachines = useCallback(
    (machines: Machine[], type: "washer" | "dryer") => {
      return machines
        .filter((machine) => machine.type === type)
        .filter((machine) => {
          if (filterStatus === "all") return true;
          if (filterStatus === "available")
            return machine.status === "available";
          if (filterStatus === "finishing-soon")
            return machine.status === "finishing-soon";
          return true;
        })
        .filter((machine) =>
          machine.id.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
          if (sortBy === "id") {
            return (
              parseInt(a.id.replace(/\D/g, ""), 10) -
              parseInt(b.id.replace(/\D/g, ""), 10)
            );
          }
          if (sortBy === "status") {
            return a.status.localeCompare(b.status);
          }
          if (sortBy === "timeRemaining") {
            return (a.timeRemaining || 0) - (b.timeRemaining || 0);
          }
          return 0;
        });
    },
    [filterStatus, searchQuery, sortBy]
  );

  const washers = useMemo(() => sortMachines(machines, "washer"), [machines, sortMachines])
  const dryers = useMemo(() => sortMachines(machines, "dryer"), [machines, sortMachines])

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return "Never";
    return date.toLocaleTimeString();
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "dark" : ""}`}>
      {" "}
      <div className="container mx-auto px-4 py-8 flex-grow">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-3xl font-bold text-center sm:text-left">
            DLLM Laundry Monitor
          </h1>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button
              onClick={() => setIsFloorplanOpen(true)}
              className="w-full sm:w-auto"
            >
              <MapPin className="mr-2 h-4 w-4" /> Floorplan
            </Button>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              {" "}
              <RefreshCw className="mr-2 h-4 w-4" />
              Last updated: {formatLastUpdated(lastUpdated)}
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
                className="ml-2"
              />
              {isDarkMode ? (
                <Moon className="h-4 w-4 text-gray-400" />
              ) : (
                <Sun className="h-4 w-4 text-yellow-400" />
              )}
            </div>
            {/* 
<Button variant="outline" size="icon" onClick={handleNotificationToggle}>
  <Bell className="h-4 w-4" />
</Button>
*/}
          </div>
        </header>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex space-x-2">
            <Badge variant="secondary">
              Available Washers: {getAvailableMachinesCount("washer")}
            </Badge>
            <Badge variant="secondary">
              Available Dryers: {getAvailableMachinesCount("dryer")}
            </Badge>
          </div>
          <div className="flex space-x-2">
            <Badge variant="outline">
              Est. Washer Wait: {getEstimatedWaitTime("washer")} min
            </Badge>
            <Badge variant="outline">
              Est. Dryer Wait: {getEstimatedWaitTime("dryer")} min
            </Badge>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search machines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="finishing-soon">Finishing Soon</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id">Machine ID</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="timeRemaining">Time Remaining</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-8">
          {["Washers", "Dryers"].map((type) => (
            <section
              key={type}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              {" "}
              <h2 className="text-2xl font-semibold mb-4">{type}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {(type === "Washers" ? washers : dryers).map((machine) => (
                  <MachineCard
                    key={machine.id}
                    machine={machine}
                    getStatusColor={getStatusColor}
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
          <DialogContent className="w-full max-w-3xl h-[80vh] overflow-auto">
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
            <DialogClose asChild>
              <Button className="w-full mt-4">Close</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
      <footer className="p-4 bg-white dark:bg-gray-800 shadow-sm mt-auto">
        <p className="text-center text-sm text-muted-foreground">
          DLLM Laundry - Smart IoT-based Laundry Management
        </p>
      </footer>
    </div>
  );
}
