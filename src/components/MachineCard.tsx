import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Machine = {
  id: number;
  type: "washer" | "dryer";
  status: "available" | "in-use" | "finishing-soon" | "complete" | "disabled";
  timeRemaining: number; // In minutes
  position: { x: number; y: number };
};

interface MachineCardProps {
  machine: Machine;
  getStatusColor: (status: Machine["status"]) => string;
  handleNotification: () => void;
  setMachines: (updatedMachines: Machine[]) => void;
  machines: Machine[];
  isOpen: boolean; // Control dialog visibility from parent
  onClose: () => void; // Parent function to handle closing the dialog
  onClick: () => void; // Handle click on card to open dialog
}

export function MachineCard({
  machine,
  getStatusColor,
  handleNotification,
  setMachines,
  machines,
  isOpen,
  onClose,
  onClick,
}: MachineCardProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (machine.status === "in-use" || machine.status === "finishing-soon") {
      // Simulate smooth progress over time, but never reveal the actual remaining time
      interval = setInterval(() => {
        setProgress((prev) => {
          // Increment progress but cap it below 100%
          if (prev < 95) {
            return prev + Math.random() * 3; // Random small increments for smoothness
          }
          return prev;
        });
      }, 2000); // Update every 2 seconds for smoothness
    }

    if (machine.status === "complete") {
      // Instantly set progress to 100% when machine is done
      setProgress(100);
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [machine.status]);

  const getTimeEstimate = () => {
    if (progress < 30) return "More than 20 minutes remaining";
    if (progress < 60) return "Less than 20 minutes remaining";
    if (progress < 90) return "Finishing soon...";
    return "Almost done!";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} key={machine.id}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
        <CardHeader className="pb-2">
          <CardTitle>{machine.type === "washer" ? "Washer" : "Dryer"} {machine.id}</CardTitle>
          <CardDescription>
            <Badge variant="secondary" className={`${getStatusColor(machine.status)} text-white`}>
              {machine.status.replace("-", " ")}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {machine.status === "in-use" || machine.status === "finishing-soon" ? (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                {getTimeEstimate()}
              </p>
            </div>
          ) : machine.status === "complete" ? (
            <p className="text-sm font-medium text-blue-600">Ready for pickup!</p>
          ) : (
            <p className="text-sm font-medium text-green-600">Start your laundry now!</p>
          )}
        </CardContent>
      </Card>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{machine.type === "washer" ? "Washer" : "Dryer"} {machine.id} Details</DialogTitle>
          <DialogDescription>
            Current status: {machine.status.replace("-", " ")}
          </DialogDescription>
        </DialogHeader>
        {machine.status === "in-use" || machine.status === "finishing-soon" ? (
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">
                {getTimeEstimate()}
              </span>
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
            <Button className="w-full" onClick={handleNotification}>
              Notify me when complete
            </Button>
          </div>
        ) : machine.status === "complete" ? (
          <div className="space-y-4">
            <p className="text-center text-lg font-medium text-blue-600">Your laundry is ready for pickup!</p>
            <Button
              className="w-full"
              onClick={() =>
                setMachines(
                  machines.map((m) =>
                    m.id === machine.id ? { ...m, status: "available", timeRemaining: 0 } : m
                  )
                )
              }
            >
              Mark as collected
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-lg font-medium text-green-600">This machine is available for use.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
