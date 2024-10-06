import { Machine } from "./types";
import { motion } from "framer-motion";

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

  return (
    // lEGEND
    <div className="space-y-4">
      <div className="flex flex-wrap justify-center gap-4 p-4 bg-background rounded-lg shadow">
        {" "}
        {legendItems.map((item) => (
          <div key={item.status} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: getFillColor(item.status) }}
              aria-hidden="true"
            />
            <span className="text-sm font-medium">{item.label}</span>{" "}
          </div>
        ))}
      </div>
      <div className="relative w-full h-[60vh] bg-gray-100 rounded-lg overflow-hidden">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 160"
          className="absolute inset-0"
          aria-label="Laundry room floorplan"
        >
          <rect
            x="10"
            y="10"
            width="80"
            height="140"
            fill="none"
            stroke="black"
            strokeWidth="0.5"
          />
          <text x="50" y="5" textAnchor="middle" fontSize="3">
            Entrance
          </text>
          {machines.map((machine) => (
            <g
              key={machine.id}
              onClick={() =>
                machine.status !== "disabled" && onSelectMachine(machine.id)
              } // Only selectable if not disabled
              className={
                machine.status === "disabled"
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }
            >
              <motion.circle
                cx={machine.position.x}
                cy={machine.position.y}
                r="5"
                fill={getFillColor(machine.status)} // Color based on status
                animate={{
                  scale: 1,
                }}
                onClick={() =>
                  machine.status !== "disabled" && onSelectMachine(machine.id)
                }
                className={
                  machine.status !== "disabled"
                    ? "hover:stroke-2 hover:stroke-gray-700"
                    : ""
                }
                role="button"
                tabIndex={machine.status !== "disabled" ? 0 : -1}
              />
              <text
                x={machine.position.x}
                y={machine.position.y + 8}
                textAnchor="middle"
                fontSize="3"
                className="pointer-events-none"
              >
                {machine.shortName}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
