import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { WelcomeScreenProps } from './types'

export function WelcomeScreen({ isOpen, onClose }: WelcomeScreenProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('welcomeScreenSeen', 'true')
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-[90vw] sm:max-w-[425px] p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center">Welcome to DLLM Laundry Monitor</DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-center">
            Your smart solution for efficient laundry management
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <h3 className="font-medium mb-2 text-base sm:text-lg">Key Features:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base">
            <li>Real-time machine status updates</li>
            <li>Estimated wait times for washers and dryers</li>
            <li>Interactive laundry room floorplan</li>
            <li>Dark mode for comfortable viewing</li>
          </ul>
        </div>
        <DialogFooter className="flex-col sm:flex-row items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dontShowAgain"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
            />
            <label
              htmlFor="dontShowAgain"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Don't show this again
            </label>
          </div>
          <Button onClick={handleClose} className="w-full sm:w-auto">Get Started</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}