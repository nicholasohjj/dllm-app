export type Machine = {
  id: number;
  status: "available" | "in-use" | "finishing-soon" | "complete" | "disabled";
  type: "washer" | "dryer";
  position: {
    x: number;
    y: number;
  };
};


type LaundryFloorplanProps = {
  machines: Machine[]
  onSelectMachine: (machineId: number) => void
}

export function LaundryFloorplan({ machines, onSelectMachine }: LaundryFloorplanProps) {
  const getStatusColor = (status: Machine["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "in-use":
        return "bg-yellow-500"
      case "finishing-soon":
        return "bg-orange-500"
      case "complete":
        return "bg-blue-500"
      case "disabled":
        return "bg-gray-400"  // Greyed out for disabled machines
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="relative w-full h-[60vh] bg-gray-100 rounded-lg overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 100 160" className="absolute inset-0">
        <rect x="10" y="10" width="80" height="140" fill="none" stroke="black" strokeWidth="0.5" />
        <text x="50" y="5" textAnchor="middle" fontSize="3">Entrance</text>
        {machines
        
        .map((machine) => (
          <g
            key={machine.id}
            onClick={() => machine.status !== "disabled" && onSelectMachine(machine.id)}  // Only selectable if not disabled
            className={machine.status === "disabled" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          >
            <circle
              cx={machine.position.x}
              cy={machine.position.y}
              r="5"
              fill={getStatusColor(machine.status)}
              className={machine.status !== "disabled" ? "hover:stroke-2 hover:stroke-gray-700" : ""}
            />
            <text
              x={machine.position.x}
              y={machine.position.y + 8}
              textAnchor="middle"
              fontSize="3"
              className="pointer-events-none"
            >
              {machine.type === "washer" ? "W" : "D"}{machine.id}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
