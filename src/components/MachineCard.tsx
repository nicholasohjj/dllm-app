import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "./ui/button";
import { Loader2, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Machine } from "./types";

interface MachineCardProps {
  machine: Machine;
  getStatusColor: (status: Machine["status"]) => string;
  isOpen: boolean; // Control dialog visibility from parent
  onClose: () => void; // Parent function to handle closing the dialog
  onClick: () => void; // Handle click on card to open dialog
}

export function MachineCard({
  machine,
  getStatusColor,
  isOpen,
  onClose,
  onClick,
}: MachineCardProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (machine.status === "in-use" || machine.status === "finishing-soon") {
      const totalTime = 34; // Assuming 34 minutes max time
      const remaining = machine.timeRemaining || 0;

      // Calculate progress based on time remaining
      const initialPercentage = ((totalTime - remaining) / totalTime) * 100;
      setProgress(initialPercentage);
    } else if (machine.status === "complete") {
      setProgress(100); // Mark complete
    }
  }, [machine.status, machine.timeRemaining]);

  const getTimeEstimate = () => {
    if (progress < 30) return "More than 20 minutes remaining";
    if (progress < 60) return "Less than 20 minutes remaining";
    if (progress < 90) return "Finishing soon...";
    return "Almost done!";
  };

  const getStatusIcon = useCallback(() => {
    switch (machine.status) {
      case "in-use":
      case "finishing-soon":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "complete":
        return <CheckCircle2 className="h-5 w-5 text-blue-500" />;
      case "available":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  }, [machine.status]);

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={onClick}
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span>
              {machine.type === "washer" ? "Washer" : "Dryer"}{" "}
              {machine.shortName}
            </span>
            {getStatusIcon()}
          </CardTitle>
          <CardDescription>
            <Badge
              variant="secondary"
              className={`${getStatusColor(machine.status)} text-white`}
            >
              {machine.status.replace("-", " ")}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {machine.status === "in-use" ||
          machine.status === "finishing-soon" ? (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                {getTimeEstimate()}
              </p>
            </div>
          ) : machine.status === "complete" ? (
            <p className="text-sm font-medium text-blue-600">
              Ready for pickup!
            </p>
          ) : machine.status === "available" ? (
            <p className="text-sm font-medium text-green-600">
              Start your laundry now!
            </p>
          ) : (
            <p className="text-sm font-medium text-gray-600">
              This machine is not supported.
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={onClose} key={machine.id}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {machine.type === "washer" ? "Washer" : "Dryer"}{" "}
              {machine.shortName} Details
            </DialogTitle>
            <DialogDescription>
              Current status: {machine.status.replace("-", " ")}
            </DialogDescription>
          </DialogHeader>
          {machine.status === "in-use" ||
          machine.status === "finishing-soon" ? (
            <div className="space-y-4">
              <Progress value={progress} className="w-full" />
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{getTimeEstimate()}</span>
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            </div>
          ) : machine.status === "complete" ? (
            <div className="space-y-4">
              <p className="text-center text-lg font-medium text-blue-600">
                Your laundry is ready for pickup!
              </p>
            </div>
          ) : machine.status === "available" ? (
            <div className="space-y-4">
              <p className="text-center text-lg font-medium text-green-600">
                This machine is available for use.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-lg font-medium text-gray-600">
                This machine is not supported.
              </p>
            </div>
          )}
          <DialogClose asChild>
            <Button className="w-full mt-4">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}
