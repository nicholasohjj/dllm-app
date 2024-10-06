import { useEffect, useState, useCallback, useMemo } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState(
    machine.timeRemaining || 0
  );
  const { toast } = useToast();

  useEffect(() => {
    if (machine.status === "in-use" || machine.status === "finishing-soon") {
      const totalTime = 34; // Assuming 34 minutes max time
      const remaining = machine.timeRemaining || 0;
      setRemainingTime(remaining);

      // Calculate progress based on time remaining
      const initialPercentage = ((totalTime - remaining) / totalTime) * 100;
      setProgress(initialPercentage);
    } else if (machine.status === "complete") {
      setProgress(100); // Mark complete
    }
  }, [machine.status, machine.timeRemaining]);

  const getTimeEstimate = useCallback(() => {
    if (remainingTime > 20 * 60) return "More than 20 minutes remaining";
    if (remainingTime > 10 * 60) return "Less than 20 minutes remaining";
    if (remainingTime > 5 * 60) return "Finishing soon...";
    return "Almost done!";
  }, [remainingTime]);

  const getStatusIcon = useMemo(() => {
    switch (machine.status) {
      case "in-use":
      case "finishing-soon":
        return <Clock className="h-5 w-5 text-yellow-500" aria-hidden="true" />;
      case "complete":
        return (
          <CheckCircle2 className="h-5 w-5 text-blue-500" aria-hidden="true" />
        );
      case "available":
        return (
          <CheckCircle2 className="h-5 w-5 text-green-500" aria-hidden="true" />
        );
      default:
        return (
          <AlertCircle className="h-5 w-5 text-gray-500" aria-hidden="true" />
        );
    }
  }, [machine.status]);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  const cardContent = useMemo(() => {
    if (error) {
      return (
        <p className="text-sm font-medium text-red-600">
          Error: {error}. Please try again later.
        </p>
      );
    }

    switch (machine.status) {
      case "in-use":
      case "finishing-soon":
        return (
          <div className="space-y-2">
            <Progress
              value={progress}
              className="w-full"
              aria-label={`${Math.round(progress)}% complete`}
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {getTimeEstimate()}
              </p>
              <p className="text-sm font-medium">{formatTime(remainingTime)}</p>
            </div>
          </div>
        );
      case "complete":
        return (
          <p className="text-sm font-medium text-blue-600">Ready for pickup!</p>
        );
      case "available":
        return (
          <p className="text-sm font-medium text-green-600">
            Start your laundry now!
          </p>
        );
      default:
        return (
          <p className="text-sm font-medium text-gray-600">
            This machine is not supported.
          </p>
        );
    }
  }, [
    error,
    machine.status,
    progress,
    getTimeEstimate,
    remainingTime,
    formatTime,
  ]);

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
            {getStatusIcon}
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
        <CardContent>{cardContent}</CardContent>
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
          {error ? (
            <p className="text-center text-lg font-medium text-red-600">
              Error: {error}. Please try again later.
            </p>
          ) : (
            <>
              {(machine.status === "in-use" ||
                machine.status === "finishing-soon") && (
                <div className="space-y-4">
                  <Progress
                    value={progress}
                    className="w-full"
                    aria-label={`${Math.round(progress)}% complete`}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">
                      {formatTime(remainingTime)}
                    </span>
                    <Loader2
                      className="h-6 w-6 animate-spin"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-2xl font-bold">
                    {getTimeEstimate()}
                  </span>
                </div>
              )}
              {machine.status === "complete" && (
                <div className="space-y-4">
                  <p className="text-center text-lg font-medium text-blue-600">
                    Your laundry is ready for pickup!
                  </p>
                </div>
              )}
              {machine.status === "available" && (
                <div className="space-y-4">
                  <p className="text-center text-lg font-medium text-green-600">
                    This machine is available for use.
                  </p>
                </div>
              )}
              {machine.status === "disabled" && (
                <div className="space-y-4">
                  <p className="text-center text-lg font-medium text-gray-600">
                    This machine is not supported.
                  </p>
                </div>
              )}
            </>
          )}
          <DialogClose asChild>
            <Button className="w-full mt-4">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}
