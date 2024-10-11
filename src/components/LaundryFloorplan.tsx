import { Machine } from "./types";
import { motion, AnimatePresence } from "framer-motion";

type LaundryFloorplanProps = {
  machines: Machine[];
  onSelectMachine: (machineId: string) => void;
};

export function LaundryFloorplan({
  machines,
  onSelectMachine,
}: LaundryFloorplanProps) {
  const getFillColor = (status: Machine["status"]) => {
    switch (status) {
      case "available":
        return "#4CAF50"; // Hex color for green
      case "in-use":
        return "#FFC107"; // Hex color for yellow
      case "finishing-soon":
        return "#FF9800"; // Hex color for orange
      case "complete":
        return "#2196F3"; // Hex color for blue
      case "disabled":
        return "#BDBDBD"; // Hex color for grey
      default:
        return "#9E9E9E"; // Default grey
    }
  };

  const legendItems = [
    { status: "available", label: "Available" },
    { status: "in-use", label: "In Use" },
    { status: "finishing-soon", label: "Finishing Soon" },
    { status: "complete", label: "Complete" },
    { status: "disabled", label: "Disabled" },
  ] as const;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const machineVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    hover: { scale: 1.2, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex flex-wrap justify-center gap-4 p-4 bg-background rounded-lg shadow"
        variants={itemVariants}
      >
        {legendItems.map((item) => (
          <motion.div
            key={item.status}
            className="flex items-center gap-2"
            variants={itemVariants}
          >
            <motion.div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: getFillColor(item.status) }}
              aria-hidden="true"
              whileHover={{ scale: 1.2 }}
            />
            <span className="text-sm font-medium">{item.label}</span>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        className="relative w-full h-[60vh] bg-gray-100 rounded-lg overflow-hidden"
        variants={itemVariants}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 160"
          className="absolute inset-0"
          aria-label="Laundry room floorplan"
        >
          <motion.rect
            x="10"
            y="10"
            width="80"
            height="140"
            fill="none"
            stroke="black"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          <motion.text
            x="50"
            y="5"
            textAnchor="middle"
            fontSize="3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Entrance
          </motion.text>
          <AnimatePresence>
            {machines.map((machine) => (
              <motion.g
                key={machine.id}
                onClick={() =>
                  machine.status !== "disabled" && onSelectMachine(machine.id)
                }
                className={
                  machine.status === "disabled"
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
                variants={machineVariants}
                whileHover="hover"
              >
                <motion.circle
                  cx={machine.position.x}
                  cy={machine.position.y}
                  r="5"
                  fill={getFillColor(machine.status)}
                  className={
                    machine.status !== "disabled"
                      ? "hover:stroke-2 hover:stroke-gray-700"
                      : ""
                  }
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                <motion.text
                  x={machine.position.x}
                  y={machine.position.y + 8}
                  textAnchor="middle"
                  fontSize="3"
                  className="pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {machine.shortName}
                </motion.text>
              </motion.g>
            ))}
          </AnimatePresence>
        </svg>
      </motion.div>
    </motion.div>
  );
}