"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import logo from "@/assets/logo.svg";

interface SplashScreenProps {
  onFinished: () => void;
  duration?: number;
  logoSize?: number;
  title?: string;
  subtitle?: string;
}

export default function SplashScreen({
  onFinished,
  duration = 3000,
  logoSize = 128,
  title = "DLLM Laundry Monitor",
  subtitle = "Smart IoT-based Laundry Management",
}: SplashScreenProps) {
  const [showLoader, setShowLoader] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const loaderTimer = setTimeout(() => {
      setShowLoader(true);
    }, duration / 3);

    const finishTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => {
      clearTimeout(loaderTimer);
      clearTimeout(finishTimer);
    };
  }, [duration]);

  return (
    <AnimatePresence onExitComplete={onFinished}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center z-50"
        >
          <div className="text-center px-4">
            <motion.img
              src={logo}
              alt="DLLM Laundry Monitor Logo"
              width={logoSize}
              height={logoSize}
              className="mb-8 mx-auto"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.h1
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {title}
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl text-white mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {subtitle}
            </motion.p>
            <AnimatePresence>
              {showLoader && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Loader2
                    className="w-8 h-8 text-white animate-spin mx-auto"
                    aria-label="Loading"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
