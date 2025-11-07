import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Wifi,
  Battery,
  BarChart,
  Bell,
  Clock,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDarkMode } from "@/contexts/DarkModeContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export default function AboutUs() {
  const { isDarkMode } = useDarkMode();

  return (
    <motion.div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div variants={itemVariants}>
          <Link to="/">
            <Button
              variant="ghost"
              className={`mb-4 ${isDarkMode ? "text-white hover:bg-gray-800" : "text-gray-900 hover:bg-gray-100"}`}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Laundry Monitor
            </Button>
          </Link>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card
            className={`mb-8 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}
          >
            <CardHeader>
              <CardTitle
                className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                About DLLM Laundry Monitor
              </CardTitle>
              <CardDescription
                className={isDarkMode ? "text-gray-300" : "text-gray-600"}
              >
                Smart IoT-based Laundry Management System for RVRC
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.p
                className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                variants={itemVariants}
              >
                DLLM (Don't Leave Laundry Messy) Laundry Monitor is an
                innovative solution designed to streamline the laundry
                experience at Ridge View Residential College (RVRC). Our system
                provides real-time updates on machine availability, estimated
                wait times, and personalized features to make your laundry
                routine more efficient and less time-consuming.
              </motion.p>
              <motion.h2
                className={`text-2xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                variants={itemVariants}
              >
                Key Features
              </motion.h2>
              <motion.ul
                className="list-disc list-inside mb-4 space-y-2"
                variants={containerVariants}
              >
                {[
                  {
                    icon: Clock,
                    text: "Real-time machine status updates and estimated wait times",
                  },
                  {
                    icon: Users,
                    text: "Crowd level monitoring in the laundry room",
                  },
                  {
                    icon: Bell,
                    text: "Notifications when your laundry is complete",
                  },
                  {
                    icon: BarChart,
                    text: "Predictive analytics for optimal laundry times",
                  },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className={`flex items-center ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    variants={listItemVariants}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.text}
                  </motion.li>
                ))}
              </motion.ul>
              <motion.h2
                className={`text-2xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                variants={itemVariants}
              >
                How It Works
              </motion.h2>
              <motion.ol
                className="list-decimal list-inside mb-4 space-y-2"
                variants={containerVariants}
              >
                {[
                  "IoT devices with vibration sensors detect machine usage",
                  "ESP32-S3-EYE cameras monitor crowd levels",
                  "Data is sent to the cloud for real-time processing",
                  "Machine learning models predict availability and busy times",
                  "Users receive updates and notifications via the mobile app",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                    variants={listItemVariants}
                  >
                    {item}
                  </motion.li>
                ))}
              </motion.ol>
              <motion.h2
                className={`text-2xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                variants={itemVariants}
              >
                Technology Stack
              </motion.h2>
              <motion.ul
                className="list-disc list-inside mb-4 space-y-2"
                variants={containerVariants}
              >
                {[
                  {
                    icon: Wifi,
                    text: "ESP32 microcontrollers for wireless data transmission",
                  },
                  {
                    icon: Battery,
                    text: "Power banks for stable power supply",
                  },
                  {
                    icon: BarChart,
                    text: "Cloud-based machine learning for predictive analytics",
                  },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className={`flex items-center ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    variants={listItemVariants}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.text}
                  </motion.li>
                ))}
              </motion.ul>
              <motion.p
                className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                variants={itemVariants}
              >
                Our team is committed to optimizing laundry room usage and
                saving students' time. We're constantly working on improving our
                system and adding new features to enhance your laundry
                experience.
              </motion.p>
              <motion.p
                className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                variants={itemVariants}
              >
                For any issues, feedback, or suggestions, please contact our
                support team at dllmnus@googlegroups.com
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

