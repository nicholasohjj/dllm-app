import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { WelcomeScreenProps } from "@/types/machine.types";

const WelcomeScreen = ({ isOpen, onClose }: WelcomeScreenProps) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("welcomeScreenSeen", "true");
    }
    onClose();
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96],
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="w-full max-w-[90vw] sm:max-w-[425px] p-4 sm:p-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DialogHeader className="space-y-2">
                <motion.div variants={itemVariants}>
                  <DialogTitle className="text-xl sm:text-2xl font-bold text-center">
                    Welcome to DLLM Laundry Monitor
                  </DialogTitle>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <DialogDescription className="text-sm sm:text-base text-center">
                    Your smart solution for efficient laundry management
                  </DialogDescription>
                </motion.div>
              </DialogHeader>
              <motion.div className="py-4" variants={itemVariants}>
                <h3 className="font-medium mb-2 text-base sm:text-lg">
                  Key Features:
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base">
                  <motion.li variants={itemVariants}>
                    Real-time machine status updates
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    Estimated wait times for washers and dryers
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    Interactive laundry room floorplan
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    Dark mode for comfortable viewing
                  </motion.li>
                </ul>
              </motion.div>
              <DialogFooter className="flex-col sm:flex-row items-center sm:justify-between space-y-4 sm:space-y-0">
                <motion.div
                  className="flex items-center space-x-2"
                  variants={itemVariants}
                >
                  <Checkbox
                    id="dontShowAgain"
                    checked={dontShowAgain}
                    onCheckedChange={(checked) =>
                      setDontShowAgain(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="dontShowAgain"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Don't show this again
                  </label>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Button onClick={handleClose} className="w-full sm:w-auto">
                    Get Started
                  </Button>
                </motion.div>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;
