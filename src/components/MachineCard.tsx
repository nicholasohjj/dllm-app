"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Button } from "./ui/button"
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Star,
} from "lucide-react"
import { Machine } from "./types"

interface MachineCardProps {
  machine: Machine
  getStatusColor: (status: Machine["status"]) => string
  isOpen: boolean
  onClose: () => void
  onClick: () => void
  isPreferred: boolean
  onTogglePreferred: () => void
}

export function MachineCard({
  machine,
  getStatusColor,
  isOpen,
  onClose,
  onClick,
  isPreferred,
  onTogglePreferred,
}: MachineCardProps) {
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (machine.status === "in-use" || machine.status === "finishing-soon") {
      // Simulate progress based on status
      setProgress(machine.status === "finishing-soon" ? 75 : 50)
    } else if (machine.status === "complete") {
      setProgress(100)
    }
  }, [machine.status])

  const getTimeEstimate = useCallback(() => {
    switch (machine.status) {
      case "in-use":
        return "In use"
      case "finishing-soon":
        return "Finishing soon..."
      case "complete":
        return "Complete"
      case "available":
        return "Available"
      default:
        return "Status unknown"
    }
  }, [machine.status])

  const getStatusIcon = useMemo(() => {
    switch (machine.status) {
      case "in-use":
      case "finishing-soon":
        return <Clock className="h-5 w-5 text-yellow-500" aria-hidden="true" />
      case "complete":
        return <CheckCircle2 className="h-5 w-5 text-blue-500" aria-hidden="true" />
      case "available":
        return <CheckCircle2 className="h-5 w-5 text-green-500" aria-hidden="true" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" aria-hidden="true" />
    }
  }, [machine.status])

  const cardContent = useMemo(() => {
    if (error) {
      return (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-sm font-medium text-red-600"
        >
          Error: {error}. Please try again later.
        </motion.p>
      )
    }

    switch (machine.status) {
      case "in-use":
      case "finishing-soon":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <Progress
              value={progress}
              className="w-full"
              aria-label={`${Math.round(progress)}% complete`}
            />
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-between items-center"
            >
              <p className="text-sm text-muted-foreground">
                {getTimeEstimate()}
              </p>
            </motion.div>
          </motion.div>
        )
      case "complete":
        return (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm font-medium text-blue-600"
          >
            Ready for pickup!
          </motion.p>
        )
      case "available":
        return (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm font-medium text-green-600"
          >
            Start your laundry now!
          </motion.p>
        )
      default:
        return (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm font-medium text-gray-600"
          >
            This machine is not supported.
          </motion.p>
        )
    }
  }, [error, machine.status, progress, getTimeEstimate])

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={onClick}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <motion.span layout>
                {machine.type === "washer" ? "Washer" : "Dryer"}{" "}
                {machine.shortName}
              </motion.span>
              <motion.div layout className="flex items-center space-x-2">
                {getStatusIcon}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    onTogglePreferred()
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                  >
                    <Star
                      className={`h-5 w-5 ${
                        isPreferred ? "text-yellow-400 fill-current" : "text-gray-400"
                      }`}
                    />
                  </motion.div>
                  <span className="sr-only">
                    {isPreferred ? "Remove from preferred" : "Add to preferred"}
                  </span>
                </Button>
              </motion.div>
            </CardTitle>
            <CardDescription>
              <motion.div layout>
                <Badge
                  variant="secondary"
                  className={`${getStatusColor(machine.status)} text-white`}
                >
                  {machine.status.replace("-", " ")}
                </Badge>
              </motion.div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {cardContent}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
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
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        <Progress
                          value={progress}
                          className="w-full"
                          aria-label={`${Math.round(progress)}% complete`}
                        />
                        <motion.div
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="flex justify-between items-center"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          >
                            <Loader2
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          </motion.div>
                        </motion.div>
                        <motion.span
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-2xl font-bold"
                        >
                          {getTimeEstimate()}
                        </motion.span>
                      </motion.div>
                    )}
                    {machine.status === "complete" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        <p className="text-center text-lg font-medium text-blue-600">
                          Your laundry is ready for pickup!
                        </p>
                      </motion.div>
                    )}
                    {machine.status === "available" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        <p className="text-center text-lg font-medium text-green-600">
                          This machine is available for use.
                        </p>
                      </motion.div>
                    )}
                    {machine.status === "disabled" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        <p className="text-center text-lg font-medium text-gray-600">
                          This machine is not supported.
                        </p>
                      </motion.div>
                    )}
                  </>
                )}
                <DialogClose asChild>
                  <Button className="w-full mt-4">Close</Button>
                </DialogClose>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  )
}