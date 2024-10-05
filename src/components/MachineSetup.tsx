export type Machine = {
  id: number
  type: "washer" | "dryer"
  status: "available" | "in-use" | "finishing-soon" | "complete" | "disabled"
  timeRemaining: number
  position: { x: number; y: number }
}

const generateMachines = (): Machine[] => {
  const washers = Array.from({ length: 8 }, (_, i) => {
    const machineId = 8 - i;
    const isFunctional = machineId <= 2; // Only washer 1 and 2 are functional
    return {
      id: machineId,
      type: "washer" as const,
      status: isFunctional ? (i % 2 === 0 ? "available" : "in-use") : "disabled",
      timeRemaining: isFunctional ? (i % 2 === 0 ? 0 : Math.floor(Math.random() * 60)) : 0,
      position: { x: 20, y: 20 + i * 15 }, // Adjust spacing for 8 washers
    };
  });

  const dryers = Array.from({ length: 6 }, (_, i) => {
    const machineId = 6 - i;
    const isFunctional = machineId <= 2; // Only dryer 1 and 2 are functional
    return {
      id: machineId,
      type: "dryer" as const,
      status: isFunctional ? (i % 2 === 0 ? "available" : "in-use") : "disabled",
      timeRemaining: isFunctional ? (i % 2 === 0 ? 0 : Math.floor(Math.random() * 60)) : 0,
      position: { x: 80, y: 20 + i * 20 }, // Adjust spacing for 6 dryers
    };
  });

  return [...washers, ...dryers];
}

export function useMachineSetup() {
  return generateMachines();
}
