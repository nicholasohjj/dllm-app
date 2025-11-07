import { useState, useEffect, useCallback, useMemo } from "react";
import { MapPin, RefreshCw, Search, Sun, Moon, Info, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
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
import { LaundryFloorplan } from "@/components/laundry/LaundryFloorplan";
import { MachineCard } from "@/components/laundry/MachineCard";
import { Machine } from "@/types/machine.types";
import { Skeleton } from "@/components/ui/skeleton";
import WelcomeScreen from "@/components/layout/WelcomeScreen";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.svg";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useMachineSetup } from "@/hooks/useMachineSetup";

export function LaundryMonitorComponent() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();
  const [machines, setMachines] = useState<Machine[]>(useMachineSetup());
  const [isFloorplanOpen, setIsFloorplanOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedmachineID, setSelectedmachineID] = useState<string | null>(
    null
  );
  const { isDarkMode, toggleDarkMode } = useDarkMode(); // Use the hook to access dark mode state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("id");
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);
  const [preferredMachines, setPreferredMachines] = useState<string[]>([]);
  const lambdaUrl = import.meta.env.VITE_REACT_APP_LAMBDA_URL; // Access the Lambda URL from Vite environment variables

  // Fetch data from Lambda URL
  const fetchMachineStatus = useCallback(async () => {
    try {
      const response = await fetch(lambdaUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text(); // Get response as text
        console.error("Fetch error response:", errorText); // Log error response
        throw new Error("Failed to fetch machine data");
      }

      const data = await response.json();
      console.log("Fetched machine data:", data);
      setMachines(data.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching machine status:", error);
    } finally {
      setIsLoading(false);
    }
  }, [lambdaUrl]);

  // Fetch machine data when the component mounts and every 5 minutes thereafter
  useEffect(() => {
    fetchMachineStatus(); // Fetch data when component mounts

    const intervalId = setInterval(fetchMachineStatus, 30000); // Fetch every 5 minutes (300,000 ms)
    setLastUpdated(new Date()); // Update last updated time

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [fetchMachineStatus]);

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const machineCardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  useEffect(() => {
    if ("Notification" in window && "PushManager" in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((subscription) => {
          setIsSubscribed(!!subscription);
        });
      });
    }
  }, []);

  useEffect(() => {
    // Check system preference for dark mode
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    // Set the initial dark mode state based on system preference
    toggleDarkMode();

    // Listen for changes in the system preference and update accordingly
    const handleDarkModeChange = () => {
      toggleDarkMode();
    };

    darkModeMediaQuery.addEventListener("change", handleDarkModeChange);

    // Cleanup the event listener on component unmount
    return () => {
      darkModeMediaQuery.removeEventListener("change", handleDarkModeChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const welcomeScreenSeen = localStorage.getItem("welcomeScreenSeen");
    if (!welcomeScreenSeen) {
      setShowWelcomeScreen(true);
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const savedPreferences = localStorage.getItem("preferredMachines");
    if (savedPreferences) {
      setPreferredMachines(JSON.parse(savedPreferences));
    }
  }, []);

  useEffect(() => {
    // Check if the user has a saved preference
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      toggleDarkMode();
    } else {
      // If no preference is saved, use system preference
      const darkModeMediaQuery = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );
      toggleDarkMode();

      // Listen for system preference changes
      const handleDarkModeChange = () => {
        toggleDarkMode();
      };
      darkModeMediaQuery.addEventListener("change", handleDarkModeChange);

      return () => {
        darkModeMediaQuery.removeEventListener("change", handleDarkModeChange);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subscribeToPushNotifications = useCallback(async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast({
          title: "Permission Denied",
          description: "You need to enable notifications to subscribe.",
          variant: "destructive",
        });
        return;
      }

      setIsSubscribed(true);
      toast({
        title: "Subscribed",
        description: "You will receive push notifications.",
      });
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Error",
        description: "Failed to subscribe to push notifications.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Push Notification unsubscription logic
  const unsubscribeFromPushNotifications = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();

        // Notify the server to remove the subscription
        await sendUnsubscriptionToServer(subscription);

        setIsSubscribed(false);
        toast({
          title: "Unsubscribed",
          description: "You have unsubscribed from push notifications.",
        });
      }
    } catch (error) {
      console.error("Unsubscription error:", error);
      toast({
        title: "Error",
        description: "Failed to unsubscribe from push notifications.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const sendUnsubscriptionToServer = async (
    subscription: PushSubscription | null
  ) => {
    if (!subscription) return; // Handle null case
    try {
      await fetch("/api/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });
    } catch (error) {
      console.error("Failed to send unsubscription to the server:", error);
    }
  };

  const togglePreferredMachine = (machineID: string) => {
    setPreferredMachines((prev) => {
      const newPreferences = prev.includes(machineID)
        ? prev.filter((id) => id !== machineID)
        : [...prev, machineID];
      localStorage.setItem("preferredMachines", JSON.stringify(newPreferences));
      return newPreferences;
    });
  };

  useEffect(() => {
    // Register the service worker for push notifications
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(function (registration) {
          registration.update(); // Ensures the latest SW is used
          console.log("Service Worker registered", registration);
        })
        .catch(function (error) {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  const getAvailableMachinesCount = useCallback(
    (type: "washer" | "dryer") => {
      return machines.filter(
        (machine) => machine.type === type && machine.status === "available"
      ).length;
    },
    [machines]
  );

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

  const handleSelectMachine = (machineID: string) => {
    setSelectedmachineID(machineID);
  };

  const sortMachines = useCallback(
    (machines: Machine[], type: "washer" | "dryer") => {
      return machines
        .filter((machine) => machine.type === type)
        .filter((machine) => {
          if (filterStatus === "all") return true;
          if (filterStatus === "available")
            return machine.status === "available";
          if (filterStatus === "in-use") return machine.status === "in-use";
          return true;
        })
        .filter((machine) =>
          machine.machineID.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
          if (sortBy === "id") {
            return (
              parseInt(a.machineID.replace(/\D/g, ""), 10) -
              parseInt(b.machineID.replace(/\D/g, ""), 10)
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

  const washers = useMemo(
    () => sortMachines(machines, "washer"),
    [machines, sortMachines]
  );
  const dryers = useMemo(
    () => sortMachines(machines, "dryer"),
    [machines, sortMachines]
  );

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return "Never";
    return date.toLocaleTimeString();
  };

  const renderMachineSection = (type: "Washers" | "Dryers") => (
    <motion.section
      key={type}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
    >
      <h2 className="text-2xl font-semibold mb-4">{type}</h2>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {(type === "Washers" ? washers : dryers).map((machine) => (
              <motion.div
                key={machine.machineID}
                variants={machineCardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                layout
              >
                <MachineCard
                  key={machine.machineID}
                  machine={machine}
                  getStatusColor={getStatusColor}
                  isOpen={selectedmachineID === machine.machineID}
                  onClose={() => setSelectedmachineID(null)}
                  onClick={() => setSelectedmachineID(machine.machineID)}
                  isPreferred={preferredMachines.includes(machine.machineID)}
                  onTogglePreferred={() =>
                    togglePreferredMachine(machine.machineID)
                  }
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.section>
  );

  const handleDarkModeToggle = (checked: boolean) => {
    toggleDarkMode();
    localStorage.setItem("darkMode", checked.toString());
  };

  return (
    <motion.div
      className={`min-h-screen flex flex-col ${isDarkMode ? "dark" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {" "}
      <div className="container mx-auto px-4 py-8 flex-grow">
        <motion.header
          className="flex flex-col lg:flex-row justify-between items-center mb-8 space-y-4 lg:space-y-0"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          {" "}
          <div className="flex flex-col sm:flex-row items-center sm:space-x-4">
            {" "}
            <img
              src={logo}
              alt="DLLM Laundry Monitor"
              className="h-16 w-16 sm:h-20 sm:w-20 mb-2 sm:mb-0"
            />
            <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
              Laundry Monitor
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button
              onClick={() => setIsFloorplanOpen(true)}
              className="w-full sm:w-auto"
            >
              <MapPin className="mr-2 h-4 w-4" /> Floorplan
            </Button>
            <Link to="/about">
              <Button variant="outline" className="w-full sm:w-auto">
                <Info className="mr-2 h-4 w-4" /> About Us
              </Button>
            </Link>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              {" "}
              <RefreshCw className="mr-2 h-4 w-4" />
              Last updated: {formatLastUpdated(lastUpdated)}
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={isDarkMode}
                onCheckedChange={handleDarkModeToggle}
                className="ml-2"
              />
              {isDarkMode ? (
                <Moon className="h-4 w-4 text-gray-400" />
              ) : (
                <Sun className="h-4 w-4 text-yellow-400" />
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={
                isSubscribed
                  ? unsubscribeFromPushNotifications
                  : subscribeToPushNotifications
              }
            >
              <Bell
                className={`h-4 w-4 ${isSubscribed ? "text-green-500" : ""}`}
              />
            </Button>
          </div>
        </motion.header>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex space-x-2">
            <Badge variant="secondary">
              Available Washers: {getAvailableMachinesCount("washer")}
            </Badge>
            <Badge variant="secondary">
              Available Dryers: {getAvailableMachinesCount("dryer")}
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
              <SelectItem value="in-use">In use</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id">Machine ID</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {preferredMachines.length > 0 && (
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Preferred Machines</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {machines
                .filter((machine) =>
                  preferredMachines.includes(machine.machineID)
                )
                .map((machine) => (
                  <MachineCard
                    key={machine.machineID}
                    machine={machine}
                    getStatusColor={getStatusColor}
                    isOpen={selectedmachineID === machine.machineID}
                    onClose={() => setSelectedmachineID(null)}
                    onClick={() => setSelectedmachineID(machine.machineID)}
                    isPreferred={true}
                    onTogglePreferred={() =>
                      togglePreferredMachine(machine.machineID)
                    }
                  />
                ))}
            </div>
          </section>
        )}

        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {" "}
          {renderMachineSection("Washers")}
          {renderMachineSection("Dryers")}
        </motion.div>

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

        <WelcomeScreen
          isOpen={showWelcomeScreen}
          onClose={() => setShowWelcomeScreen(false)}
        />
      </div>
      <footer className="p-4 bg-white dark:bg-gray-800 shadow-sm mt-auto">
        <p className="text-center text-sm text-muted-foreground">
          DLLM Laundry - Smart IoT-based Laundry Management
        </p>
      </footer>
    </motion.div>
  );
}

